import React from "react";
import styled from 'styled-components'
import { TYPE } from "theme";
import { ResponsiveButtonEmpty, ResponsiveButtonSecondary } from "components/Button";
import { ArrowLeft, ArrowUpRight } from "react-feather";
import { setLockerStep, useLockerState } from "state/locker/locker.store";
import Row from "components/Row";
import { MdLabel, MdLock, MdReplay, MdWaterDrop } from "react-icons/md";
import { FaCopy } from "react-icons/fa";
import CircularProgressWithContent from "components/CircularProgressWithContent";
import uniLogo from 'assets/images/token-logo.png'
import LockResultTab from "components/TabComponent/LockResultTab";
import Column from "components/Column";
import DateAndTimePickers_Result from "components/DateAndTimePickers/DateAndTimePickers_Result";

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
            <TYPE.text_xxs color={"primary5"} textAlign={'center'} marginY={"4px"}>
                Uniswap V2 - Goerli pair: 0x47c...82E
                <FaCopy style={{ marginLeft: "8px" }} />
            </TYPE.text_xxs>
            <TYPE.text_xs color={"white"} marginTop={"16px"}>
                1 MTK = 0.00000000 WETH
            </TYPE.text_xs>
            <TYPE.text_xs color={"white"} >
                1 WETH = 1 B MTK
            </TYPE.text_xs>
            <TYPE.text_xxs color={"primary5"} textAlign={'center'} marginY={"4px"}>
                Locked Liquidity
            </TYPE.text_xxs>
            <TYPE.text_sm color={"white"} textAlign={'center'}>
                24.7%
            </TYPE.text_sm>
            <LockRateRow justify="space-between" marginY={"2px"}>
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
                    <MdLock color="green" />
                    <img width={'24px'} src={uniLogo} alt="logo" style={{ padding: "2px" }} />
                    <TYPE.text_xs color={"green"}>
                        247.5 K
                    </TYPE.text_xs>
                </Row>
                <Row justify="end">
                    <TYPE.text_xs color={"green"}>
                        0.00025
                    </TYPE.text_xs>
                    <img width={'24px'} src={uniLogo} alt="logo" style={{ padding: "2px" }} />
                    <MdLock color="green" />
                </Row>
            </Row>
            <Row justify="space-between">
                <Row>
                    <MdWaterDrop />
                    <img width={'24px'} src={uniLogo} alt="logo" style={{ padding: "2px" }} />
                    <TYPE.text_xs color={"white"}>
                        1 M (100%)
                    </TYPE.text_xs>
                </Row>
                <Row justify="end">
                    <TYPE.text_xs color={"white"}>
                        (0%) 0.001
                    </TYPE.text_xs>
                    <img width={'24px'} src={uniLogo} alt="logo" style={{ padding: "2px" }} />
                    <MdWaterDrop />
                </Row>
            </Row>
            <Row justify="space-between">
                <img width={'24px'} src={uniLogo} alt="logo" style={{ padding: "2px" }} />
                <img width={'24px'} src={uniLogo} alt="logo" style={{ padding: "2px" }} />
            </Row>

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
                    31.6228
                </TYPE.text_xxs>
            </Row>
            <Row justify="space-between">
                <TYPE.text_xxs color={"white"}>Total locked LP</TYPE.text_xxs>
                <TYPE.text_xxs color={"green"}>
                    7.8286
                </TYPE.text_xxs>
            </Row>
            <TYPE.text_xxs color={"red1"}>
                Uniswap V2 - Goerli price API is down dolalr value not determinable
            </TYPE.text_xxs>
            <LockResultTab />
            <Row justify="space-between" marginTop={"32px"}>
                <TYPE.text_xs color={"white"} fontStyle={"italic"}>Value</TYPE.text_xs>
                <TYPE.text_xs color={"white"} fontStyle={"italic"}>Unlock date</TYPE.text_xs>
            </Row>

            <Row justify="space-between" marginY={"4px"}>
                <Column style={{ alignItems: "left" }}>
                    <TYPE.text_xs color={"green"} >$0</TYPE.text_xs>
                    <TYPE.text_xxs color={"white"} >7.9266 univ2</TYPE.text_xxs>
                </Column>
                <Column style={{ alignItems: "right" }}>
                    <DateAndTimePickers_Result />
                </Column>
            </Row>
            <hr style={{ borderTop: "none", borderBottom: "1px solid #92c9eb" }} />
        </>
    );
};
export default LockResult;

