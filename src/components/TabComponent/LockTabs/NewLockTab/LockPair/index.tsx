import React from "react";
import styled from 'styled-components'
import { ArrowLeft } from 'react-feather'
import Row, { AutoRow } from "components/Row";
import Column, { ColumnCenter } from "components/Column";
import { LightCardShadow } from "components/Card";
import { ResponsiveButtonEmpty, ResponsiveButtonPrimary, ResponsiveButtonSecondary } from "components/Button";
import DateAndTimePickers from "components/DateAndTimePickers";
import { TYPE } from "theme";
import uniLogo from 'assets/images/token-logo.png'
import LockSuccess from "../LockSuccess";
import { useLockerState, setLockerStep, setIsLpLocked } from 'state/locker/locker.store'

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
  width: 50%;
  margin: 4px;
  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
  }
  @media (max-width: 480px) {
  }
`

function PairLock() {
  const [lockerStep] = useLockerState("lockerStep");

  const handlePairLock = () => {
    setLockerStep("lock_success");
    setIsLpLocked(true);
  }

  const handleBackClick = () => {
    setLockerStep("initial")
  }

  return (
    lockerStep === "pair_selected" ?
      <div>
        <BackButton onClick={handleBackClick}>
          <ArrowLeft /><TYPE.text_xs color={"white"}>Back</TYPE.text_xs>
        </BackButton>
        <ColumnCenter>
          <TYPE.text_lg color={'primary5'} margin={2}>Lock Liquidity</TYPE.text_lg>
          <Row justify='center' margin={16}>
            <img width={'28px'} src={uniLogo} alt="logo" />
            <TYPE.text_md fontWeight={400} color={"white"} padding={2}>UNCX / WETH</TYPE.text_md>
            <img width={'28px'} src={uniLogo} alt="logo" />
          </Row>

          <TYPE.text_sm fontWeight={500} color={"white"} margin={3}>Lock how many LP tokens?</TYPE.text_sm>

          <LockInnerCard>
            <AutoRow>
              <Row justify='end'>
                <TYPE.text_xxs color={"white"}>Balance : 9999.9999</TYPE.text_xxs>
              </Row>
              <Row justify='space-between' marginY={10} >
                <TYPE.text_xs color={"white"} padding={2}>9999.9999</TYPE.text_xs>
                <div>
                  <Row>
                    <TYPE.text_xs fontWeight={500} color={"white"} padding={2}>UNIV2</TYPE.text_xs>
                    <ButtonMax
                      id="learn-more-button"
                    >
                      <TYPE.text_xxs fontWeight={500} color={"white"} textAlign={'center'}>MAX</TYPE.text_xxs>
                    </ButtonMax>
                  </Row>
                </div>
              </Row>
              <Row justify='start'>
                <LockPercentButton>
                  <TYPE.text_xxs color={"white"}>25%</TYPE.text_xxs>
                </LockPercentButton>
                <LockPercentButton>
                  <TYPE.text_xxs color={"white"}>50%</TYPE.text_xxs>
                </LockPercentButton>
                <LockPercentButton>
                  <TYPE.text_xxs color={"white"}>75%</TYPE.text_xxs>
                </LockPercentButton>
                <LockPercentButton>
                  <TYPE.text_xxs color={"white"}>100%</TYPE.text_xxs>
                </LockPercentButton>
              </Row>
            </AutoRow>
          </LockInnerCard>
          <TYPE.text_sm fontWeight={500} color={"white"} marginTop={40} marginBottom={3}>Unlock Date</TYPE.text_sm>
          <LockInnerCard>
            <AutoRow>
              <DateAndTimePickers />

              <TYPE.text_xs fontWeight={400} color={"white"} width={"100%"}>13 days ago</TYPE.text_xs>
            </AutoRow>
          </LockInnerCard>

          <TYPE.text_sm fontWeight={500} color={"white"} marginY={20}>Fee options</TYPE.text_sm>
          <ButtonFeeOptions>
            <Column>
              <TYPE.text_sm fontWeight={500} color={"white"} textAlign={'center'} marginBottom={"4px"}>0.1 ETH</TYPE.text_sm>
              <TYPE.text_xxs fontWeight={400} color={"white"} textAlign={'center'} marginTop={"4px"}>(+ 1% UNIV2)</TYPE.text_xxs>
            </Column>
          </ButtonFeeOptions>
          <TYPE.text_xxs color={'primary5'} textAlign={'center'}>Your balance: 0.02 ETH</TYPE.text_xxs>

          <TYPE.text_xs color={"white"} textAlign={"center"} marginY={"20px"}>
            Once tokens are locked they cannot be withdrawn under any circumstances until the timer has expired. Please ensure the parameters are correct, as they are final.
          </TYPE.text_xs>

          <Row>
            <LockEndButton>
              <TYPE.text_xs fontWeight={500} color={"white"} textAlign={'center'} marginBottom={"4px"}>Approve</TYPE.text_xs>
            </LockEndButton>
            <LockEndButton
              onClick={handlePairLock}
            >
              <TYPE.text_xs fontWeight={500} color={"white"} textAlign={'center'} marginBottom={"4px"}>Lock</TYPE.text_xs>
            </LockEndButton>
          </Row>

        </ColumnCenter>
      </div> :
      <LockSuccess />
  );
};
export default PairLock;

