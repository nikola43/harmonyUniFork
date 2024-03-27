import React from "react"
import Row, { AutoRow } from "components/Row"
import { TYPE } from "theme"

import { back, useLockerPage } from "state/lockerV3/locker.store"
import { ArrowLeft } from "react-feather"
import { ResponsiveButtonEmpty } from "components/Button"
import { useActiveWeb3React } from "hooks"
import { getContract, shortenAddress } from "utils"
import { useSingleCallResult, useSingleContractMultipleData } from "state/multicall/hooks"
import styled from "styled-components"
import Column from "components/Column"

import positionManagerABI from "../../constants/abis/PositionManager.json"
import uniswapV3FactoryABI from "../../constants/abis/UniswapV3Factory.json"
import { Pool } from "./types"
import PositionItem from "./Position"
import Loading from "./Loading"

const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 1em;
    & > * {
        flex: 0 0 calc(50% - 0.5em);
    }
`

export default function Positions() {
    const { params: positionManager } : { params: { title: string, address: string } } = useLockerPage()
    
    const { account, library } = useActiveWeb3React()

    const PositionManager = getContract(positionManager.address, positionManagerABI, library)
    const UniswapV3Factory = useSingleCallResult(PositionManager, "factory")?.result?.[0]
    const count = useSingleCallResult(PositionManager, "balanceOf", [account])?.result?.[0]?.toNumber()

    const tokenIds = useSingleContractMultipleData(
        PositionManager, 
        "tokenOfOwnerByIndex", 
        count ? Array.from(new Array(count), (_, index) => [account, index]) : undefined
    ).filter(state => state.valid && !state.loading && state.result).map(state => state.result[0])

    const positions: any[] = useSingleContractMultipleData(
        PositionManager, 
        "positions", 
        tokenIds?.length ? tokenIds.map(id => [id]) : undefined
    ).filter(state => state.valid && !state.loading && state.result).map(({result}, index) => ({
        id: tokenIds[index].toNumber(),
        token0: result.token0,
        token1: result.token1,
        fee: result.fee,
        liquidity: result.liquidity,
        tickLower: result.tickLower,
        tickUpper: result.tickUpper,
        ammTitle: positionManager.title,
    }))

    const pools: Pool[] = useSingleContractMultipleData(
        UniswapV3Factory && positions.length===count ? getContract(UniswapV3Factory, uniswapV3FactoryABI, library) : undefined,
        "getPool",
        positions.map(position => ([
            position.token0, position.token1, position.fee
        ]))
    ).filter(state => state.valid && !state.loading && state.result).map(({result}, index) => ({
        ...positions[index],
        address: result[0],
    }) as Pool)

    return (
        <>
            <AutoRow>
                <Row>
                    <ResponsiveButtonEmpty onClick={() => back()}>
                        <ArrowLeft color="white"/>
                        <TYPE.text_xs color="white">Select AMM</TYPE.text_xs>
                    </ResponsiveButtonEmpty>
                </Row>
                {
                    pools.length!==count
                        ? <Row justify="center" my="4em">
                            <Loading label="Finding..." />
                        </Row>
                        : count===0
                            ? <>
                                <Row my="1em" justify="center">
                                    <TYPE.text_lg color={"white"}>
                                        No {positionManager.title} NFTS for this account
                                    </TYPE.text_lg>
                                </Row>
                                <Column>
                                    <TYPE.text_xs color={"white"}>
                                        We found no {positionManager.title} liquidity for wallet: {shortenAddress(account)}.
                                    </TYPE.text_xs>
                                    <TYPE.text_xs color={"white"}>
                                        Are you sure the correct chain, wallet, and amm is selected?
                                    </TYPE.text_xs>
                                </Column>
                            </>
                            : <>
                                <Row my="1em" justify="center">
                                    <TYPE.text_lg color={"white"}>
                                        Select position
                                    </TYPE.text_lg>
                                </Row>
                                <Row>
                                    <TYPE.text_xs color={"white"}>
                                        Choose a {positionManager.title} positions to lock
                                    </TYPE.text_xs>
                                </Row>
                                <Row my="1em">
                                    <TYPE.text_xs color={"white"}>
                                        Positions: {count ?? 0}
                                    </TYPE.text_xs>
                                </Row>
                                <Grid>
                                    {
                                        pools.map(pool =>
                                            <PositionItem key={`position-${pool.id}`} pool={pool}/>
                                        )
                                    }
                                </Grid>
                            </>
                }
            </AutoRow>
        </>
    )
}