import { LightCardShadow } from "components/Card"
import Row, { AutoRow } from "components/Row"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { TYPE } from "theme"

import { back, navigate, useLockerPage } from "state/lockerV3/locker.store"
import { ArrowLeft } from "react-feather"
import { ButtonOutlined, ButtonPrimary, ResponsiveButtonEmpty } from "components/Button"
import styled from "styled-components"
import CurrencyLogo from "components/CurrencyLogo"
import { Token } from "constants/uniswap"
import { unwrappedToken } from "utils/wrappedCurrency"
import { IoIosInformationCircleOutline } from "react-icons/io";
import { TimeDiff } from "components/TabComponent/LockTabs/Time"
import { MouseoverTooltip } from "components/Tooltip"
import { useActiveWeb3React } from "hooks"
import { useTransactionAdder } from "state/transactions/hooks"
import { AddressZero } from "@ethersproject/constants"
import { Dots } from "components/swap/styleds"
import { calculateGasMargin, getContract, getLockerV3Contract } from "utils"

import { Pool } from "./types"
import { ETERNAL_LOCK, FEE_SETTINGS, LOCKERV3_ADDRESS } from "../../constants"
import { UNISWAP_V3_POSITION_MANAGERS } from "../../constants"
import positionManagerABI from "../../constants/abis/PositionManager.json"

const TokenInfo = styled.div`
    background: #fff2;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 1em;
    border-radius: 1em;
    .row {
        justify-content: space-between;
        gap: 0.5em;
        .symbol {
            flex: 1;
            color: white;
            font-weight: bold;
        }
        .percent {
            color: white;
            background: #0e7da7;
            padding: 2px 0.5em;
            border-radius: 6px;
        }
    }
`

const LockForm = styled(AutoRow)`
    border: 1px solid ${({ theme }) => theme.bg2};
    margin-top: 1em;
    margin-bottom: 1em;
    border-radius: 1em;
    padding: 1em;
    row-gap: 1em;
`

const FormRow = styled(Row)`
    flex-wrap: wrap;
    gap: 0.5em;
    color: white;
    label {
        flex: 1;
    }    
`

const DateTimePicker = styled(props => <input type="datetime-local" {...props} />)`
    background: transparent;
    width: 100%;
    border: none;
    color: white;
    outline: none;
    font-size: x-large;
    ::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
    }
`

const RowFee = styled(Row)`
    flex: 0 0 100%;
    align-items: stretch;
    justify-content: space-between;
    gap: 1em;
`

const ButtonFee = styled(ButtonOutlined)`
    color: white;
    // flex: 0 0 30%;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    white-space: nowrap;
    h5 {
        font-size: large;
        text-transform: uppercase;
        line-height: 2em;
    }
    &.selected {
        background: ${({ theme }) => theme.primary2};
        border: none;
    }
`

const StyledInput = styled.input`
    background: transparent;
    border: none;
    outline: none;
    font-size: large;
    width: 100%;
    color: white;
`

const ButtonMore = styled(ResponsiveButtonEmpty)`
    color: white;
    border: 1px solid ${({ theme }) => theme.bg1};
    opacity: 0.8;
    padding: 0.5em;
    font-size: small;
`

const ButtonTx = styled(ButtonPrimary)`
    border: 1px solid ${({ theme }) => theme.bg1};
    &:disabled {
        opacity: 0.5;
        background: transparent;
        border-color: white;
    }
`

const Toggle = styled.div<{ active?: boolean }>`
    background-color: ${({ active }) => !active ? "#fff3" : "#fffa"};
    border-radius: 1em;
    width: 3em;
    padding: 2px;
    display: flex;
    justify-content: ${({ active }) => !active ? "flex-start" : "flex-end"};
    &::after {
        content: '';
        height: 1em;
        width: 1em;
        background-color: ${({ active, theme }) => !active ? "#fff5" : theme.primary1};
        border-radius: 1em;
    }
`

function Tooltip({ text }: { text: string }) {
    return <MouseoverTooltip text={text}>
        <IoIosInformationCircleOutline />
    </MouseoverTooltip>
}

function asAddress(address: string, defaultAddress: string = AddressZero) {
    if (/^0x[\da-fA-F]{40}$/.test(address))
        return address
    return defaultAddress
}

