// import Button from '@material-ui/core/Button';
// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
import { ButtonOutlined, ResponsiveButtonEmpty, ResponsiveButtonPrimary, ResponsiveButtonSecondary } from 'components/Button';
import { BlueCardShadow, LightCardShadow } from "components/Card";
import Column from "components/Column";
import Row, { AutoRow } from "components/Row";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft } from 'react-feather';
import { FaPlus } from "react-icons/fa";
import { MdAvTimer, MdPerson, MdSettings } from "react-icons/md";
import { LockedAmount, usePair } from 'state/lockerV2/hooks';
import { backEditStep, useLockerState } from "state/lockerV2/locker.store";
import styled, { keyframes } from 'styled-components';
import { TYPE } from "theme";
import { unwrappedToken } from 'utils/wrappedCurrency';
import DoubleCurrencyLogo from 'components/DoubleLogo';
import { useActiveWeb3React } from 'hooks';
import { useTransactionAdder } from 'state/transactions/hooks';
import OutsideClickHandler from 'react-outside-click-handler';
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

const Modal = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #00000082;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
  padding: 3em;
  margin: auto;
  backdrop-filter: blur(3px);

  & > div {
    width: 80%;
	max-width: 600px;
    gap: 1em;
    display: flex;
    flex-direction: column;
    color: white;
  }

  button {
    color: white;
    font-size: larger;
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

const StyledInput = styled.input`
  background: transparent;
  width: 100%;
  border: none;
  color: white;
  outline: none;
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

const ButtonMore = styled.div`
	position: relative;
`

const Menu = styled.div`
	position: absolute;
	position: absolute;
    background: white;
    color: black;
    padding: 1em 0;
    border-radius: 0.5em;
    right: 0;
    display: flex;
    flex-direction: column;
    font-size: larger;
    white-space: nowrap;
	z-index: 3;
`

const MenuItem = styled.div`
	padding: 0.5em 1em;
    display: flex;
    gap: 1em;
    justify-content: space-between;
	cursor: pointer;
	&:hover {
		background: ${({theme}) => theme.primary1};
		color: white;
	}
`

function EditPair() {
	const [editStep] = useLockerState("editStep");
	const [pairSelected] = useLockerState("pairSelected");
	const [now, setNow] = useState<number>(Date.now())
	const [modal, setModal] = useState<string>()
	const [menu, showMenu] = useState(false)
	const [params, setParams] = useState<any>({})
	const [currentLock, setCurrentLock] = useState<LockedAmount>()
	const [inputError, setInputError] = useState<string>()

	useEffect(() => {
		const timer = setInterval(() => setNow(Date.now()), 30000)
		return () => clearInterval(timer)
	}, [])

	useEffect(() => {
		if (!!modal) {
			setParams({})
			setAnchorEl(null)
		}
	}, [modal])

	const defaultTimeUnlock = useMemo(() => new Date(now + 30 * 86400000), [now])

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const showModal = (id, lock) => {
		// setCurrentLock(lock)
		showMenu(false)
		setModal(id)
	}

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

	const isLocked = useCallback((lock: LockedAmount) => lock.unlockDate > new Date(now), [now])
	const currency0 = unwrappedToken(pair?.token0)
	const currency1 = unwrappedToken(pair?.token1)

	const CardShadow = useCallback((props) => props.locked ? <LockedCard {...props} /> : <UnlockedCard {...props} />, [])

	const [attempting, setAttempting] = useState<string>()
	const { chainId, library, account } = useActiveWeb3React()

	const Locker = useMemo(() => getLockerContract(chainId, library, account), [chainId, library, account])

	const addTransaction = useTransactionAdder()

	const handleAction = useCallback((methodName: string, args: any[]) => {
		if (!Locker) return
		setAttempting(methodName)
		Locker.estimateGas[methodName](...args).then(gasLimit => {
			Locker[methodName](...args, { gasLimit: calculateGasMargin(gasLimit) }).then((response) => {
				addTransaction(response, {
					summary: `${methodName.toUpperCase()} v2 lock`
				})
				response.wait().then(() => {
					setAttempting(undefined)
					setModal(undefined)
				})
			}).catch(() => {
				setAttempting(undefined)
			})
		}).catch(() => {
			setAttempting(undefined)
		})
	}, [Locker, addTransaction])

	const handleAmount = (e) => {
		if (!e.target.value || /^(\d|0\.\d*|[1-9]\d*\.?\d*)$/.test(e.target.value))
			setParams({ ...params, amount: e.target.value })
	}

	const handlePercent = (percent) => {
		setParams({ ...params, amount: pair?.balance?.multiply(percent).divide('100').toFixed(pair?.decimals) })
	}

	const handleIncrease = () => {
		if(!Number(params.amount)) {
			setInputError("amount")
			return
		}
		handleAction("incrementLock", [currentLock.lockID, ethers.utils.parseEther(params.amount)])
	}

	const handleTransfer = () => {
		if(!/^0x[\da-fA-F]{40}$/.test(params.newOwner)) {
			setInputError("newOwner")
			return
		}
		handleAction("transferLockOwnership", [currentLock.lockID, params.newOwner])
	}

	const handleRelock = () => {
		if(currentLock.unlockDate >= (params.timeUnlock ?? defaultTimeUnlock)) {
			setInputError("timeUnlock")
			return
		}
		handleAction("relock", [currentLock.lockID, Math.floor((params.timeUnlock ?? defaultTimeUnlock).getTime() / 1000)])
	}

	return (
		editStep === "pair_selected" &&
		<Flex>
			<Row justify="space-between">
				<BackButton onClick={handleBackClick}>
					<ArrowLeft /><TYPE.text_xs color={"white"}>Back</TYPE.text_xs>
				</BackButton>
			</Row>
			{
				pair?.locks?.map(lock =>
					<CardShadow locked={isLocked(lock)}>
						<Row gap="2em" justify="space-between">
							<PairLogo currency0={currency0} currency1={currency1} size={30} />
							<Column align="flex-start" style={{flex: 1}}>
								<TYPE.text_sm fontWeight={600} color={"white"} >{lock.divide(pair?.totalSupply).multiply('100').toFixed(2)}% {isLocked(lock) ? 'LOCKED' : 'UNLOCKED'}</TYPE.text_sm>
								<TYPE.text_xxs color={"white"} marginY={"4px"}>{lock.toFixed(6)} UNI-V2</TYPE.text_xxs>
							</Column>
							<ButtonMore>
								<MdSettings color="white" size={"24px"} onClick={() => {
									showMenu(true)
									setCurrentLock(lock)
								}} />
								{
									menu && currentLock?.lockID===lock.lockID &&
									<OutsideClickHandler onOutsideClick={() => showMenu(false)}>
										<Menu>
											<MenuItem onClick={() => showModal("relock", lock)}>
												Relock
												<MdAvTimer />
											</MenuItem>
											<MenuItem onClick={() => showModal("transferOwnership", lock)}>
												Transfer ownership
												<MdPerson />
											</MenuItem>
											<MenuItem onClick={() => showModal("increaseLock", lock)}>
												Increment Lock
												<FaPlus />
											</MenuItem>
										</Menu>
									</OutsideClickHandler>
								}
							</ButtonMore>
						</Row>
						<TYPE.text_xs color={"white"} marginTop={"12px"}>
							{
								isLocked(lock)
									? <TimeDiff time={lock.unlockDate} prefix="in" />
									: <TimeDiff time={lock.unlockDate} postfix="ago" />
							}
							{' '}
							(<DateTime time={lock.unlockDate} />)
						</TYPE.text_xs>
						{
							!isLocked(lock) &&
							<ButtonOutlined mt={"1em"} onClick={() => handleAction("withdraw", [lock.lockID, ethers.utils.parseUnits(lock.toExact(), lock.token.decimals)])}>
								<TYPE.text_sm color={"white"}>
									Withdraw
									{attempting && <Dots>ing</Dots>}
								</TYPE.text_sm>
							</ButtonOutlined>
						}
					</CardShadow>
				)
			}
			{
				!!modal &&
				<Modal>
					<BlueCardShadow>
						{
							modal === "relock" &&
							<>
								<Column align="flex-start">
									<TYPE.text_sm color={"white"}>Current unlock date</TYPE.text_sm>
									<TYPE.text_sm fontWeight={400} color={"white"}><DateTime time={currentLock.unlockDate} /></TYPE.text_sm>
								</Column>
								<AutoRow mt={2}>
									<TYPE.text_sm color={"white"}>Unlock Date</TYPE.text_sm>
									<InputWrapper className={inputError==="timeUnlock" ? 'error' : ''}>
										<AutoRow>
											<DateTimePicker value={(params.timeUnlock ?? defaultTimeUnlock).toLocaleString('sv').slice(0, -3)} onChange={(e) => setParams({ ...params, timeUnlock: new Date(e.target.value) })} />
											<TYPE.text_xs fontWeight={400} color={"white"} width={"100%"}>
												<TimeDiff time={params.timeUnlock ?? defaultTimeUnlock} postfix={(params.timeUnlock ?? defaultTimeUnlock) > now ? "after" : "ago"}/>
											</TYPE.text_xs>
										</AutoRow>
									</InputWrapper>
								</AutoRow>
								<Row gap="1em">
									<ButtonOutlined disabled={!!attempting} onClick={handleRelock}>
										{
											attempting==="relock"
											? <Dots>Relocking</Dots>
											: "Relock"
										}
									</ButtonOutlined>
									<ButtonOutlined disabled={!!attempting} onClick={() => setModal(undefined)}>
										Cancel
									</ButtonOutlined>
								</Row>
							</>
						}
						{
							modal === "transferOwnership" &&
							<>
								<AutoRow>
									<TYPE.text_sm color={"white"}>New owner</TYPE.text_sm>
									<InputWrapper className={inputError==="newOwner" ? 'error' : ''}>
										<StyledInput value={params.newOwner ?? ''} onChange={(e) => setParams({ ...params, newOwner: e.target.value })} />
									</InputWrapper>
								</AutoRow>
								<Row gap="1em">
									<ButtonOutlined disabled={!!attempting} onClick={handleTransfer}>
										{
											attempting==="transferLockOwnership"
											? <Dots>Transferring ownership</Dots>
											: "Transfer ownership"
										}
									</ButtonOutlined>
									<ButtonOutlined disabled={!!attempting} onClick={() => setModal(undefined)}>
										Cancel
									</ButtonOutlined>
								</Row>
							</>
						}
						{
							modal === "increaseLock" &&
							<>
								<InputWrapper className={inputError==="amount" ? 'error' : ''}>
									<AutoRow>
										<Row justify='end'>
											<TYPE.text_xxs color={"white"}>Balance : {pair?.balance.toExact() ?? 0}</TYPE.text_xxs>
										</Row>
										<Row justify='space-between' marginY={10} >
											<Amount value={params.amount ?? ''} onChange={handleAmount} placeholder="0.0" />
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
								</InputWrapper>
								<Row gap="1em">
									<ButtonOutlined disabled={!!attempting} onClick={handleIncrease}>
										{
											attempting==="incrementLock"
											? <Dots>Increasing Lock</Dots>
											: "Increase Lock"
										}
									</ButtonOutlined>
									<ButtonOutlined disabled={!!attempting} onClick={() => setModal(undefined)}>
										Cancel
									</ButtonOutlined>
								</Row>
							</>
						}
					</BlueCardShadow>
				</Modal>
			}
		</Flex>
	);
};
export default EditPair;
