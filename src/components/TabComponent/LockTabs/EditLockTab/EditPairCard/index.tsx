import React from "react";
import Row, { AutoRow } from "components/Row";
import styled from 'styled-components'
import { TYPE } from "theme";
import uniLogo from 'assets/images/token-logo.png'
import { ResponsiveButtonSecondary } from "components/Button";
import { BlueCardShadow } from "components/Card";
import { setEditStep, useLockerState } from "state/locker/locker.store";

const LockPairCardWrapper = styled(BlueCardShadow) <{ width?: string; padding?: string; border?: string; borderRadius?: string }>`
  padding: 16px;
  @media (max-width: 1024px) {
    padding: 14px;
  }
  @media (max-width: 768px) {
    padding: 12px; /* Adjust padding for smaller screens */
  }
  @media (max-width: 480px) {
    padding: 10px; /* Adjust padding for smaller screens */
  }
`;

const ButtonPairContinue = styled(ResponsiveButtonSecondary)`
  width: 100%;
`

function EditPairCard() {
    const [isLplocked] = useLockerState("isLplocked");

    const handlePairSelect = () => {
        setEditStep("pair_selected")
    }

    return (
        <LockPairCardWrapper>
            {
                isLplocked === true ?
                    <Row marginY={10} justify='space-between'>
                        <Row>
                            <img width={'30px'} src={uniLogo} alt="logo" />
                            <img width={'30px'} src={uniLogo} alt="logo" />
                            <TYPE.text_xs fontWeight={500} color={"white"} padding={2}>
                                UNCX / WETH
                            </TYPE.text_xs>
                        </Row>
                        <TYPE.text_xs color={"white"}>
                            0x47cF...782E
                        </TYPE.text_xs>
                    </Row> :
                    <AutoRow>
                        <TYPE.text_sm fontWeight={600} color={"white"}>
                            Pair found
                        </TYPE.text_sm>
                        <Row marginY={10} justify='space-between'>
                            <Row>
                                <img width={'30px'} src={uniLogo} alt="logo" />
                                <img width={'30px'} src={uniLogo} alt="logo" />
                                <TYPE.text_xs fontWeight={500} color={"white"} padding={2}>
                                    UNCX / WETH
                                </TYPE.text_xs>
                            </Row>
                            <TYPE.text_xs color={"white"} padding={2}>
                                9999.9999
                            </TYPE.text_xs>
                        </Row>
                        <ButtonPairContinue
                            onClick={handlePairSelect}
                        >
                            <TYPE.text_xs fontWeight={500} color={"white"} textAlign={'center'}>CONTINUE</TYPE.text_xs>
                        </ButtonPairContinue>
                    </AutoRow>
            }
        </LockPairCardWrapper>
    );
};
export default EditPairCard;