export default function Locking() {
    const { params: { pool, reserves, token0, token1 } }: { params: { pool: Pool, reserves: any, token0: Token, token1: Token } } = useLockerPage()
    const { chainId, library, account } = useActiveWeb3React()

    const [more, showMore] = useState(false)
    const [eternally, setEternally] = useState(false)
    const [feeKey, setFeeKey] = useState<string>("DEFAULT")
    const [timeUnlock, setTimeUnlock] = useState<Date>()
    const [defaultTimeUnlock, setDefaultTimeUnlock] = useState<Date>(new Date(Date.now() + 30 * 86400000))
    const [attemptingLock, setAttemptingLock] = useState<boolean>(false)
    const [attemptingApprove, setAttemptingApprove] = useState<boolean>(false)
    const [txHash, setTxHash] = useState<string>('')
    const [dustRecipient, setDustRecipient] = useState<string>('')
    const [owner, setOwner] = useState<string>('')
    const [additionalCollector, setAdditionalCollector] = useState<string>('')
    const [collector, setCollector] = useState<string>('')
    const [approved, setApproved] = useState(false)

    const currency0 = unwrappedToken(token0)
    const currency1 = unwrappedToken(token1)

    const positionManager: any = useMemo(() => UNISWAP_V3_POSITION_MANAGERS.find(pm => pm.title === pool.ammTitle), [pool])

    const addTransaction = useTransactionAdder()
    const NFT = getContract(positionManager?.address, positionManagerABI, library, account)

    const handleApprove = useCallback(() => {
        if (!chainId || !library || !account || !NFT) return
        setAttemptingApprove(true)
        NFT.estimateGas.approve(LOCKERV3_ADDRESS, pool.id).then(gasLimit => {
            NFT.approve(LOCKERV3_ADDRESS, pool.id, { gasLimit: calculateGasMargin(gasLimit) }).then((tx) => {
                addTransaction(tx, {
                    summary: 'Approve v3 liquidity'
                })
                tx.wait().then(() => {
                    setTxHash(tx.hash)
                    setApproved(true)
                    setAttemptingApprove(false)
                })
            }).catch((ex) => {
                console.error(ex)
                setAttemptingApprove(false)
            })
        }).catch((ex) => {
            console.error(ex)
            setAttemptingApprove(false)
        })
    }, [pool, chainId, library, account, NFT, addTransaction])

    const handleLock = useCallback(() => {
        if (!chainId || !library || !account) return
        const locker = getLockerV3Contract(chainId, library, account)
        setAttemptingLock(true)
        
        const lockParams = {
            nftPositionManager: positionManager.address,
            nft_id: String(pool.id),
            dustRecipient: asAddress(dustRecipient),
            owner: asAddress(owner, account),
            additionalCollector: asAddress(additionalCollector),
            collectAddress: asAddress(collector),
            unlockDate: eternally ? ETERNAL_LOCK : Math.floor((timeUnlock ?? defaultTimeUnlock).getTime() / 1000),
            countryCode: 1,
            feeName: feeKey,
            r: []
        }
        locker.estimateGas.lock(lockParams).then(gasLimit => {
            locker.lock(lockParams, { gasLimit: calculateGasMargin(gasLimit) }).then((tx) => {
                addTransaction(tx, {
                    summary: 'Lock v3 pair'
                })
                tx.wait().then(() => {
                    setTxHash(tx.hash)
                    navigate("success", {
                        pool, reserves, token0, token1, timeUnlock: timeUnlock ?? defaultTimeUnlock
                    })
                    setAttemptingLock(false)
                })
            }).catch((ex) => {
                console.error(ex)
                setAttemptingLock(false)
            })
        }).catch((ex) => {
            console.error(ex)
            setAttemptingLock(false)
        })
    }, [account, library, chainId, pool, reserves, token0, token1, dustRecipient, owner, additionalCollector, collector, eternally, timeUnlock, defaultTimeUnlock, feeKey, positionManager, addTransaction])

    useEffect(() => {
        const timer = setInterval(() => setDefaultTimeUnlock(new Date(Date.now() + 30 * 86400000)))
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        NFT.getApproved(pool.id).then(operator => {
            setApproved(operator!==AddressZero)
        })
    }, [NFT, pool])

    return (
        <>
            <AutoRow>
                <Row>
                    <ResponsiveButtonEmpty onClick={() => back()}>
                        <ArrowLeft color="white" />
                        <TYPE.text_xs color="white">Select position</TYPE.text_xs>
                    </ResponsiveButtonEmpty>
                </Row>
                <Row my="1em" justify="center">
                    <TYPE.text_lg fontWeight={600} color={"white"}>
                        Lock Liquidity
                    </TYPE.text_lg>
                </Row>
                <TokenInfo>
                    <Row className="row">
                        <CurrencyLogo currency={currency0} />
                        <TYPE.text_sm className="symbol">{token0.symbol}</TYPE.text_sm>
                        <TYPE.text_xs color="#fffa">{Number(reserves.amount0).toFixed(6)}</TYPE.text_xs>
                        <TYPE.text_xxs className="percent">{Number(reserves.percent0).toFixed(1)}%</TYPE.text_xxs>
                    </Row>
                    <Row className="row">
                        <CurrencyLogo currency={currency1} />
                        <TYPE.text_sm className="symbol">{token1.symbol}</TYPE.text_sm>
                        <TYPE.text_xs color="#fffa">{Number(reserves.amount1).toFixed(6)}</TYPE.text_xs>
                        <TYPE.text_xxs className="percent">{Number(reserves.percent1).toFixed(1)}%</TYPE.text_xxs>
                    </Row>
                </TokenInfo>
                <LockForm>
                    <Row justify="flex-end">
                        <ButtonMore onClick={() => showMore(!more)}>
                            {more ? 'Default' : 'Advanced'}
                        </ButtonMore>
                    </Row>
                    {
                        more &&
                        <>
                            <FormRow>
                                <label>Dust receiver</label>
                                <Tooltip text="Dust receiver" />
                                <LightCardShadow>
                                    <StyledInput value={dustRecipient} onChange={(e: any) => setDustRecipient(e.target.value)} />
                                </LightCardShadow>
                            </FormRow>
                            <FormRow>
                                <label>Owner</label>
                                <Tooltip text="About Owner" />
                                <LightCardShadow>
                                    <StyledInput value={owner} onChange={(e: any) => setOwner(e.target.value)} />
                                </LightCardShadow>
                            </FormRow>
                            <FormRow>
                                <label>Additional Collector</label>
                                <Tooltip text="About Additional Collector" />
                                <LightCardShadow>
                                    <StyledInput value={additionalCollector} onChange={(e: any) => setAdditionalCollector(e.target.value)} />
                                </LightCardShadow>
                            </FormRow>
                        </>
                    }
                    <FormRow>
                        <label>Collect Address</label>
                        <Tooltip text="About Collect Address" />
                        <LightCardShadow>
                            <StyledInput type="text" value={collector} onChange={(e: any) => setCollector(e.target.value)} />
                        </LightCardShadow>
                    </FormRow>
                    <FormRow>
                        <label>Unlock Date</label>
                        Lock eternally
                        <Toggle active={eternally} onClick={() => setEternally(!eternally)} />
                        {
                            !eternally &&
                            <LightCardShadow>
                                <AutoRow>
                                    <DateTimePicker value={(timeUnlock ?? defaultTimeUnlock).toLocaleString('sv').slice(0, -3)} onChange={(e) => setTimeUnlock(new Date(e.target.value))} />
                                    <TYPE.text_xs fontWeight={400} color={"white"} width={"100%"}>
                                        (<TimeDiff time={timeUnlock ?? defaultTimeUnlock} postfix={(timeUnlock ?? defaultTimeUnlock) > new Date() ? "after" : "ago"} />)
                                    </TYPE.text_xs>
                                </AutoRow>
                            </LightCardShadow>
                        }
                    </FormRow>
                    <FormRow>
                        <label>Fee options</label>
                        <RowFee style={{ flex: '0 0 100%' }}>
                            {
                                Object.entries(FEE_SETTINGS).map(([key, fee]: any) =>
                                    <ButtonFee key={`fee-${key}`} className={feeKey === key ? "selected" : ""} onClick={() => setFeeKey(key)}>
                                        <h5>{key}</h5>
                                        <span>{fee.liquidity}% liquidity</span>
                                        <span>{fee.collect}% collect fee</span>
                                    </ButtonFee>
                                )
                            }
                        </RowFee>
                    </FormRow>
                </LockForm>
                <Row gap="1em">
                    <ButtonTx onClick={handleApprove} disabled={attemptingApprove || approved}>
                        <TYPE.text_xs fontWeight={500} color={"white"} textAlign={'center'} marginBottom={"4px"}>
                            {!approved && attemptingApprove ? (
                                <Dots>Approving</Dots>
                            ) : (
                                'Approve'
                            )}
                        </TYPE.text_xs>
                    </ButtonTx>
                    <ButtonTx onClick={handleLock} disabled={attemptingLock || !approved}>
                        <TYPE.text_xs fontWeight={500} color={"white"} textAlign={'center'} marginBottom={"4px"}>
                            {attemptingLock ? (
                                <Dots>Locking</Dots>
                            ) : (
                                'Lock'
                            )}
                        </TYPE.text_xs>
                    </ButtonTx>
                </Row>
            </AutoRow>
        </>
    )
}