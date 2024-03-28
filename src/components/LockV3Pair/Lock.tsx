import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useActiveWeb3React } from "hooks"
import styled, { keyframes } from "styled-components"
import Row, { AutoRow } from "components/Row"
import { ButtonOutlined } from "components/Button"
import { calculateGasMargin, getContract, getLockerV3Contract } from "utils"
import { useToken } from "hooks/Tokens"
import { useSingleCallResult } from "state/multicall/hooks"
import { unwrappedToken } from "utils/wrappedCurrency"
import { useTransactionAdder } from "state/transactions/hooks"
import { parseEther, parseUnits } from "@ethersproject/units"
import { TYPE } from "theme"
import { MdLockOutline } from "react-icons/md"
import CurrencyLogo from "components/CurrencyLogo"
import { Dots } from "components/swap/styleds"
import { LightCardShadow } from "components/Card"
import { TimeDiff } from "components/TabComponent/LockTabs/Time"

import Loading from "./Loading"
import { Pool } from "./types"
import poolABI from "../../constants/abis/UniswapV3Pool.json";

const StyledLock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1em;
    border: 1px solid ${({theme}) => theme.bg1};
    border-radius: 1em;
    width: 100%;
    padding: 1em;
    position: relative;
`

const Tools = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
`

const Modal = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 2em;
    gap: 1em;
    display: flex;
    flex-direction: column;
    background: #29addf;
    z-index: 1;
    border-radius: 1em;
    button {
        color: white;
    }    
