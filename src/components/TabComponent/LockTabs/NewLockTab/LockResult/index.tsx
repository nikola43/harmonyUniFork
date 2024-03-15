import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ButtonSecondary, ResponsiveButtonEmpty, ResponsiveButtonSecondary } from "components/Button";
import CircularProgressWithContent from "components/CircularProgressWithContent";
import Column from "components/Column";
import Row from "components/Row";
import { ArrowLeft, ArrowUpRight } from "react-feather";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";
import { MdLock, MdLockOutline, MdReplay, MdWaterDrop } from "react-icons/md";
import { backLockerStep, setLockerStep, useLockerState } from "state/locker/locker.store";
import styled from 'styled-components';
import { TYPE } from "theme";
import { LockedAmount, usePair } from 'state/locker/hooks';
import { Fraction, TokenAmount } from 'constants/uniswap';
import { Dots } from 'components/swap/styleds';
import CopyHelper from 'components/AccountDetails/Copy';
import { unwrappedToken } from 'utils/wrappedCurrency';
import CurrencyLogo from 'components/CurrencyLogo';
import TabNavItem from 'components/TabComponent/TabNavItem';
import { calculateGasMargin, getLockerContract } from 'utils';
import { useTransactionAdder } from 'state/transactions/hooks';
import { useActiveWeb3React } from 'hooks';
import { ethers } from 'ethers';

import "../../../LockResultTabs.css";

const BackButton = styled(ResponsiveButtonEmpty)`
  color: white;
`

const LockRateRow = styled(Row)`
    position: relative;
    &::before,
    &::after {
        content: '';
        position: absolute;
        top: 50%;
        height: 2px;
        background-color: #fff7;
        z-index: 0;
    }

    &::before {
        left: 55px;
        right: calc(50% + 42px);;
    }

    &::after {
        left: calc(50% + 42px);;
        right: 55px;
    }
`

const ButtonOutline = styled(ResponsiveButtonSecondary)`
    padding: 4px 12px;
        @media (max-width: 1024px) {
        padding: 3px 9px;
    }
    @media (max-width: 768px) {
        padding: 2px 6px; 
    }
    @media (max-width: 480px) {
        padding: 1px 3px;
    }
`

const Decimal = ({ value, abbr = false, decimals = 2, postfix, prefix }: { value: TokenAmount | Fraction, abbr?: boolean, decimals?: number, prefix?: string, postfix?: string }) => {
    if(value===undefined)
        return <></>
    const units = { 3: 'K', 6: 'M', 9: 'B'}
    const size = value.toFixed(0).length
    let unit = 0
    if(abbr) for(const n in units) {
        if(size > Number(n))
            unit = Number(n)
    }
    const [part1, part2] = value.divide(String(10 ** unit)).toFixed(18).split('.')
    if(Number(part1)===0 && part2) {
      const matches = /^(0*)([^0]\d*)(0*)$/.exec(part2)
      if(matches && matches[1]?.length > 2) {
        return <span>
            { prefix ? prefix : '' }
            <span dangerouslySetInnerHTML={{ __html: [part1?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? 0, `0<sub>${matches[1].length}</sub>${matches[2]?.slice(0, decimals)}`].join('.') }} />
            { unit ? units[unit] : '' }
            { postfix ? postfix : '' }
        </span>
      }
    }
    return <span>
        { prefix ? prefix : '' }
        <span dangerouslySetInnerHTML={{ __html: [part1?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? 0, part2?.replace(/0*$/, '')?.slice(0, decimals)].filter(p => !!p).join('.') }}/>
        { unit ? units[unit] : '' }
        { postfix ? postfix : '' }
    </span>
}

