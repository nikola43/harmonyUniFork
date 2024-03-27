import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ButtonPrimary } from 'components/Button'
import Row, { RowFixed } from 'components/Row'
import { TYPE } from '../../theme'
import { MdLock } from 'react-icons/md'

const ButtonRow = styled(RowFixed)`
  gap: 0px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row;
    // justify-content: space-between;
  `};
`

const LockerButton = styled(ButtonPrimary)`
  width: 300px;
  margin: 0px;
  padding: 14px;
  border-radius: 0px;
  border: 1px solid ${({ theme }) => theme.primary5};
//  width: fit-content;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 49%;
  `};
`

export default function Lock() {
  return (
    <>
      <ButtonRow>
        <LockerButton
          id="lock-liquidity-v2"
          as={Link}
          to="/lock/v2pair"
        >
          <Row >
            <MdLock style={{ fontSize: "24px", marginRight: "10px" }} />
            <TYPE.white width={"90%"} fontWeight={400} fontSize={[14, 20]} textAlign={'left'}>
              V2 Liquidity Locker
            </TYPE.white>
          </Row>
        </LockerButton>
        <LockerButton
          id="lock-liquidity-v3"
          as={Link}
          to="/lock/v3pair"
        >
          <Row style={{ width: "100%", textAlign: "left" }}>
            <MdLock style={{ fontSize: "24px", marginRight: "10px" }} />
            <TYPE.white width={"90%"} fontWeight={400} fontSize={[14, 20]} textAlign={'left'}>
              V3 Liquidity Locker
            </TYPE.white>
          </Row>
        </LockerButton>
      </ButtonRow>
    </>
  )

}