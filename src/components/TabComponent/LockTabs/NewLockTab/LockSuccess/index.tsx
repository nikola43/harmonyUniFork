import React from "react";
import styled from 'styled-components'
import { TYPE } from "theme";
import { ResponsiveButtonEmpty, ResponsiveButtonSecondary } from "components/Button";
import { ArrowLeft } from "react-feather";
import { MdLock } from 'react-icons/md'
import { ColumnCenter } from "components/Column";
import { setLockerStep, useLockerState } from "state/locker/locker.store";
import LockResult from "../LockResult";

const BackButton = styled(ResponsiveButtonEmpty)`
  color: white;
`

const ButtonPairContinue = styled(ResponsiveButtonSecondary)`
  width: 100%;
`

function LockSuccess() {
    const [lockerStep] = useLockerState("lockerStep");

    const handleBackClick = () => {
        setLockerStep("pair_selected")
    }

    const handleViewLockPage = () => {
        setLockerStep("lock_result")
    }
    return (
        lockerStep === "lock_success" ?
            <>
                <BackButton onClick={handleBackClick}>
                    <ArrowLeft /><TYPE.text_xs color={"white"}>Back</TYPE.text_xs>
                </BackButton>
                <ColumnCenter style={{ marginBottom: "24px" }}>
                    <MdLock style={{ fontSize: "60px", margin: "8px" }} />
                    <TYPE.text_lg color={"white"}>Success!</TYPE.text_lg>
                    <TYPE.text_xs color={"white"}>LP tokens locked</TYPE.text_xs>
                </ColumnCenter>
                <TYPE.text_xs color={"white"}>
                    This will be visible within our browser list within 15 mins. Thank you for using out locker. Best of luck with your project!
                </TYPE.text_xs>
                <TYPE.text_xs color={"white"} marginY={"12px"}>
                    Please stay tuned for new services we will offer ERC20 projects.
                </TYPE.text_xs>
                <ButtonPairContinue
                    onClick={handleViewLockPage}
                >
                    <TYPE.text_xs fontWeight={500} color={"white"} textAlign={'center'}>
                        View lock page
                    </TYPE.text_xs>
                </ButtonPairContinue>
            </> :
            <LockResult />
    );
};
export default LockSuccess;