const formatTime = (dt) => {
    const time = new Date(dt)
    return new Intl.DateTimeFormat('en-US', {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(time)
}

const ItemDetail = styled.div`
    background: #0003;
    padding: 0.5em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
`

const LockedItem = ({ lock }: {lock: LockedAmount }) => {
    const [expanded, setExpand] = useState(false)
    const [now, setNow] = useState<number>(Date.now())

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 30000)
        return () => clearInterval(timer)
    }, [])
    
    const timeAfter = useCallback((timeUnlock) => {
        let mins = Math.floor((timeUnlock.getTime() - now) / 60000) + 1
        if(mins < 60)
            return `in ${mins} minute${mins===1 ? '' : 's'}`
        let hours = Math.floor(mins / 60)
        mins = mins % 60
        if(hours < 24)
            return `in ${hours} hour${hours===1 ? '' : 's'} ${mins > 0 ? `${mins} minute${mins===1 ? '' : 's'}` : ''}`
        let days = Math.floor(hours / 24)
        hours = hours % 24
        return `in ${days} day${days===1 ? '' : 's'} ${hours > 0 ? `${hours} hour${hours===1 ? '' : 's'}` : ''}`
    }, [now])

    return <div onClick={() => setExpand(!expanded)}>
        <Row justify="space-between" marginY={"4px"}>
            <Column style={{ alignItems: "flex-start" }}>
                <TYPE.text_xs color={"green"} >$0</TYPE.text_xs>
                <TYPE.text_xxs color={"white"} >
                    <Decimal postfix=" UNIV2" value={lock} abbr decimals={6} />
                </TYPE.text_xxs>
            </Column>
            <Row justify="flex-end" width="unset" gap="8px">
                <Column style={{ alignItems: "flex-end" }}>
                    <TYPE.text_xs color={"white"} fontWeight={"bold"}>
                        {timeAfter(lock.unlockDate)}
                    </TYPE.text_xs>
                    <TYPE.text_xxs color={"white"} >
                        {formatTime(lock.unlockDate)}
                    </TYPE.text_xxs>
                </Column>
                <MdLockOutline size="24px"/>
                {
                    expanded
                    ? <RxCaretUp />
                    : <RxCaretDown />
                }
            </Row>
        </Row>
        {
            expanded && <ItemDetail>
                <TYPE.text_xxs color={"white"} >Owner: {lock.owner}</TYPE.text_xxs>
                <TYPE.text_xxs color={"white"} >ID: {lock.lockID}</TYPE.text_xxs>
            </ItemDetail>
        }
        <hr style={{ borderTop: "none", borderBottom: "1px solid #92c9eb" }} />
    </div>
}

