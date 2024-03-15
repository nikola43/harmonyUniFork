import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from 'styled-components'
import { ArrowLeft } from 'react-feather'
import Row, { AutoRow } from "components/Row";
import Column, { ColumnCenter } from "components/Column";
import { LightCardShadow } from "components/Card";
import { ResponsiveButtonEmpty, ResponsiveButtonPrimary, ResponsiveButtonSecondary } from "components/Button";
import { TYPE } from "theme";
import LockSuccess from "../LockSuccess";
import { useLockerState, setLockerStep, backLockerStep } from 'state/locker/locker.store'
import { usePair } from "state/locker/hooks";
import CurrencyLogo from "components/CurrencyLogo";
import { unwrappedToken } from "utils/wrappedCurrency";
import { ETHER, TokenAmount } from "constants/uniswap";
import { useActiveWeb3React } from "hooks";
import { useETHBalances } from "state/wallet/hooks";
import { Dots } from "components/swap/styleds";
import { ApprovalState, useApproveCallback } from "hooks/useApproveCallback";
import { LOCKER_ADDRESS } from "constants/index";
import { ethers } from "ethers";
import { useTransactionAdder } from "state/transactions/hooks";
import { calculateGasMargin, getLockerContract } from "utils";
import TransactionConfirmationModal, { ConfirmationModalContent } from "components/TransactionConfirmationModal";

const BackButton = styled(ResponsiveButtonEmpty)`
  color: white;
`

const LockInnerCard = styled(LightCardShadow) <{ width?: string; padding?: string; border?: string; borderRadius?: string }>`
  margin: 0 auto;
`;

const ButtonMax = styled(ResponsiveButtonPrimary)`
  border-radius: 4px;
  padding: 6px 10px; 
  @media (max-width: 1024px) {
    padding: 5px 8px;
  }
  @media (max-width: 768px) {
    padding: 4px 6px; 
  }
  @media (max-width: 480px) {
    padding: 3px 4px;
  }
`

const LockPercentButton = styled(ResponsiveButtonSecondary)`
  color: white;
  margin-right: 4px;
  padding: 6px 12px;
  @media (max-width: 1024px) {
    margin-right: 3px;
    padding: 5px 10px;
  }
  @media (max-width: 768px) {
    margin-right: 2px;
    padding: 4px 8px;
  }
  @media (max-width: 480px) {
    margin-right: 1px;
    padding: 3px 6px;
  }
`

const ButtonFeeOptions = styled(ResponsiveButtonSecondary)`
  border-radius: 4px;
  padding: 24px 72px; 
  @media (max-width: 1024px) {
    padding: 18px 54px;
  }
  @media (max-width: 768px) {
    padding: 12px 36px; 
  }
  @media (max-width: 480px) {
    padding: 6px 18px;
  }
`

const LockEndButton = styled(ResponsiveButtonSecondary)`
  border-radius: 4px;
  flex: 1 1 0px;
  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
  }
  @media (max-width: 480px) {
  }
`

const Amount = styled.input`
  color: white;
  border: none;
  background: transparent;
  flex-grow: 1;
  font-size: x-large;
  outline: none;
  ::placeholder {
    color: white;
  }
`

const DateTimePicker = styled(props => <input type="datetime-local" {...props}/>)`
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

const Wrapper = styled.div`
  position: relative;
