import React from 'react'
import styled from 'styled-components'
// import { ThemeContext } from 'styled-components'
import { AutoRow } from 'components/Row'
import { Column, AutoColumn } from 'components/Column'
import iconDextools from '../../assets/svg/socials/dextools.svg'
import iconDiscord from '../../assets/svg/socials/discord.svg'
import iconTelegram from '../../assets/svg/socials/telegram.svg'
import { TYPE } from 'theme'
import { Box } from 'rebass/styled-components'
import { ButtonSecondary } from 'components/Button'
import { Link } from 'react-router-dom'

const FooterFrame = styled.div`
    padding: 5% 5%;
    bottom: 0;
    width: 100%;
    @media (max-width: 1000px) {
    // padding: 70px 30px;
    }
    /* border-top: 1px solid rgba(0, 0, 0, 0.1); */
`;

const FooterLink = styled.a`
    color: black;
    margin-bottom: 20px;
    font-size: 18px;
    text-decoration: none;
 
    &:hover {
        color: green;
        transition: 200ms ease-in;
    }
`;

const Heading = styled.p`
    font-size: 24px;
    color: black;
    margin-bottom: 40px;
    font-weight: bold;
`;

const FooterSocialColumn = styled(Column) <{ disabled?: boolean }>`
  align-items: center;
  align-self: center;
`

const FooterCard = styled(Box) <{ width?: string; padding?: string; border?: string; borderRadius?: string }>`
  /* width: ${({ width }) => width ?? '100%'}; */
  border-radius: 36px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  background-color: ${({ theme }) => theme.primary1};
  /* color: ${({ theme }) => theme.white}; */
  /* width: fit-content; */
  width: 70%;
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: fit-content;
  border-radius: 16px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const Footer = () => {

  // const theme = useContext(ThemeContext)

  return (
    <>
      <FooterFrame style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FooterCard padding={"20px 0px"} marginBottom={"20px"}>
          <AutoRow gap='lg' justify='center'>
            <AutoColumn gap="10px" style={{ width: "70%", padding: "0px 30px" }}>
              <TYPE.link fontWeight={700} fontSize={40} color={'white'}>
                Powered by the Harmony Protocol
              </TYPE.link>
              <TYPE.link fontWeight={600} fontSize={24} color={'white'}>
                The leading decentralized crypto trading protocol, governed by a global community.
              </TYPE.link>
            </AutoColumn>
            <Column style={{ padding: "0px 30px" }}>
              <ResponsiveButtonSecondary
                id="learn-more-button"
                as={Link}
                padding="24px 42px"
                to="/get_started"
              >
                <TYPE.white fontWeight={400} textAlign={'center'} fontSize={20}>
                  Learn more
                </TYPE.white>
              </ResponsiveButtonSecondary>
            </Column>
          </AutoRow>
        </FooterCard>

        <AutoRow gap='sm' justify='space-between' align='start'>

          <FooterSocialColumn>
            <AutoRow justify='space-between'>
              <FooterLink href="#">
                <img src={iconDextools} alt='dextools' width={48} height={48} />
              </FooterLink>
              <FooterLink href="#">
                <img src={iconDiscord} alt='discord' width={60} height={60} />
              </FooterLink>
              <FooterLink href="#">
                <img src={iconTelegram} alt='telegram' width={48} height={48} />
              </FooterLink>
            </AutoRow>

            © {new Date().getFullYear()} Harmony Labs

          </FooterSocialColumn>
          <Column>
            <Heading>App</Heading>
            <FooterLink href="#">
              Swap
            </FooterLink>
            <FooterLink href="#">
              Tokens
            </FooterLink>
            <FooterLink href="#">
              NFTs
            </FooterLink>
            <FooterLink href="#">
              Pools
            </FooterLink>
          </Column>
          <Column>
            <Heading>Protocol</Heading>
            <FooterLink href="#">
              Community
            </FooterLink>
            <FooterLink href="#">
              Goverence
            </FooterLink>
            <FooterLink href="#">
              Developers
            </FooterLink>
          </Column>
          <Column>
            <Heading>Company</Heading>
            <FooterLink href="#">
              Careers
            </FooterLink>
            <FooterLink href="#">
              Blog
            </FooterLink>
          </Column>
          <Column>
            <Heading>Get help</Heading>
            <FooterLink href="#">
              Contact Us
            </FooterLink>
            <FooterLink href="#">
              Help Center
            </FooterLink>
          </Column>

        </AutoRow>
      </FooterFrame >
    </>
  )
}

export default Footer