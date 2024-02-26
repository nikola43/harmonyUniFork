import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { AutoRow } from 'components/Row'
import { Column } from 'components/Column'
import { ResponsiveButtonSecondary } from 'components/Button'
import { TYPE } from 'theme'
import { FaDiscord } from 'react-icons/fa'
import iconDextools from '../../assets/svg/socials/dextools.svg'
// import iconDiscord from '../../assets/svg/socials/discord.svg'
import iconTelegram from '../../assets/svg/socials/telegram.svg'
import iconX from '../../assets/svg/socials/x.svg'
import { BlueCardShadow } from 'components/Card'

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
    margin-bottom: 20px;
    text-decoration: none;
 
    &:hover {
        color: green;
        transition: 200ms ease-in;
    }

    @media (max-width: 768px) {
      margin-bottom: 15px;
    }
`;

const FooterSocialImage = styled.img`
  width: 48px;
  @media (max-width: 768px) {
    max-width: 36px;
  }
`;

const SocialIconWrapper = styled.div`
  font-size: 48px;
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Heading = styled.div`
  margin-bottom: 20px;
  @media (max-width: 768px) {
    margin-bottom: 15px;
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

const FooterCard = styled(BlueCardShadow) <{ width?: string; padding?: string; border?: string; borderRadius?: string }>`
  width: 90%;
  border-radius: 36px;
  padding: 20px 20px;
  @media (max-width: 768px) {
    padding: 10px 15px;
  }
`;

const FooterCardText = styled(AutoRow) <{ disabled?: boolean }>`
  gap: 10px;
  width: 70%;
  /* padding: auto; */
  padding: 12px;
  @media (max-width: 1024px) {
    padding: 8px;
    width: 100%;
  }
  @media (max-width: 768px) {
    padding: 6px;
    width: 100%;
  }
  @media (max-width: 480px) {
    padding: 4px;
    width: 100%;
  }
`;

const ButtonLearnMore = styled(ResponsiveButtonSecondary)`
  border-radius: 16px;
  padding: 24px 42px; /* Adjust padding for larger screens */
  margin: 0px;
  @media (max-width: 1024px) {
    margin-top: 20px;
  }
  @media (max-width: 768px) {
    padding: 16px 24px; /* Adjust padding for smaller screens */
    margin-top: 20px;
  }
  @media (max-width: 480px) {
    padding: 12px 20px; /* Adjust padding for smaller screens */
    margin-top: 12px;
  }
`

const Footer = () => {
  return (
    <>
      <FooterFrame style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FooterCard>
          <AutoRow justify='center'>
            <FooterCardText>
              <TYPE.text_xl color={"white"}>
                Powered by the Harmony Protocol
              </TYPE.text_xl>
              <TYPE.text_md fontWeight={600} color={"white"}>
                The leading decentralized crypto trading protocol, governed by a global community.
              </TYPE.text_md>
            </FooterCardText>
            <Column style={{ padding: "0px 30px" }}>
              <ButtonLearnMore
                id="learn-more-button"
                as={Link}
                to="/learn_more"
              >
                <TYPE.text_sm color={"white"} textAlign={'center'} >
                  Learn more
                </TYPE.text_sm>
              </ButtonLearnMore>
            </Column>
          </AutoRow>
        </FooterCard>

        <AutoRow gap='sm' justify='space-between' align='start'>

          <FooterSocialColumn>
            <AutoRow justify='space-between'>
              <FooterLink href="#">
                <FooterSocialImage src={iconDextools} />
              </FooterLink>
              <SocialIconWrapper>
                <a href='https://discord.com' target='_blank' rel="noopener noreferrer"><FaDiscord color='gray' /></a>
              </SocialIconWrapper>
              <FooterLink href='https://twitter.com/flipperharmony' target='_blank'>
                <FooterSocialImage src={iconX} />
              </FooterLink>
              <FooterLink href='https://t.me/Flipper_Echo_Harmony' target='_blank'>
                <FooterSocialImage src={iconTelegram} />
              </FooterLink>
            </AutoRow>

            <TYPE.text_md textAlign={'center'}>© {new Date().getFullYear()} Harmony Labs</TYPE.text_md>

          </FooterSocialColumn>
          <FooterMenuColumn>
            <MenuColumn>
              <Heading><TYPE.text_md fontWeight={700}>App</TYPE.text_md></Heading>
              <FooterLink href="#">
                <TYPE.text_sm color={"black"}>Swap</TYPE.text_sm>
              </FooterLink>
              <FooterLink href="#">
                <TYPE.text_sm color={"black"}>Tokens</TYPE.text_sm>
              </FooterLink>
              <FooterLink href="#">
                <TYPE.text_sm color={"black"}>NFTs</TYPE.text_sm>
              </FooterLink>
              <FooterLink href="#">
                <TYPE.text_sm color={"black"}>Pools</TYPE.text_sm>
              </FooterLink>
            </MenuColumn>
            <MenuColumn>
              <Heading><TYPE.text_md fontWeight={700}>Protocol</TYPE.text_md></Heading>
              <FooterLink href="#">
                <TYPE.text_sm color={"black"}>Community</TYPE.text_sm>
              </FooterLink>
              <FooterLink href="#">
                <TYPE.text_sm color={"black"}>Governance</TYPE.text_sm>
              </FooterLink>
              <FooterLink href="#">
                <TYPE.text_sm color={"black"}>Developers</TYPE.text_sm>
              </FooterLink>
            </MenuColumn>
            <MenuColumn>
              <Heading><TYPE.text_md fontWeight={700}>Company</TYPE.text_md></Heading>
              <FooterLink href="#">
                <TYPE.text_sm color={"black"}>Careers</TYPE.text_sm>
              </FooterLink>
              <FooterLink href="#">
                <TYPE.text_sm color={"black"}>Blog</TYPE.text_sm>
              </FooterLink>
            </MenuColumn>
            <MenuColumn>
              <Heading><TYPE.text_md fontWeight={700}>Get help</TYPE.text_md></Heading>
              <FooterLink href="#">
                <TYPE.text_sm color={"black"}>Contact Us</TYPE.text_sm>
              </FooterLink>
              <FooterLink href="#">
                <TYPE.text_sm color={"black"}>Help Center</TYPE.text_sm>
              </FooterLink>
            </MenuColumn>
          </FooterMenuColumn>
        </AutoRow>
      </FooterFrame>
    </>
  )
}

export default Footer