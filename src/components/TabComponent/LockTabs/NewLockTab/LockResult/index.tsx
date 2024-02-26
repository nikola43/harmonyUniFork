import React from "react";
import styled from 'styled-components'
import { TYPE } from "theme";
import { ResponsiveButtonEmpty, ResponsiveButtonSecondary } from "components/Button";
import { ArrowLeft } from "react-feather";
import { setLockerStep, useLockerState } from "state/locker/locker.store";
import Row from "components/Row";
import { MdLabel, MdLock } from "react-icons/md";
import { FaCopy } from "react-icons/fa";
import CircularProgressWithContent from "components/CircularProgressWithContent";
import uniLogo from 'assets/images/token-logo.png'

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
        width: calc(37% + 8px); /* Adjust this value according to your design */
        height: 2px;
        background-color: white;
        z-index: 0;
    }

    &::before {
        left: calc(3% + 25px); /* Adjust this value according to your design */
    }

    &::after {
        left: calc(50% + 20px); /* Adjust this value according to your design */
    }
`

const ButtonLockLiquidity = styled(ResponsiveButtonSecondary)`
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

function LockResult() {
    const [lockerStep] = useLockerState("lockerStep");

    const handleBackClick = () => {
        setLockerStep("lock_success")
    }

    const handleViewLockPage = () => {
        setLockerStep("initial")
    }
    return (
        lockerStep === "lock_result" &&
        <>
            <Row justify="space-between">
                <BackButton onClick={handleBackClick}>
                    <ArrowLeft /><TYPE.text_xs color={"white"}>Back</TYPE.text_xs>
                </BackButton>
                <ButtonLockLiquidity
                    onClick={handleViewLockPage}
                >
                    <MdLock style={{ fontSize: "18px", color: "white", margin: "4px" }} />
                    <TYPE.text_xxs color={"white"} textAlign={'center'}>
                        Lock Liquidity
                    </TYPE.text_xxs>
                </ButtonLockLiquidity>
            </Row>
            <TYPE.text_xxs color={"text4"} textAlign={'center'}>
                Uniswap V2 - Goerli pair: 0x47c...82E
                <FaCopy style={{ marginLeft: "8px" }} />
            </TYPE.text_xxs>
            <TYPE.text_xs color={"white"} >
                1 MTK = 0.00000000 WETH
            </TYPE.text_xs>
            <TYPE.text_xs color={"white"} >
                1 WETH = 1 B MTK
            </TYPE.text_xs>
            <TYPE.text_xxs color={"text4"} textAlign={'center'}>
                Locked Liquidity
            </TYPE.text_xxs>
            <TYPE.text_sm color={"white"} textAlign={'center'}>
                24.7%
            </TYPE.text_sm>
            <LockRateRow justify="space-between">
                <CircularProgressWithContent content={<img width={'50px'} src={uniLogo} alt="logo" style={{ padding: "4px" }} />} value={24.7} />
                <CircularProgressWithContent content={<MdLock size={"50px"} style={{ padding: "8px" }} />} value={24.7} />
                <CircularProgressWithContent content={<img width={'50px'} src={uniLogo} alt="logo" style={{ padding: "4px", zIndex: 100 }} />} value={24.7} />
            </LockRateRow>
            <Row justify="space-between">
                <TYPE.text_sm color={"white"}>
                    MTK
                </TYPE.text_sm>
                <TYPE.text_sm color={"white"}>
                    WETH
                </TYPE.text_sm>
            </Row>
            <Row justify="space-between">
                <Row>
                    <MdLock />
                    <img width={'24px'} src={uniLogo} alt="logo" style={{ padding: "4px", zIndex: 100 }} />
                    <TYPE.text_sm color={"white"}>
                        247.5 K
                    </TYPE.text_sm>
                </Row>
                <Row>
                    <TYPE.text_sm color={"white"}>
                        0.00025
                    </TYPE.text_sm>
                    <img width={'24px'} src={uniLogo} alt="logo" style={{ padding: "4px", zIndex: 100 }} />
                    <MdLock />
                </Row>
            </Row>
            <Row justify="space-between">
                <TYPE.text_sm color={"white"}>
                    MTK
                </TYPE.text_sm>
                <TYPE.text_sm color={"white"}>
                    WETH
                </TYPE.text_sm>
            </Row>
        </>
    );
};
export default LockResult;

