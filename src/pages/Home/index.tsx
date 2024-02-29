import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ButtonEmpty, ResponsiveButtonPrimary } from 'components/Button'
import { ColumnCenter, AutoColumn } from 'components/Column'
import Row from 'components/Row'
import { TYPE } from '../../theme'
import Logo from '../../assets/svg/logo_black.svg'
import homeSwapBb from '../../assets/svg/home_swap_bg.svg'

const ButtonGetStarted = styled(ResponsiveButtonPrimary)`
  border-radius: 46px;
  padding: 20px 96px; /* Adjust padding for larger screens */
  @media (max-width: 1024px) {
    padding: 16px 72px;
  }
  @media (max-width: 768px) {
    padding: 12px 48px; /* Adjust padding for smaller screens */
  }
  @media (max-width: 480px) {
    padding: 8px 24px; /* Adjust padding for smaller screens */
  }
`

const ButtonLearnMore = styled(ButtonEmpty)`
  width: fit-content;
  border-radius: 8px;
  margin: 32px 0px;
  padding: 4px 32px; /* Adjust padding for larger screens */
  &:hover {
    background: ${({ theme }) => theme.primary3};
  }
  &:active {
    background: ${({ theme }) => theme.primary4};
  }
  @media (max-width: 1024px) {
    margin: 24px 0px;
    padding: 4px 24px;
  }
  @media (max-width: 768px) {
    margin: 16px 0px;
    padding: 2px 16px; /* Adjust padding for smaller screens */
  }
  @media (max-width: 480px) {
    margin: 8px 0px;
    padding: 1px 8px; /* Adjust padding for smaller screens */
  }
`

const ButtonDownloadApp = styled(ButtonEmpty)`
  width: fit-content;
  border-radius: 8px;
  margin-bottom: 72px;
  padding: 4px 32px; /* Adjust padding for larger screens */
  &:hover {
    background: ${({ theme }) => theme.primary3};
  }
  &:active {
    background: ${({ theme }) => theme.primary4};
  }
  @media (max-width: 1024px) {
    margin-bottom: 54px;
    padding: 4px 24px;
  }
  @media (max-width: 768px) {
    margin-bottom: 36px;
    padding: 2px 16px; /* Adjust padding for smaller screens */
  }
  @media (max-width: 480px) {
    margin-bottom: 18px;
    padding: 1px 8px; /* Adjust padding for smaller screens */
  }
`

export const SwapCard = styled(AutoColumn) <{ disabled?: boolean }>`
  border-radius: 16px;
  width: 90%; /* Adjust width for smaller screens */
  max-width: 600px; /* Optional: Limit maximum width for larger screens */
  position: relative;
  overflow: hidden;
  margin: auto; /* Center the card horizontally */
`

export const HomeSwapBG = styled.img<{ desaturate?: boolean }>`
  width: 100%;
  height: auto; 
  /* user-select: none; */
  ${({ desaturate }) => desaturate && `filter: saturate(0)`}
`

export const HomeSwapText = styled(AutoColumn) <{ disabled?: boolean }>`
    position: absolute;
    height: 100%;
    padding: 30px 30px 50px 50px;
    @media (max-width: 768px) {
        padding: 20px 20px 30px 30px; /* Adjust padding for smaller screens */
    }
`

export const HomeSwapTextSection = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
`

export default function Home() {
  return (
    <>
      <ColumnCenter>

        <TYPE.text_xxl color={"primary1"} textAlign={'center'}>
          Welcome to the Echoverse, home of $ECHO the dolphin.
        </TYPE.text_xxl>
        <TYPE.text_md textAlign={'center'} margin={40}>
          This is your one stop shop for all interactions within the Harmony blockchain. Trade, Explore and earn yield using our curated interface.
        </TYPE.text_md>

        <ButtonGetStarted
          id="get-started-button"
          as={Link}
          to="/get_started"
        >
          <TYPE.text_md color={"white"} textAlign={'center'}>
            Get Started
          </TYPE.text_md>
        </ButtonGetStarted>

        <ButtonLearnMore>
          <TYPE.text_md color={'text3'} textAlign={'center'}>
            Learn more
          </TYPE.text_md>
        </ButtonLearnMore>

        <ButtonDownloadApp>
          <Row justify='center' >
            <img width={'24px'} src={Logo} alt="logo" />
            <TYPE.text_sm paddingLeft={2}>
              Download the Harmony app
            </TYPE.text_sm>
          </Row>
        </ButtonDownloadApp>

        <SwapCard>
          <HomeSwapBG src={homeSwapBb} />
          <HomeSwapText>
            <AutoColumn justify='stretch'>
              <AutoColumn gap="8">
                <TYPE.text_lg >
                  Swap tokens
                </TYPE.text_lg>
                <TYPE.text_md >
                  Buy, Sell and explore the Harmony blockchain by using $ECHO.
                </TYPE.text_md>
              </AutoColumn>

              <AutoColumn gap="8">
                <TYPE.text_lg >
                  Provide Liquidity
                </TYPE.text_lg>
                <TYPE.text_md>
                  You can start any Liquidity Pool as well as safely lock the LP by using our Dapp.
                </TYPE.text_md>
              </AutoColumn>
            </AutoColumn>
          </HomeSwapText>
        </SwapCard>

      </ColumnCenter >
    </>
  )

}