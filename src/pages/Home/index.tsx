import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ButtonPrimary } from 'components/Button'
import { ColumnCenter, AutoColumn } from 'components/Column'
import Row from 'components/Row'
import { TYPE } from '../../theme'
import Logo from '../../assets/svg/logo_black.svg'
import homeSwapBb from '../../assets/svg/home_swap_bg.svg'

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  border-radius: 46px;
  padding: 20px 96px; /* Adjust padding for larger screens */
  @media (max-width: 768px) {
    padding: 20px 48px; /* Adjust padding for smaller screens */
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

                <TYPE.link fontWeight={700} fontSize={[36, 48]} textAlign={'center'}>
                    Welcome to the Echoverse, home of $ECHO the dolphin.
                </TYPE.link>
                <TYPE.black fontWeight={400} fontSize={[16, 24]} textAlign={'center'} margin={40}>
                    This is your one stop shop for all interactions within the Harmony blockchain. Trade, Explore and earn yield using our curated interface.
                </TYPE.black>

                <ResponsiveButtonPrimary
                    id="get-started-button"
                    as={Link}
                    to="/get_started"
                >
                    <TYPE.white fontWeight={400} textAlign={'center'} fontSize={[16, 24]}>
                        Get Started
                    </TYPE.white>
                </ResponsiveButtonPrimary>

                <TYPE.main fontWeight={400} fontSize={[16, 24]} color={'text3'} textAlign={'center'} margin={40}>
                    Learn more
                </TYPE.main>

                <Row justify='center' style={{ marginBottom: "40px" }}>
                    <img width={'24px'} src={Logo} alt="logo" />
                    <TYPE.black fontWeight={400} fontSize={[14, 20]} padding={2}>
                        Download the Harmony app
                    </TYPE.black>
                </Row>

                <SwapCard>
                    <HomeSwapBG src={homeSwapBb} />
                    <HomeSwapText>
                        <AutoColumn justify='stretch'>
                            <AutoColumn gap="8">
                                <TYPE.black fontWeight={600} fontSize={[16, 28, 36]}>
                                    Swap tokens
                                </TYPE.black>

                                <TYPE.black fontWeight={400} fontSize={[12, 20, 24]}>
                                    Buy, Sell and explore the Harmony blockchain by using $ECHO.
                                </TYPE.black>
                            </AutoColumn>

                            <AutoColumn gap="8">
                                <TYPE.black fontWeight={600} fontSize={[16, 28, 36]}>
                                    Provide Liquidity
                                </TYPE.black>
                                <TYPE.black fontWeight={400} fontSize={[12, 20, 24]}>
                                    You can start any Liquidity Pool as well as safely lock the LP by using our Dapp.
                                </TYPE.black>
                            </AutoColumn>
                        </AutoColumn>
                    </HomeSwapText>
                </SwapCard>

            </ColumnCenter>
        </>
    )

}