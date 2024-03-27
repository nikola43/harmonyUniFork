import React, { useMemo } from "react"
import { ButtonOutlined } from "components/Button";
import Row from "components/Row";
import { TYPE } from "theme";
import { getContract } from "utils";
import { useActiveWeb3React } from "hooks";

import { useToken } from "hooks/Tokens";
import { unwrappedToken } from "utils/wrappedCurrency";
import DoubleCurrencyLogo from "components/DoubleLogo";
import styled from "styled-components";
import { useSingleCallResult } from "state/multicall/hooks";
import Column from "components/Column";
import { BsBan } from "react-icons/bs";

import poolABI from "../../constants/abis/UniswapV3Pool.json";
import { Pool } from "./types";
import Loading from "./Loading";
import { navigate } from "state/lockerV3/locker.store";

const StyledItem = styled(ButtonOutlined)`
    display: flex;
    flex-direction: column;
    gap: 1em;
    color: white;
    &:disabled {
        opacity: 0.8;
        border-color: ${({ theme }) => theme.bg4};
    }
`

const Q96 = 2 ** 96 // BigNumber.from(2).pow(96);

function getTickAtSqrtPrice(sqrtPriceX96){
	let tick = Math.floor(Math.log((sqrtPriceX96 / Q96)**2)/Math.log(1.0001));
	return tick;
}

function getTokenAmounts(liquidity: number, sqrtPriceX96: number, tickLow: number, tickHigh: number, decimal0: number, decimal1: number){
	const sqrtRatioA = Math.sqrt(1.0001**tickLow);
	const sqrtRatioB = Math.sqrt(1.0001**tickHigh);
	const currentTick = getTickAtSqrtPrice(sqrtPriceX96);
    const sqrtPrice = sqrtPriceX96 / Q96;
	let amount0 = 0;
	let amount1 = 0;
	if(currentTick < tickLow){
		amount0 = Math.floor(liquidity*((sqrtRatioB-sqrtRatioA)/(sqrtRatioA*sqrtRatioB)));
	}
	else if(currentTick >= tickHigh){
		amount1 = Math.floor(liquidity*(sqrtRatioB-sqrtRatioA));
	}
	else if(currentTick >= tickLow && currentTick < tickHigh){ 
		amount0 = Math.floor(liquidity*((sqrtRatioB-sqrtPrice)/(sqrtPrice*sqrtRatioB)));
		amount1 = Math.floor(liquidity*(sqrtPrice-sqrtRatioA));
	}

	const amount0Human = (amount0/(10**decimal0)).toFixed(decimal0);
	const amount1Human = (amount1/(10**decimal1)).toFixed(decimal1);
    
	return {
        closed: amount0===0 || amount1===0,
        amount0: amount0Human, 
        amount1: amount1Human, 
        percent0: Math.min(1, Math.max(0, (currentTick - tickHigh) / (tickLow - tickHigh))) * 100,
        percent1: Math.min(1, Math.max(0, (currentTick - tickLow) / (tickHigh - tickLow))) * 100,
    }
}

export default function PositionItem({ pool } : { pool: Pool }) {
    const { library } = useActiveWeb3React()

    const UniswapV3Pool = getContract(pool.address, poolABI, library)
    const token0 = useToken(pool.token0)
    const token1 = useToken(pool.token1)

    const poolState = useSingleCallResult(UniswapV3Pool, 'slot0')

    const reserves = useMemo(() => {
        if(!poolState.loading && poolState.valid) {
            return getTokenAmounts(
                Number(pool.liquidity.toString()),
                Number(poolState.result.sqrtPriceX96.toString()),
                pool.tickLower,
                pool.tickUpper,
                token0.decimals,
                token1.decimals
            )
        }
        return undefined
    }, [poolState, token0, token1, pool])

    const currency0 = unwrappedToken(token0)
    const currency1 = unwrappedToken(token1)

    return <StyledItem disabled={!token0 || !token1 || !reserves || reserves.closed} onClick={() => navigate("locking", { pool, reserves, token0, token1 })}>
        <Row justify="center">
            <TYPE.text_sm color="white">NFT {pool.id}</TYPE.text_sm>
        </Row>
        {
            !token0 || !token1
            ? <Loading label="Loading..." />
            : <>
                <Row justify="center">
                    <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={40}/>
                </Row>
                {
                    reserves
                    ? <>
                        <Row justify="center" gap="1em">
                            <Column align="flex-end" style={{ flex: 1 }}>
                                <TYPE.text_xs color="white">{token0.symbol}</TYPE.text_xs>
                                {
                                    !reserves.closed &&
                                    <>
                                        <TYPE.text_xxs color="white">{Number(reserves.amount0).toFixed(Math.min(6, token0.decimals))}</TYPE.text_xxs>
                                        <TYPE.text_xxs color="#fff8">{Number(reserves.percent0).toFixed(1)}%</TYPE.text_xxs>
                                    </>
                                }
                            </Column>
                            <Column align="flex-start" style={{ flex: 1 }}>
                                <TYPE.text_xs color="white">{token1.symbol}</TYPE.text_xs>
                                {
                                    !reserves.closed &&
                                    <>
                                        <TYPE.text_xxs color="white">{Number(reserves.amount1).toFixed(Math.min(6, token1.decimals))}</TYPE.text_xxs>
                                        <TYPE.text_xxs color="#fff8">{Number(reserves.percent1).toFixed(1)}%</TYPE.text_xxs>
                                    </>
                                }
                            </Column>
                        </Row>
                        {
                            reserves.closed &&
                            <Row justify="center" align="center" gap="0.5em">
                                <TYPE.text_xs color="#fff8">Closed</TYPE.text_xs>
                                <BsBan color="#fff8"/>
                            </Row>
                        }
                    </>
                    : <Loading style={{ height: '3em' }} />
                }
            </>
        }
        <Row border="1px solid #fff8" borderRadius="1em" justify="center">
            <TYPE.text_sm color="#fff8">{pool.ammTitle}</TYPE.text_sm>
        </Row>
    </StyledItem>
}