`

const FormRow = styled(Row)`
    flex-wrap: wrap;
    gap: 0.5em;
    color: white;
    label {
        flex: 1;
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

const StyledInput = styled.input`
    background: transparent;
    border: none;
    outline: none;
    font-size: large;
    width: 100%;
    color: white;
`

const ButtonTool = styled(ButtonOutlined)`
    flex: 0 0 calc(50% - 0.25em);
    color: white;
    border-color: #fff8;
    &.active {
        background: #fff3;
        color: white;
        opacity: 1;
    }
`

const Error = styled(Row)`
    border: 1px solid red;
    background: #fff8;
    color: red;
    justify-content: center;
    padding: 1em;
    border-radius: 1em;
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

const blinker = keyframes`
    50% {
        background: #ffcccce0;
    }
`

const InputWrapper = styled(LightCardShadow)`
    &.error {
        animation: 1s ${blinker} linear infinite;
    }
`

const Q96 = 2 ** 96 // BigNumber.from(2).pow(96);

const extractReason = (err: any) => {
    if(err.data?.message)
        return err.data.message
    const match = /with the following reason:(.+)Contract Call:/gmi.exec(err.message.replaceAll('\n', ''))
    if (match)
      return match[1]
    // return err.message.split(/[\.\n]+/)?.[0] ?? err.message
    return err.message.split(/[.\n]+/)?.[0] ?? err.message
}

function getTickAtSqrtPrice(sqrtPriceX96){
	let tick = Math.floor(Math.log((sqrtPriceX96 / Q96)**2)/Math.log(1.0001));
	return tick;
}

function getTokenAmounts(liquidity: number, sqrtPriceX96: number, tickLow: number, tickHigh: number, decimal0: number, decimal1: number){
	const sqrtRatioA = Math.sqrt(1.0001**tickLow);
	const sqrtRatioB = Math.sqrt(1.0001**tickHigh);
	const currentTick = getTickAtSqrtPrice(sqrtPriceX96);
    const sqrtPrice = sqrtPriceX96 / Q96;
	let amount0 = 0;
	let amount1 = 0;
	if(currentTick < tickLow){
		amount0 = Math.floor(liquidity*((sqrtRatioB-sqrtRatioA)/(sqrtRatioA*sqrtRatioB)));
	}
	else if(currentTick >= tickHigh){
		amount1 = Math.floor(liquidity*(sqrtRatioB-sqrtRatioA));
	}
	else if(currentTick >= tickLow && currentTick < tickHigh){ 
		amount0 = Math.floor(liquidity*((sqrtRatioB-sqrtPrice)/(sqrtPrice*sqrtRatioB)));
		amount1 = Math.floor(liquidity*(sqrtPrice-sqrtRatioA));
	}

	const amount0Human = (amount0/(10**decimal0)).toFixed(decimal0);
	const amount1Human = (amount1/(10**decimal1)).toFixed(decimal1);
    
	return {
        amount0,
        amount0Human, 
        amount1,
        amount1Human, 
    }
}

export default function Lock({ pool, lock } : { pool: Pool, lock: any }) {
    const [expand, setExpand] = useState(false)
    const [now, setNow] = useState<number>(Date.now())
    const [modal, showModal] = useState<string>()

    const { chainId, library, account } = useActiveWeb3React()
    const [attempting, setAttempting] = useState<string>()
    // const [txHash, setTxHash] = useState<string>('')
    const [error, setError] = useState<string>()
    const [inputError, setInputError] = useState<string>()

    const [params, setParams] = useState<any>({})

    const UniswapV3Pool = getContract(pool.address, poolABI, library)
    const token0 = useToken(pool.token0)
    const token1 = useToken(pool.token1)

    const poolState = useSingleCallResult(UniswapV3Pool, 'slot0')

    const reserves = useMemo(() => {
        if(!poolState.loading && poolState.valid && poolState.result) {
            return getTokenAmounts(
                Number(pool.liquidity.toString()),
                Number(poolState.result.sqrtPriceX96.toString()),
                pool.tickLower,
                pool.tickUpper,
                token0.decimals,
                token1.decimals
            )
        }
        return undefined
    }, [poolState, token0, token1, pool])

    const currency0 = unwrappedToken(token0)
    const currency1 = unwrappedToken(token1)

    const addTransaction = useTransactionAdder()

    const Locker = getLockerV3Contract(chainId, library, account)
    
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 30000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        if(error)
            setTimeout(() => setError(undefined), 10000)
    }, [error])

    useEffect(() => {
        if(!!modal) {
            setParams({})
            setInputError(undefined)
        }
    }, [modal])

    const defaultTimeUnlock = useMemo(() => new Date(now + 30 * 86400000), [now])

    const handleAction = (methodName: string, ...args: any[]) => {
        if (!chainId || !library || !account) return
        showModal(undefined)
        setError(undefined)
        setAttempting(methodName)
        Locker.estimateGas[methodName](...args).then(gasLimit => {
            Locker[methodName](...args, { gasLimit: calculateGasMargin(gasLimit) }).then((tx) => {
                addTransaction(tx, {
                    summary: `${methodName.toUpperCase()} v3 lock`
                })
                tx.wait().then(() => {
                    // setTxHash(tx.hash)
                    setAttempting(undefined)
                })
            }).catch((ex) => {
                setError(extractReason(ex))
                setAttempting(undefined)
            })
        }).catch((ex) => {
            setError(extractReason(ex))
            setAttempting(undefined)
        })
    }

    const handleWithdaw = useCallback(() => {
        handleAction('withdraw', lock.id, account)
    }, [account, library, chainId, Locker, lock, handleAction])
    const handleCollect = useCallback(() => {
        if(!/^0x[\da-fA-F]{40}$/.test(params.recipient)) {
            setInputError("recipient")
            return
        }
        if(!Number(params.amount0Max)) {
            setInputError("amount0Max")
            return
        }
        if(!Number(params.amount1Max)) {
            setInputError("amount1Max")
            return
        }
        handleAction('collect', lock.id, params.recipient, parseUnits(params.amount0Max, token0.decimals), parseUnits(params.amount1Max, token1.decimals))
    }, [account, library, chainId, Locker, lock, params, handleAction])
    const handleRelock = useCallback(() => {
        handleAction('relock', lock.id, Math.floor((params.timeUnlock ?? defaultTimeUnlock).getTime() / 1000))
    }, [account, library, chainId, Locker, lock, params, handleAction])
    const handleAdditionalCollector = useCallback(() => {
        if(!/^0x[\da-fA-F]{40}$/.test(params.additionalCollector)) {
            setInputError("additionalCollector")
            return
        }
        handleAction('setAdditionalCollector', lock.id, params.additionalCollector)
    }, [account, library, chainId, Locker, lock, params, handleAction])
    const handleCollectAddress = useCallback(() => {
        if(!/^0x[\da-fA-F]{40}$/.test(params.collectAddress)) {
            setInputError("collectAddress")
            return
        }
        handleAction('setCollectAddress', lock.id, params.collectAddress)
    }, [account, library, chainId, Locker, lock, params, handleAction])
    const handleTransferOwnership = useCallback(() => {
        if(!/^0x[\da-fA-F]{40}$/.test(params.newOwner)) {
            setInputError("newOwner")
            return
        }
        handleAction('transferLockOwnership', lock.id, params.newOwner)
    }, [account, library, chainId, Locker, lock, params, handleAction])
    const handleAcceptOwnership = useCallback(() => {
        if(!/^0x[\da-fA-F]{40}$/.test(params.collectAddress)) {
            setInputError("collectAddress")
            return
        }
        handleAction('acceptLockOwnership', lock.id, params.collectAddress)
    }, [account, library, chainId, Locker, lock, params, handleAction])
    const handleIncLiquidity = useCallback(() => {
        if(!Number(params.liquidity)) {
            setInputError("liquidity")
            return
        }
        if(!Number(params.amount0)) {
            setInputError("amount0")
            return
        }
        if(!Number(params.amount1)) {
            setInputError("amount1")
            return
        }
        handleAction('increaseLiquidity', lock.id, {
            liquidity: parseEther(params.liquidity),
            amount0: parseUnits(params.amount0, token0.decimals),
            amount1: parseUnits(params.amount1, token1.decimals),
        })
    }, [account, library, chainId, Locker, lock, params, handleAction])

    return <StyledLock onClick={() => setExpand(!expand)}>
        <Row justify="space-between" my={1}>
            <TYPE.text_xs color="#fff8">{pool.ammTitle}</TYPE.text_xs>
            <MdLockOutline color="green" />
        </Row>
        {
            !token0 || !token1 || !reserves
            ? <Loading style={{ height: '3em' }} />
            : <>
                <Row justify="space-between" gap="1em">
                    <CurrencyLogo currency={currency0} />
                    <TYPE.text_sm color="white" style={{flex: 1}}>{currency0.symbol}</TYPE.text_sm>
                    <TYPE.text_xs color="#fff8">{Number(reserves.amount0Human).toFixed(Math.min(6, token0.decimals))}</TYPE.text_xs>
                </Row>
                <Row justify="space-between" gap="1em">
                    <CurrencyLogo currency={currency1} />
                    <TYPE.text_sm color="white" style={{flex: 1}}>{currency1.symbol}</TYPE.text_sm>
                    <TYPE.text_xs color="#fff8">{Number(reserves.amount1Human).toFixed(Math.min(6, token1.decimals))}</TYPE.text_xs>
                </Row>
                {
                    error &&
                    <Error>{error}</Error>
                }
                {
                    expand &&
                    <Tools onClick={(e) => e.stopPropagation()}>
                        <ButtonTool onClick={handleWithdaw} disabled={!!attempting || (lock.timeUnlock * 1000 < now)} className={attempting==="withdraw" ? "active" : ""}>
                            Withdraw{ attempting==="withdraw" && <Dots>ing</Dots>}
                        </ButtonTool>
                        <ButtonTool onClick={() => showModal("collect")} disabled={!!attempting} className={attempting==="collect" ? "active" : ""}>
                            Collect{ attempting==="collect" && <Dots>ing</Dots>}
                        </ButtonTool>
                        <ButtonTool onClick={() => showModal("relock")} disabled={!!attempting} className={attempting==="relock" ? "active" : ""}>
                            Relock{ attempting==="relock" && <Dots>ing</Dots>}
                        </ButtonTool>
                        <ButtonTool onClick={() => showModal("setAdditionalCollector")} disabled={!!attempting} className={attempting==="setAdditionalCollector" ? "active" : ""}>
                            { attempting==="setAdditionalCollector" ? <Dots>Setting additional</Dots> : 'Additional collector'}
                        </ButtonTool>
                        <ButtonTool onClick={() => showModal("setCollectAddress")} disabled={!!attempting} className={attempting==="setCollectAddress" ? "active" : ""}>
                            { attempting==="setCollectAddress" ? <Dots>Setting collect address</Dots> : 'Collect address'}
                        </ButtonTool>
                        <ButtonTool onClick={() => showModal("transferLockOwnership")} disabled={!!attempting} className={attempting==="transferLockOwnership" ? "active" : ""}>
                            Transfer{ attempting==="transferLockOwnership" && <Dots>ing</Dots>} ownership
                        </ButtonTool>
                        <ButtonTool onClick={() => showModal("acceptLockOwnership")} disabled={!!attempting} className={attempting==="acceptLockOwnership" ? "active" : ""}>
                            Accept{ attempting==="acceptLockOwnership" && <Dots>ing</Dots>} ownership
                        </ButtonTool>
                        <ButtonTool onClick={() => showModal("increaseLiquidity")} disabled={!!attempting} className={attempting==="increaseLiquidity" ? "active" : ""}>
                            Increas{ attempting==="increaseLiquidity" ? <Dots>ing</Dots> : 'e'} liquidity
                        </ButtonTool>
                        {
                            !!modal &&
                            <Modal>
                                {
                                    modal==="collect" &&
                                    <>
                                        <FormRow>
                                            <label>Recipient</label>
                                            <InputWrapper className={inputError==="recipient" ? 'error' : ''}>
                                                <StyledInput value={params.recipient ?? ''} onChange={(e: any) => setParams({...params, recipient: e.target.value})} />
                                            </InputWrapper>
                                        </FormRow>
                                        <FormRow>
                                            <label>Amount0 Max</label>
                                            <InputWrapper className={inputError==="amount0Max" ? 'error' : ''}>
                                                <StyledInput value={params.amount0Max ?? ''} onChange={(e: any) => setParams({...params, amount0Max: e.target.value})} />
                                            </InputWrapper>
                                        </FormRow>
                                        <FormRow>
                                            <label>Amount1 Max</label>
                                            <InputWrapper className={inputError==="amount1Max" ? 'error' : ''}>
                                                <StyledInput value={params.amount1Max ?? ''} onChange={(e: any) => setParams({...params, amount1Max: e.target.value})} />
                                            </InputWrapper>
                                        </FormRow>
                                        <Row gap="1em">
                                            <ButtonOutlined onClick={handleCollect}>Collect</ButtonOutlined>
                                            <ButtonOutlined onClick={() => showModal(undefined)}>Cancel</ButtonOutlined>
                                        </Row>
                                    </>
                                }
                                {
                                    modal==="relock" &&
                                    <>
                                        <FormRow>
                                            <label>Unlock Date</label>
                                            Lock eternally
                                            <Toggle active={params.eternally ?? false} onClick={() => setParams({...params, eternally: !params.eternally})} />
                                            {
                                                !params.eternally &&
                                                <InputWrapper>
                                                    <AutoRow>
                                                        <DateTimePicker value={(params.timeUnlock ?? defaultTimeUnlock).toLocaleString('sv').slice(0, -3)} onChange={(e) => setParams({ ...params, timeUnlock: new Date(e.target.value) })} />
                                                        <TYPE.text_xs fontWeight={400} color={"white"} width={"100%"}>
                                                            (<TimeDiff time={params.timeUnlock ?? defaultTimeUnlock} postfix={(params.timeUnlock ?? defaultTimeUnlock) > now ? "after" : "ago"} />)
                                                        </TYPE.text_xs>
                                                    </AutoRow>
                                                </InputWrapper>
                                            }
                                        </FormRow>
                                        <Row gap="1em">
                                            <ButtonOutlined onClick={handleRelock}>Relock</ButtonOutlined>
                                            <ButtonOutlined onClick={() => showModal(undefined)}>Cancel</ButtonOutlined>
                                        </Row>
                                    </>
                                }
                                {
                                    modal==="setAdditionalCollector" &&
                                    <>
                                        <FormRow>
                                            <label>Additional collector</label>
                                            <InputWrapper className={inputError==="additionalCollector" ? 'error' : ''}>
                                                <StyledInput value={params.additionalCollector ?? ''} onChange={(e: any) => setParams({...params, additionalCollector: e.target.value})} />
                                            </InputWrapper>
                                        </FormRow>
                                        <Row gap="1em">
                                            <ButtonOutlined onClick={handleAdditionalCollector}>Set additional collector</ButtonOutlined>
                                            <ButtonOutlined onClick={() => showModal(undefined)}>Cancel</ButtonOutlined>
                                        </Row>
                                    </>
                                }
                                {
                                    modal==="setCollectAddress" &&
                                    <>
                                        <FormRow>
                                            <label>Collect address</label>
                                            <InputWrapper className={inputError==="collectAddress" ? 'error' : ''}>
                                                <StyledInput value={params.collectAddress ?? ''} onChange={(e: any) => setParams({...params, collectAddress: e.target.value})} />
                                            </InputWrapper>
                                        </FormRow>
                                        <Row gap="1em">
                                            <ButtonOutlined onClick={handleCollectAddress}>Set collect address</ButtonOutlined>
                                            <ButtonOutlined onClick={() => showModal(undefined)}>Cancel</ButtonOutlined>
                                        </Row>
                                    </>
                                }
                                {
                                    modal==="transferLockOwnership" &&
                                    <>
                                        <FormRow>
                                            <label>New owner</label>
                                            <InputWrapper className={inputError==="newOwner" ? 'error' : ''}>
                                                <StyledInput value={params.newOwner ?? ''} onChange={(e: any) => setParams({...params, newOwner: e.target.value})} />
                                            </InputWrapper>
                                        </FormRow>
                                        <Row gap="1em">
                                            <ButtonOutlined onClick={handleTransferOwnership}>Transfer ownership</ButtonOutlined>
                                            <ButtonOutlined onClick={() => showModal(undefined)}>Cancel</ButtonOutlined>
                                        </Row>
                                    </>
                                }
                                {
                                    modal==="acceptLockOwnership" &&
                                    <>
                                        <FormRow>
                                            <label>Collect address</label>
                                            <InputWrapper className={inputError==="collectAddress" ? 'error' : ''}>
                                                <StyledInput value={params.collectAddress ?? ''} onChange={(e: any) => setParams({...params, collectAddress: e.target.value})} />
                                            </InputWrapper>
                                        </FormRow>
                                        <Row gap="1em">
                                            <ButtonOutlined onClick={handleAcceptOwnership}>Accept ownership</ButtonOutlined>
                                            <ButtonOutlined onClick={() => showModal(undefined)}>Cancel</ButtonOutlined>
                                        </Row>
                                    </>
                                }
                                {
                                    modal==="increaseLiquidity" &&
                                    <>
                                        <FormRow>
                                            <label>Liquidity</label>
                                            <InputWrapper className={inputError==="liquidity" ? 'error' : ''}>
                                                <StyledInput value={params.liquidity ?? ''} onChange={(e: any) => setParams({...params, liquidity: e.target.value})} />
                                            </InputWrapper>
                                        </FormRow>
                                        <FormRow>
                                            <label>Amount0</label>
                                            <InputWrapper className={inputError==="amount0" ? 'error' : ''}>
                                                <StyledInput value={params.amount0 ?? ''} onChange={(e: any) => setParams({...params, amount0: e.target.value})} />
                                            </InputWrapper>
                                        </FormRow>
                                        <FormRow>
                                            <label>Amount1</label>
                                            <InputWrapper className={inputError==="amount1" ? 'error' : ''}>
                                                <StyledInput value={params.amount1 ?? ''} onChange={(e: any) => setParams({...params, amount1: e.target.value})} />
                                            </InputWrapper>
                                        </FormRow>
                                        <Row gap="1em">
                                            <ButtonOutlined onClick={handleIncLiquidity}>Increase liquidity</ButtonOutlined>
                                            <ButtonOutlined onClick={() => showModal(undefined)}>Cancel</ButtonOutlined>
                                        </Row>
                                    </>
                                }
                            </Modal>
                        }
                    </Tools>
                }
            </>
        }
    </StyledLock>
}