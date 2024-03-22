import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ButtonOutlined, ResponsiveButtonEmpty } from 'components/Button';
import { BlueCardShadow } from "components/Card";
import Column from "components/Column";
import Row from "components/Row";
import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from 'react-feather';
import { FaPlus } from "react-icons/fa";
import { MdAvTimer, MdPerson, MdSettings } from "react-icons/md";
import { LockedAmount, usePair } from 'state/locker/hooks';
import { backEditStep, useLockerState } from "state/locker/locker.store";
import styled from 'styled-components';
import { TYPE } from "theme";
import { unwrappedToken } from 'utils/wrappedCurrency';
import DoubleCurrencyLogo from 'components/DoubleLogo';
import { useActiveWeb3React } from 'hooks';
import { useTransactionAdder } from 'state/transactions/hooks';
import { calculateGasMargin, getLockerContract } from 'utils';
import { ethers } from 'ethers';
import { Dots } from 'components/swap/styleds';
import { DateTime, TimeDiff } from '../../Time';

const BackButton = styled(ResponsiveButtonEmpty)`
  color: white;
`

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
`

const PairLogo = styled(DoubleCurrencyLogo)`
`

const LockedCard = styled(BlueCardShadow)`
`

const UnlockedCard = styled(BlueCardShadow)`
  background-color: ${({ theme }) => theme.primary2};
  color: ${({ theme }) => theme.primary1};
`

function EditPair() {
  const [editStep] = useLockerState("editStep");
  const [pairSelected] = useLockerState("pairSelected");
  const [now, setNow] = useState<number>(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(timer)
  }, [])


  // const handlePairSelect = () => {
  //   setEditStep("pair_selected")
  // }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBackClick = () => {
    backEditStep()
  }

  const pair = usePair(pairSelected)

  const isLocked = useCallback((lock : LockedAmount) => lock.unlockDate > new Date(now), [now])
  const currency0 = unwrappedToken(pair?.token0)
  const currency1 = unwrappedToken(pair?.token1)

  const CardShadow = useCallback((props) => props.locked ? <LockedCard {...props} /> : <UnlockedCard {...props}/>, [])

  const [attemptingWithdraw, setAttemptingWithdraw] = useState<boolean>(false)
  const { chainId, library, account } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()

  const handleWithdraw = useCallback((lock: LockedAmount) => {
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
  }, [account, library, chainId, addTransaction])

  return (
    editStep === "pair_selected" &&
    <Flex>
      <Row justify="space-between">
        <BackButton onClick={handleBackClick}>
            <ArrowLeft/><TYPE.text_xs color={"white"}>Back</TYPE.text_xs>
        </BackButton>
      </Row>
      {
        pair?.locks?.map(lock => 
          <CardShadow locked={isLocked(lock)}>
            <Row justify="space-between">
              <Column>
                <Row gap="2em">
                  <PairLogo currency0={currency0} currency1={currency1} size={30}/>
                  <Column>
                    <TYPE.text_sm fontWeight={600} color={"white"} >{lock.divide(pair?.totalSupply).multiply('100').toFixed(2)}% {isLocked(lock) ? 'LOCKED' : 'UNLOCKED'}</TYPE.text_sm>
                    <TYPE.text_xxs color={"white"} marginY={"4px"}>{lock.toFixed(6)} UNI-V2</TYPE.text_xxs>
                  </Column>  
                </Row>
                <TYPE.text_xs color={"white"} marginTop={"12px"}>
                  {
                    isLocked(lock)
                    ? <TimeDiff time={lock.unlockDate} prefix="in" />
                    : <TimeDiff time={lock.unlockDate} postfix="ago" />
                  }
                  {' '}
                  (<DateTime time={lock.unlockDate}/>)
                </TYPE.text_xs>
              </Column>
              <Column style={{ alignSelf: "start" }}>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} style={{ width: "fit-content", padding: "12px 0px", borderRadius: "32px", display: "none" }}>
                  <MdSettings color="white" size={"24px"} style={{ width: "fit-content", padding: "0px" }} />
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>
                    <Row justify="space-between">
                      Relock
                      <MdAvTimer />
                    </Row>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Row justify="space-between">
                      Transfer ownership
                      <MdPerson />
                    </Row>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Row justify="space-between">
                      Increment Lock
                      <FaPlus />
                    </Row>
                  </MenuItem>
                </Menu>
              </Column>
            </Row>
            {
              !isLocked(lock) &&
              <ButtonOutlined mt={"1em"} onClick={() => handleWithdraw(lock)}>
                <TYPE.text_sm color={"white"}>
                  Withdraw
                  { attemptingWithdraw && <Dots>ing</Dots> }
                </TYPE.text_sm>
              </ButtonOutlined>
            }
          </CardShadow>
        )
      }
    </Flex>
  );
};
export default EditPair;