const UnlockedItem = ({ lock }: {lock: LockedAmount }) => {
    const [expanded, setExpand] = useState(false)
    const [now, setNow] = useState<number>(Date.now())
    const [attemptingWithdraw, setAttemptingWithdraw] = useState<boolean>(false)
    const { chainId, library, account } = useActiveWeb3React()

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 30000)
        return () => clearInterval(timer)
    }, [])
        
    const timeAgo = useCallback((timeUnlock) => {
        let mins = Math.floor((now - timeUnlock.getTime()) / 60000) + 1
        if(mins < 60)
            return `${mins} minute${mins===1 ? '' : 's'} ago`
        let hours = Math.floor(mins / 60)
        mins = mins % 60
        if(hours < 24)
            return `${hours} hour${hours===1 ? '' : 's'} ${mins > 0 ? `${mins} minute${mins===1 ? '' : 's'}` : ''} ago`
        let days = Math.floor(hours / 24)
        hours = hours % 24
        return `${days} day${days===1 ? '' : 's'} ${hours > 0 ? `${hours} hour${hours===1 ? '' : 's'}` : ''} ago`
    }, [now])

    const addTransaction = useTransactionAdder()

    const handleWithdraw = useCallback((e) => {
        e.stopPropagation()
        if (!chainId || !library || !account) return
        const locker = getLockerContract(chainId, library, account)
        setAttemptingWithdraw(true)
        const args = [
            lock.lockID, ethers.utils.parseUnits(lock.toExact(), lock.token.decimals)
        ]
        locker.estimateGas.withdraw(...args).then(gasLimit => {
            locker.withdraw(...args, { gasLimit: calculateGasMargin(gasLimit) }).then((response) => {
                addTransaction(response, {
                    summary: 'Withdraw pair'
                })        
                response.wait().then(() => {
                    setAttemptingWithdraw(false)
                })
            }).catch(() => {
                setAttemptingWithdraw(false)
            })
        }).catch(() => {
            setAttemptingWithdraw(false)
        })
    }, [account, library, chainId, addTransaction, lock])

    return <div onClick={() => setExpand(!expanded)}>
        <Row justify="space-between" marginY={"4px"}>
            <Column style={{ alignItems: "flex-start" }}>
                <TYPE.text_xs color={"green"} >$0</TYPE.text_xs>
                <TYPE.text_xxs color={"white"} >
                    <Decimal postfix=" UNIV2" value={lock} abbr decimals={6} />
                </TYPE.text_xxs>
            </Column>
            <Row justify="flex-end" width="unset" gap="8px">
                <Column style={{ alignItems: "flex-end" }}>
                    <TYPE.text_xs color={"white"} fontWeight={"bold"}>
                        {timeAgo(lock.unlockDate)}
                    </TYPE.text_xs>
                    <TYPE.text_xxs color={"white"} >
                        {formatTime(lock.unlockDate)}
                    </TYPE.text_xxs>
                </Column>
                <MdLockOutline size="24px"/>
                {
                    expanded
                    ? <RxCaretUp />
                    : <RxCaretDown />
                }
            </Row>
        </Row>
        {
            expanded && <ItemDetail>
                <TYPE.text_xxs color={"white"} >Owner: {lock.owner}</TYPE.text_xxs>
                <TYPE.text_xxs color={"white"} >ID: {lock.lockID}</TYPE.text_xxs>
                <ButtonSecondary onClick={handleWithdraw} disabled={attemptingWithdraw}>
                    <TYPE.text_xxs color={"white"} >
                        Withdraw
                        { attemptingWithdraw && <Dots>ing</Dots> }
                    </TYPE.text_xxs>
                </ButtonSecondary>
            </ItemDetail>
        }
        <hr style={{ borderTop: "none", borderBottom: "1px solid #92c9eb" }} />
    </div>
}

