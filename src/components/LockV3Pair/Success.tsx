import React from "react"
import { Pool } from "./types"
import { unwrappedToken } from "utils/wrappedCurrency"
import { Token } from "constants/uniswap"
import { back, useLockerPage } from "state/lockerV3/locker.store"
import Row, { AutoRow } from "components/Row"
import { TYPE } from "theme"
import { DateTime, TimeDiff } from "components/TabComponent/LockTabs/Time"
import Column from "components/Column"
import CurrencyLogo from "components/CurrencyLogo"
import { ButtonOutlined } from "components/Button"
import styled from "styled-components"

export const SuccessMessage = styled(Row)`
    background: linear-gradient(90deg, rgba(49,191,160,1) 0%, rgba(31,227,96,1) 100%);
    border-radius: 1em;
`

export default function Success() {
    const { params: { pool, reserves, token0, token1, timeUnlock } } : { params: { pool: Pool, reserves: any, token0: Token, token1: Token, timeUnlock: Date } } = useLockerPage()

    const currency0 = unwrappedToken(token0)
    const currency1 = unwrappedToken(token1)

    return <AutoRow>
        <Row justify="center">
            <TYPE.text_xs color={"#fff8"}>
                <DateTime time={new Date()} />
            </TYPE.text_xs>
        </Row>
        <Row my="1em" justify="center">
            <TYPE.text_lg fontWeight={600} color={"#fffa"} padding={2}>
                {pool.ammTitle} LP
            </TYPE.text_lg>
        </Row>
        <Row justify="center" gap="1em" style={{ color: "#fff8" }}>
            <TYPE.text_md fontWeight={600} color={"white"}>
                {token0.symbol}
            </TYPE.text_md>
            /
            <TYPE.text_md fontWeight={600} color={"white"}>
                {token1.symbol}
            </TYPE.text_md>
            /
            <TYPE.text_md color={"white"}>
                {pool.fee / 10000} % fee
            </TYPE.text_md>
        </Row>
        <Row justify="center">
            <TYPE.text_xs color={"#fff8"}>
                Lock expires: <TimeDiff time={timeUnlock} postfix="from now" />
            </TYPE.text_xs>
        </Row>
        <Row justify="center" my="3em">
            <Column gap="0.5em" style={{ flex: 1 }}>
                <CurrencyLogo currency={currency0} size="60px"/>
                <TYPE.text_md fontWeight={600} color={"white"}>
                    {token0.symbol}
                </TYPE.text_md>
                <TYPE.text_sm color={"white"}>
                    {Number(reserves.amount0).toFixed(6)}
                </TYPE.text_sm>
            </Column>
            <Column gap="0.5em" style={{ flex: 1 }}>
                <CurrencyLogo currency={currency1} size="60px"/>
                <TYPE.text_md fontWeight={600} color={"white"}>
                    {token1.symbol}
                </TYPE.text_md>
                <TYPE.text_sm color={"white"}>
                    {Number(reserves.amount1).toFixed(6)}
                </TYPE.text_sm>
            </Column>
        </Row>
        <Row>
            <ButtonOutlined onClick={() => back("positions")}>
                <TYPE.text_sm color={"white"}>Back</TYPE.text_sm>
            </ButtonOutlined>
        </Row>
    </AutoRow>
}