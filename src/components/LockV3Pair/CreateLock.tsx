import { BlueCardShadow } from "components/Card"
import Row, { AutoRow } from "components/Row"
import React, { useMemo } from "react"
import { TYPE } from "theme"

import uniLogo from 'assets/images/token-logo.png'
import { ButtonOutlined } from "components/Button"
import { FaRegCircleCheck } from "react-icons/fa6";
import { navigate, useLockerPage } from "state/lockerV3/locker.store"
import { UNISWAP_V3_POSITION_MANAGERS } from "../../constants"
import Positions from "./Positions"
import Locking from "./Locking"
import Success, { SuccessMessage } from "./Success"

export default function CreateLock() {
    const page = useLockerPage()
    const positionManagers = useMemo(() => UNISWAP_V3_POSITION_MANAGERS, [])
    return <>
        {
            page?.id === "success" &&
            <SuccessMessage justify="center" padding="1em" gap="1em" mb="0.5em">
                <FaRegCircleCheck color="white" />
                <TYPE.text_xs color={"white"}>
                    Liquidity Locked
                </TYPE.text_xs>
            </SuccessMessage>
        }
        <BlueCardShadow>
            {
                !page &&
                <>
                    <AutoRow>
                        <Row>
                            <img width={'36px'} src={uniLogo} alt="logo" />
                            <TYPE.text_lg fontWeight={600} color={"white"} padding={2}>
                                Uniswap V3 Locker
                            </TYPE.text_lg>
                        </Row>
                        <Row my="1em" marginY={10}>
                            <TYPE.text_sm color={"white"}>
                                Select an AMM
                            </TYPE.text_sm>
                        </Row>
                        {
                            positionManagers.map((_pm) =>
                                <Row key={`pm-${_pm.address}`}>
                                    <ButtonOutlined onClick={() => navigate("positions", _pm)}>
                                        <TYPE.text_sm color={"white"}>
                                            {_pm.title}
                                        </TYPE.text_sm>
                                    </ButtonOutlined>
                                </Row>
                            )
                        }
                    </AutoRow>
                </>
            }
            {
                page?.id === "positions" &&
                <Positions />
            }
            {
                page?.id === "locking" &&
                <Locking />
            }
            {
                page?.id === "success" &&
                <Success />
            }
        </BlueCardShadow>
    </>
}