function LockResult() {
    // const [lockerStep] = useLockerState("lockerStep");
    const [pairSelected] = useLockerState("pairSelected");
    const [activeTab, setActiveTab] = useState("locked");

    const [now, setNow] = useState<number>(Date.now())

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 30000)
        return () => clearInterval(timer)
    }, [])

    const pair = usePair(pairSelected)

    const totalLocked = useMemo(() => pair ? pair.locks.reduce((sum, lock) => {
        if(sum)
            return sum.add(lock)
        return lock
    }, undefined) : undefined, [pair])
    
    const handleBackClick = () => {
        backLockerStep()
    }

    const handleViewLockPage = () => {
        setLockerStep("pair_selected", true)
    }

    const currency0 = unwrappedToken(pair?.token0)
    const currency1 = unwrappedToken(pair?.token1)

    const lockedPercent = useMemo(() => totalLocked?.divide(pair?.totalSupply).multiply('100').toFixed(2), [totalLocked, pair])
    const lockedItems = pair?.locks?.filter(lock => lock.unlockDate > new Date(now))
    const unlockedItems = pair?.locks?.filter(lock => lock.unlockDate <= new Date(now))

    useEffect(() => {
        if(pair && (!pair.locks || pair.locks.length===0))
            setLockerStep("initial")
    }, [pair])

    return (
        <>
            <Row justify="space-between">
                <BackButton onClick={handleBackClick}>
                    <ArrowLeft /><TYPE.text_xs color={"white"}>Back</TYPE.text_xs>
                </BackButton>
                <ButtonOutline
                    onClick={handleViewLockPage}
                >
                    <MdLock style={{ fontSize: "18px", color: "white", margin: "4px" }} />
                    <TYPE.text_xxs color={"white"} textAlign={'center'}>
                        Lock Liquidity
                    </TYPE.text_xxs>
                </ButtonOutline>
            </Row>
            <Row justify="center">
                <TYPE.text_xxs color={"primary5"} textAlign={'center'} marginY={"4px"}>
                    Uniswap V2 pair: {pairSelected.slice(0, 6)}...{pairSelected.slice(-4)}
                </TYPE.text_xxs>
                <CopyHelper toCopy={pairSelected}/>
            </Row>
            {
                pair && totalLocked
                ? <> 
                    <TYPE.text_xs color={"white"} marginTop={"16px"}>
                        1 {pair.token0.symbol} = <Decimal value={pair.token1.balance.divide(pair.token0.balance)} abbr decimals={6}/> {pair.token1.symbol}
                    </TYPE.text_xs>
                    <TYPE.text_xs color={"white"} >
                        1 {pair.token1.symbol} = <Decimal value={pair.token0.balance.divide(pair.token1.balance)} abbr decimals={6}/> {pair.token0.symbol}
                    </TYPE.text_xs>
                    <TYPE.text_xxs color={"primary5"} textAlign={'center'} marginY={"4px"}>
                        Locked Liquidity
                    </TYPE.text_xxs>
                    <TYPE.text_sm color={"white"} textAlign={'center'}>
                        {lockedPercent}%
                    </TYPE.text_sm>
                    <LockRateRow justify="space-between" marginY={"2px"}>
                        <CircularProgressWithContent content={<CurrencyLogo currency={currency0} size="40px"/>} value={lockedPercent} />
                        <CircularProgressWithContent size={80} content={<MdLock size={"60px"} />} value={lockedPercent} />
                        <CircularProgressWithContent content={<CurrencyLogo currency={currency1} size="40px"/>} value={lockedPercent} />
                    </LockRateRow>
                    <Row justify="space-between">
                        <TYPE.text_sm color={"white"}>
                            {pair.token0.symbol}
                        </TYPE.text_sm>
                        <TYPE.text_sm color={"white"}>
                            {pair.token1.symbol}
                        </TYPE.text_sm>
                    </Row>
                    <Row justify="space-between">
                        <Row gap="4px">
                            <MdLock color="green" />
                            <CurrencyLogo currency={currency0}/>
                            <TYPE.text_xs color={"green"}>
                                <Decimal value={pair.token0.balance.multiply(totalLocked.divide(pair.totalSupply))} decimals={6} abbr />
                            </TYPE.text_xs>
                        </Row>
                        <Row justify="end" gap="4px">
                            <TYPE.text_xs color={"green"}>
                                <Decimal value={pair.token1.balance.multiply(totalLocked.divide(pair.totalSupply))} decimals={6} abbr />
                            </TYPE.text_xs>
                            <CurrencyLogo currency={currency1}/>
                            <MdLock color="green" />
                        </Row>
                    </Row>
                    <Row justify="space-between">
                        <Row gap="4px">
                            <MdWaterDrop />
                            <CurrencyLogo currency={currency0} size="24px"/>
                            <TYPE.text_xs color={"white"}>
                                <Decimal value={pair.token0.balance.multiply(pair.balance.divide(pair.totalSupply))} decimals={6} abbr />
                                ({pair.token0.balance.multiply(pair.balance.divide(pair.totalSupply)).divide(pair.token0.totalSupply).multiply('100').toFixed(1)}%)
                            </TYPE.text_xs>
                        </Row>
                        <Row justify="end" gap="4px">
                            <TYPE.text_xs color={"white"}>
                                ({pair.token1.balance.multiply(pair.balance.divide(pair.totalSupply)).divide(pair.token1.totalSupply).multiply('100').toFixed(1)}%)
                                <Decimal value={pair.token1.balance.multiply(pair.balance.divide(pair.totalSupply))} decimals={6} abbr />
                            </TYPE.text_xs>
                            <CurrencyLogo currency={currency1} size="24px"/>
                            <MdWaterDrop />
                        </Row>
                    </Row>
                    {/* <Row justify="space-between">
                        <img width={'24px'} src={uniLogo} alt="logo" style={{ padding: "2px" }} />
                        <img width={'24px'} src={uniLogo} alt="logo" style={{ padding: "2px" }} />
                    </Row> */}

                    <hr style={{ borderTop: "none", borderBottom: "1px solid #92c9eb", marginTop: "12px" }} />

                    <Row justify="center" marginY={"4px"}>
                        <MdReplay size={"20px"} />
                        <Row width={"fit-content"} style={{ margin: "0px 16px" }}>
                            <TYPE.text_xxs color={"white"}>Etherscan</TYPE.text_xxs>
                            <ArrowUpRight />
                        </Row>
                        <Row width={"fit-content"}>
                            <TYPE.text_xxs color={"white"}>Uniswap V2 - Goerli</TYPE.text_xxs>
                            <ArrowUpRight />
                        </Row>
                    </Row>

                    <hr style={{ borderTop: "none", borderBottom: "1px solid #92c9eb", marginBottom: "32px" }} />

                    <Row justify="space-between">
                        <TYPE.text_xxs color={"white"}>Total LP tokens</TYPE.text_xxs>
                        <TYPE.text_xxs color={"white"}>
                            <Decimal value={pair.totalSupply} abbr decimals={8} />
                        </TYPE.text_xxs>
                    </Row>
                    <Row justify="space-between">
                        <TYPE.text_xxs color={"white"}>Total locked LP</TYPE.text_xxs>
                        <TYPE.text_xxs color={"green"}>
                            <Decimal value={totalLocked} abbr decimals={8} />
                        </TYPE.text_xxs>
                    </Row>
                    <TYPE.text_xxs color={"red1"}>
                        Uniswap V2 - Goerli price API is down dolalr value not determinable
                    </TYPE.text_xxs>
                    <div className="LockResultTabs">
                        <ul className="nav">
                            <TabNavItem title={`LOCKED (${lockedItems.length})`} id="locked" activeTab={activeTab} setActiveTab={setActiveTab} />
                            <TabNavItem title={`UNLOCKED (${unlockedItems.length})`} id="unlocked" activeTab={activeTab} setActiveTab={setActiveTab} />
                        </ul>
                        <div className="ResultTabLocked">
                            {
                                activeTab==="locked" && 
                                <TYPE.text_xxs color={"white"}>
                                    Please be aware only the liquidity tokens are locked. Not the actual dollar value.
                                    This changes as people trade. More liquidity tokens are also minted as people add liquidity to the pool.
                                </TYPE.text_xxs>
                            }
                        </div>
                        <Row justify="space-between" marginTop={"32px"}>
                            <TYPE.text_xs color={"white"} fontStyle={"italic"}>Value</TYPE.text_xs>
                            <TYPE.text_xs color={"white"} fontStyle={"italic"}>Unlock date</TYPE.text_xs>
                        </Row>
                        {
                            activeTab==="locked" && lockedItems.map(lock => (
                                <LockedItem key={`locked-row-${lock.lockID}`} lock={lock} />
                            ))
                        }
                        {
                            activeTab==="unlocked" && unlockedItems.map(lock => (
                                <UnlockedItem key={`unlocked-row-${lock.lockID}`} lock={lock} />
                            ))
                        }
                    </div>
                </>
                : <Row justify="center" marginY={"18em"}>
                    <TYPE.text_xs color={"white"}><Dots>Loading</Dots></TYPE.text_xs>
                </Row>
            }
        </>
    );
};
export default LockResult;

