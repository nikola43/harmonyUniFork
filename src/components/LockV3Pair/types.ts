import { Token } from "constants/uniswap"
import { BigNumber } from "ethers"

export interface Pool {
    id: number,
    address: string
    token0: string
    token1: string
    fee: number
    tickLower: number
    tickUpper: number
    liquidity: BigNumber
    ammTitle: string
}
