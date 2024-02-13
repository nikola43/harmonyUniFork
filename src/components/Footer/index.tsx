import React from 'react'
import styled from 'styled-components'
import { AutoRow } from 'components/Row'
import { Column, AutoColumn } from 'components/Column'
import iconDextools from '../../assets/svg/socials/dextools.svg'
// import iconDiscord from '../../assets/svg/socials/discord.svg'
import iconTelegram from '../../assets/svg/socials/telegram.svg'
import iconX from '../../assets/svg/socials/x.svg'
import { TYPE } from 'theme'
import { Box } from 'rebass/styled-components'
import { ButtonSecondary } from 'components/Button'
import { Link } from 'react-router-dom'
// import { FaDiscord } from 'react-icons/fa'

const FooterFrame = styled.div`
    padding: 5% 5%;
    bottom: 0;
    width: 100%;
    @media (max-width: 768px) {
      padding: 2% 2% 20% 2%;
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

    @media (max-width: 768px) {
      font-size: 12px;
    }
`;

const FooterSocialImage = styled.img`
  width: 48px;
  @media (max-width: 768px) {
    max-width: 36px;
  }
`;

// const SocialIconWrapper = styled.div`
//   font-size: 48px;
//   @media (max-width: 768px) {
//     font-size: 36px;
//   }
// `;

const Heading = styled.p`
  font-size: 24px;
  color: black;
  margin-bottom: 20px;
  font-weight: bold;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const FooterSocialColumn = styled(Column) <{ disabled?: boolean }>`
  width: 20%;
  align-items: center;
  align-self: center;
  padding: 30px;
`;

const FooterMenuColumn = styled(AutoRow) <{ disabled?: boolean }>`
  width: 80%;
  justify-content: space-between;
  gap: "2em";
  align-items: start;
  padding: 30px;
`;

const MenuColumn = styled(Column) <{ disabled?: boolean }>`
  margin: 0px 20px;
`;

const FooterCard = styled(Box) <{ width?: string; padding?: string; border?: string; borderRadius?: string }>`
  border-radius: 36px;
  background-color: ${({ theme }) => theme.primary1};
  /* width: fit-content; */
  width: 90%;
  margin: 0 auto;
  padding: 20px 0px;
  @media (max-width: 768px) {
    padding: 10px 0px;
  }
`;

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: fit-content;
  border-radius: 16px;
  padding: 24px 42px; /* Adjust padding for larger screens */
  @media (max-width: 768px) {
    padding: 24px 24px; /* Adjust padding for smaller screens */
    margin-top: 20px;
  }
`

const Footer = () => {
  return (
    <>
      <FooterFrame style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FooterCard>
          <AutoRow justify='center'>
            <AutoColumn gap="10px" style={{ width: "70%", padding: "auto" }}>
              <TYPE.link fontWeight={700} fontSize={[28, 40]} color={'white'}>
                Powered by the Harmony Protocol
              </TYPE.link>
              <TYPE.link fontWeight={600} fontSize={[16, 24]} color={'white'}>
                The leading decentralized crypto trading protocol, governed by a global community.
              </TYPE.link>
            </AutoColumn>
            <Column style={{ padding: "0px 30px" }}>
              <ResponsiveButtonSecondary
                id="learn-more-button"
                as={Link}
                to="/get_started"
              >
                <TYPE.white fontWeight={400} textAlign={'center'} fontSize={[14, 20]}>
                  Learn more
                </TYPE.white>
              </ResponsiveButtonSecondary>
            </Column>
          </AutoRow>
        </FooterCard>

        <AutoRow gap='sm' justify='space-between' align='start'>

          <FooterSocialColumn>
            <AutoRow justify='space-between'>
              <FooterLink href="https://www.dextools.io" target='_blank'>
                <img src={iconDextools} alt='dextools' width={48} height={48} />
              </FooterLink>
              <FooterLink href='https://twitter.com/flipperharmony' target='_blank'>
                <FooterSocialImage src={iconX} />
              </FooterLink>
              <FooterLink href='https://t.me/Flipper_Echo_Harmony' target='_blank'>
                <FooterSocialImage src={iconTelegram} />
              </FooterLink>
            </AutoRow>

            <TYPE.black fontWeight={400} textAlign={'center'} fontSize={[16, 24]}>© {new Date().getFullYear()} Harmony Labs</TYPE.black>

          </FooterSocialColumn>
          <FooterMenuColumn>
            <MenuColumn>
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
            </MenuColumn>
            <MenuColumn>
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
            </MenuColumn>
            <MenuColumn>
              <Heading>Company</Heading>
              <FooterLink href="#">
                Careers
              </FooterLink>
              <FooterLink href="#">
                Blog
              </FooterLink>
            </MenuColumn>
            <MenuColumn>
              <Heading>Get help</Heading>
              <FooterLink href="#">
                Contact Us
              </FooterLink>
              <FooterLink href="#">
                Help Center
              </FooterLink>
            </MenuColumn>
          </FooterMenuColumn>
        </AutoRow >
      </FooterFrame >
    </>
  )
}

export default Footer