`

function PairLock() {
  const [lockerStep] = useLockerState("lockerStep");
  const [pairSelected] = useLockerState("pairSelected");
  const { chainId, library, account } = useActiveWeb3React()

  const [amount, setAmount] = useState<string>()
  const [timeUnlock, setTimeUnlock] = useState<Date>()
  const [defaultTimeUnlock, setDefaultTimeUnlock] = useState<Date>(new Date(Date.now() + 30 * 86400000))
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingLock, setAttemptingLock] = useState<boolean>(false)
  const [attemptingApprove, setAttemptingApprove] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')

  const pairFound = usePair(pairSelected)

  const currency0 = pairFound?.token0 ? unwrappedToken(pairFound.token0) : undefined
  const currency1 = pairFound?.token1 ? unwrappedToken(pairFound.token1) : undefined
  const balanceETH = useETHBalances([account])

  const handleBackClick = () => {
    backLockerStep()
  }

  const handlePercent = (percent) => {
    setAmount(pairFound?.balance?.multiply(percent).divide('100').toFixed(pairFound?.decimals))
  }

  const handleAmount = (e) => {
    if(!e.target.value || /^(\d|0\.\d*|[1-9]\d*\.?\d*)$/.test(e.target.value))
      setAmount(e.target.value)
  }

  useEffect(() => {
    const timer = setInterval(() => setDefaultTimeUnlock(new Date(Date.now() + 30 * 86400000)))
    return () => clearInterval(timer)
  }, [])

  const timeDiff = useMemo(() => {
    let mins = Math.floor(((timeUnlock ?? defaultTimeUnlock).getTime() - Date.now()) / 60000) + 1
    if(mins < 60)
      return `in ${mins} minute${mins===1 ? '' : 's'}`
    let hours = Math.floor(mins / 60)
    mins = mins % 60
    if(hours < 24)
      return `in ${hours} hour${hours===1 ? '' : 's'} ${mins > 0 ? `${mins} minute${mins===1 ? '' : 's'}` : ''}`
    let days = Math.floor(hours / 24)
    hours = hours % 24
    return `in ${days} day${days===1 ? '' : 's'} ${hours > 0 ? `${hours} hour${hours===1 ? '' : 's'}` : ''}`
  }, [timeUnlock, defaultTimeUnlock])

  const addTransaction = useTransactionAdder()

  const [approval, approveCallback] = useApproveCallback(
    pairFound ? new TokenAmount(pairFound, ethers.utils.parseUnits(amount ?? '0', pairFound?.decimals ?? 18).toString()) : undefined, LOCKER_ADDRESS
  )

  const handleLock = useCallback(() => {
    if (!chainId || !library || !account) return
    const locker = getLockerContract(chainId, library, account)
    setAttemptingLock(true)
    const args = [
      pairFound?.address, 
      ethers.utils.parseUnits(amount ?? '0', pairFound?.decimals ?? 18),
      Math.floor((timeUnlock ?? defaultTimeUnlock).getTime() / 1000),
      ethers.constants.AddressZero,
      true,
      account,
      1
    ]
    const value = ethers.utils.parseEther('1')
    locker.estimateGas.lockLPToken(...args, { value }).then(gasLimit => {
      locker.lockLPToken(...args, { value, gasLimit: calculateGasMargin(gasLimit) }).then((response) => {
        addTransaction(response, {
          summary: 'Lock pair'
        })

        response.wait().then(() => {
          setTxHash(response.hash)
          setLockerStep("lock_success");
          setAttemptingLock(false)
        })
      }).catch(() => {
        setAttemptingLock(false)
      })
    }).catch(() => {
      setAttemptingLock(false)
    })
  }, [chainId, account, pairFound, addTransaction, amount, defaultTimeUnlock, library, timeUnlock])

  const handleApprove = useCallback(() => {
    setAttemptingApprove(true)
    approveCallback().finally(() => setAttemptingApprove(false))
  }, [approveCallback])

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if (txHash) {
    //   onFieldAInput('')
    // }
    setTxHash('')
  }, [])

  const modalHeader = () => {
    return <div>Header</div>
  }

  const modalBottom = () => {
    return <div>Footer</div>
  }

  return (
    lockerStep === "pair_selected" ?
      <Wrapper>
        <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingLock}
            hash={txHash}
            content={() => (
              <ConfirmationModalContent
                title={'You are locking Uniswap v2 pair'}
                onDismiss={handleDismissConfirmation}
                topContent={modalHeader}
                bottomContent={modalBottom}
              />
            )}
            pendingText={'Locking Uniswap v2 pair'}
          />
        <BackButton onClick={handleBackClick}>
          <ArrowLeft /><TYPE.text_xs color={"white"}>Back</TYPE.text_xs>
        </BackButton>
        <ColumnCenter>
          <TYPE.text_lg color={'primary5'} margin={2}>Lock Liquidity</TYPE.text_lg>
          <Row justify='center' margin={16}>
            <CurrencyLogo size="28px" currency={currency0}/>
            <TYPE.text_md fontWeight={400} color={"white"} padding={2}>{pairFound?.token0?.symbol} / {pairFound?.token1?.symbol}</TYPE.text_md>
            <CurrencyLogo size="28px" currency={currency1}/>
          </Row>

          <TYPE.text_sm fontWeight={500} color={"white"} margin={3}>Lock how many LP tokens?</TYPE.text_sm>

          <LockInnerCard>
            <AutoRow>
              <Row justify='end'>
                <TYPE.text_xxs color={"white"}>Balance : {pairFound?.balance.toExact() ?? 0}</TYPE.text_xxs>
              </Row>
              <Row justify='space-between' marginY={10} >
                <Amount value={amount} onChange={handleAmount} placeholder="0.0"/>
                <div>
                  <Row>
                    <TYPE.text_xs fontWeight={500} color={"white"} padding={2}>UNIV2</TYPE.text_xs>
                    <ButtonMax onClick={() => handlePercent(100)}>
                      <TYPE.text_xxs fontWeight={500} color={"white"} textAlign={'center'}>MAX</TYPE.text_xxs>
                    </ButtonMax>
                  </Row>
                </div>
              </Row>
              <Row justify='start'>
                <LockPercentButton>
                  <TYPE.text_xxs color={"white"} onClick={() => handlePercent(25)}>25%</TYPE.text_xxs>
                </LockPercentButton>
                <LockPercentButton>
                  <TYPE.text_xxs color={"white"} onClick={() => handlePercent(50)}>50%</TYPE.text_xxs>
                </LockPercentButton>
                <LockPercentButton>
                  <TYPE.text_xxs color={"white"} onClick={() => handlePercent(75)}>75%</TYPE.text_xxs>
                </LockPercentButton>
                <LockPercentButton>
                  <TYPE.text_xxs color={"white"} onClick={() => handlePercent(100)}>100%</TYPE.text_xxs>
                </LockPercentButton>
              </Row>
            </AutoRow>
          </LockInnerCard>
          <TYPE.text_sm fontWeight={500} color={"white"} marginTop={40} marginBottom={3}>Unlock Date</TYPE.text_sm>
          <LockInnerCard>
            <AutoRow>
              <DateTimePicker value={(timeUnlock ?? defaultTimeUnlock).toLocaleString('sv').slice(0, -3)} onChange={(e) => setTimeUnlock(new Date(e.target.value))}/>
              <TYPE.text_xs fontWeight={400} color={"white"} width={"100%"}>{timeDiff}</TYPE.text_xs>
            </AutoRow>
          </LockInnerCard>

          <TYPE.text_sm fontWeight={500} color={"white"} marginY={20}>Fee options</TYPE.text_sm>
          <ButtonFeeOptions>
            <Column>
              <TYPE.text_sm fontWeight={500} color={"white"} textAlign={'center'} marginBottom={"4px"}>0.1 {ETHER.symbol}</TYPE.text_sm>
              <TYPE.text_xxs fontWeight={400} color={"white"} textAlign={'center'} marginTop={"4px"}>(+ 1% UNIV2)</TYPE.text_xxs>
            </Column>
          </ButtonFeeOptions>
          <TYPE.text_xxs color={'primary5'} textAlign={'center'}>Your balance: {balanceETH?.[account]?.toExact() ?? 0} {ETHER.symbol}</TYPE.text_xxs>

          <TYPE.text_xs color={"white"} textAlign={"center"} marginY={"20px"}>
            Once tokens are locked they cannot be withdrawn under any circumstances until the timer has expired. Please ensure the parameters are correct, as they are final.
          </TYPE.text_xs>

          <AutoRow gap="0.5em" justify="space-between" wrap="nowrap">
            {approval !== ApprovalState.APPROVED && (
              <LockEndButton
                onClick={handleApprove}
                disabled={approval === ApprovalState.PENDING || attemptingApprove}
              >
                <TYPE.text_xs fontWeight={500} color={"white"} textAlign={'center'} marginBottom={"4px"}>
                  {approval === ApprovalState.PENDING || attemptingApprove ? (
                    <Dots>Approving</Dots>
                  ) : (
                    'Approve'
                  )}
                </TYPE.text_xs>
              </LockEndButton>
            )}
            <LockEndButton
              onClick={handleLock}
              disabled={attemptingLock || !Number(amount) || approval !== ApprovalState.APPROVED}
            >
              <TYPE.text_xs fontWeight={500} color={"white"} textAlign={'center'} marginBottom={"4px"}>
                { attemptingLock ? <Dots>Locking</Dots> : 'Lock' }
              </TYPE.text_xs>
            </LockEndButton>
          </AutoRow>

        </ColumnCenter>
      </Wrapper> :
      <LockSuccess />
  );
};
export default PairLock;

