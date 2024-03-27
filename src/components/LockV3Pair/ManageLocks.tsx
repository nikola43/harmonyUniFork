import { BlueCardShadow } from "components/Card"
import Row, { AutoRow } from "components/Row"
import React, { useMemo } from "react"
import { TYPE } from "theme"

import uniLogo from 'assets/images/token-logo.png'
import { useLockerPage } from "state/lockerV3/locker.store"
import { useActiveWeb3React } from "hooks"
import { getContract, getLockerV3Contract } from "utils"
import { useSingleCallResult, useSingleContractMultipleData } from "state/multicall/hooks"

import { UNISWAP_V3_POSITION_MANAGERS } from "../../constants"
import positionManagerABI from "../../constants/abis/PositionManager.json"
import uniswapV3FactoryABI from "../../constants/abis/UniswapV3Factory.json"
import { Pool } from "./types"
import Loading from "./Loading"
import Lock from "./Lock"
import Column from "components/Column"

function Locks({ amm } : { amm: string }) {
    const { chainId, library, account } = useActiveWeb3React()

    const Locker = getLockerV3Contract(chainId, library, account)

    const count = useSingleCallResult(Locker, "getNumUserLocks", [account])?.result?.[0]?.toNumber()
    const locks: any[] = useSingleContractMultipleData(
        count ? Locker : undefined, 
        "getUserLockAtIndex", 
        count ? Array.from(new Array(count), (_, index) => [account, index]) : undefined
    ).filter(state => state.valid && !state.loading && state.result).map(({result: [lock]}) => ({
        id: Number(lock.lock_id.toString()),
        pool: lock.pool,
        nft_id: Number(lock.nft_id.toString()),
        timeUnlock: lock.unlockDate,
        amm
    }))

    const positionManager: any = useMemo(() => UNISWAP_V3_POSITION_MANAGERS.find(pm => pm.title === amm), [amm])
    const PositionManager = getContract(positionManager?.address, positionManagerABI, library, account)
    const UniswapV3Factory = useSingleCallResult(PositionManager, "factory")?.result?.[0]

    const positions: any[] = useSingleContractMultipleData(
        locks.length===count ? PositionManager : undefined, 
        "positions", 
        locks.length ? locks.map(lock => [lock.nft_id]) : undefined
    ).filter(state => state.valid && !state.loading && state.result).map(({result}, index) => ({
        id: locks[index].nft_id,
        token0: result.token0,
        token1: result.token1,
        fee: result.fee,
        liquidity: result.liquidity,
        tickLower: result.tickLower,
        tickUpper: result.tickUpper,
        ammTitle: positionManager.title,
    }))

    const pools: Pool[] = useSingleContractMultipleData(
        UniswapV3Factory && locks.length===count ? getContract(UniswapV3Factory, uniswapV3FactoryABI, library) : undefined,
        "getPool",
        positions.map(position => ([
            position.token0, position.token1, position.fee
        ]))
    ).filter(state => state.valid && !state.loading && state.result).map(({result}, index) => ({
        ...positions[index],
        address: result[0],
    }) as Pool)

    return <>
        {
            pools.length===count
            ? <>
                <Row justify="flex-end" mb={1}>
                    <TYPE.text_xs color="white">locks: {count}</TYPE.text_xs>
                </Row>
                {
                    pools.map((pool, index) => 
                        <Lock key={`lock-${locks[index].id}`} pool={pool} lock={locks[index]} />
                    )
                }
            </>
            : <Row justify="center" my="3em">
                <Loading label="Loading..." />
            </Row>
        }
    </>
}

export default function ManageLock() {
    const page = useLockerPage()
    const positionManagers = useMemo(() => UNISWAP_V3_POSITION_MANAGERS, [])
    return <>
        <BlueCardShadow>
            {
                !page &&
                <>
                    <AutoRow>
                        <Row mb={2}>
                            <img width={'36px'} src={uniLogo} alt="logo" />
                            <TYPE.text_lg fontWeight={600} color={"white"} padding={2}>
                                Your Locks
                            </TYPE.text_lg>
                        </Row>
                        <Column gap="0.5em" style={{width: '100%'}}>
                        {
                            positionManagers.map((_pm) =>
                                <Locks key={`pm-${_pm.address}`} amm={_pm.title} />
                            )
                        }
                        </Column>
                    </AutoRow>
                </>
            }
            {/* {
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
            } */}
        </BlueCardShadow>
    </>
}