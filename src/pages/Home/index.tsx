import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { ButtonPrimary } from 'components/Button'
import { ColumnCenter, AutoColumn } from 'components/Column'
import Row from 'components/Row'
import { TYPE } from '../../theme'
import Logo from '../../assets/svg/logo_black.svg'
import homeSwapBb from '../../assets/svg/home_swap_bg.svg'

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  border-radius: 46px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

export const SwapCard = styled(AutoColumn) <{ disabled?: boolean }>`
  border-radius: 16px;
  width: 40%;
  position: relative;
  overflow: hidden;
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
    padding: 60px;
`

export const HomeSwapTextBottom = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

export default function Home() {
    const theme = useContext(ThemeContext)
    return (
        <>
            <ColumnCenter>

                <TYPE.link fontWeight={700} fontSize={48} textAlign={'center'}>
                    Trade crypto and NFTs with confidence
                </TYPE.link>
                <TYPE.black fontWeight={400} fontSize={24} textAlign={'center'} margin={40}>
                    Buy, sell, and explore tokens and NFTs
                </TYPE.black>

                <ResponsiveButtonPrimary
                    id="get-started-button"
                    as={Link}
                    padding="20px 96px"
                    to="/get_started"
                >
                    <TYPE.white fontWeight={400} textAlign={'center'} fontSize={24}>
                        Get Started
                    </TYPE.white>
                </ResponsiveButtonPrimary>

                <TYPE.main fontWeight={400} fontSize={24} color={'text3'} textAlign={'center'} margin={40}>
                    Learn more
                </TYPE.main>

                <Row justify='center' style={{ marginBottom: "40px" }}>
                    <img width={'24px'} src={Logo} alt="logo" />
                    <TYPE.black fontWeight={400} fontSize={20} padding={2}>
                        Download the Harmony app
                    </TYPE.black>
                </Row>

                <SwapCard>
                    <HomeSwapBG src={homeSwapBb} />
                    <HomeSwapText>

                        <TYPE.black fontWeight={400} fontSize={36}>
                            Swap tokens
                        </TYPE.black>

                        <HomeSwapTextBottom>
                            <AutoColumn gap="lg">
                                <TYPE.black fontWeight={400} fontSize={24}>
                                    Buy, sell, and explore tokens on Ethereum, Polygon, Optimism, and more.
                                </TYPE.black>

                                <TYPE.link fontWeight={400} fontSize={24} color={'primaryText1'}>
                                    Trade tokens
                                </TYPE.link>
                            </AutoColumn>
                        </HomeSwapTextBottom>

                    </HomeSwapText>
                </SwapCard>

            </ColumnCenter>
        </>
    )

}