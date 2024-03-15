import { BigintIsh, Token, TokenAmount } from "constants/uniswap";
import { useActiveWeb3React } from "hooks";
import { useMemo } from "react";
import { useMulticall, useSingleCallResult, useSingleContractMultipleData } from "state/multicall/hooks";
import { getLockerContract, getPairContract, getTokenContract } from "utils";

export class LockedAmount extends TokenAmount {
    lockID: number
    lockDate: Date
    unlockDate: Date
    owner: string
    constructor(token: Token, amount: BigintIsh, props: any) {
        super(token, amount)
        for(const k in props) {
            this[k] = props[k]
        }
    }
}

export class TokenBalance extends Token {
    balance: TokenAmount
    totalSupply: TokenAmount

    constructor(token: Token, props?: any) {
        super(token.chainId, token.address, token.decimals, token.symbol, token.name)
        if(props) for(const k in props) {
            if(['balance', 'totalSupply'].includes(k))
                this[k] = new TokenAmount(token, props[k])
            else
                this[k] = props[k]
        }
    }
}

export class Pair extends TokenBalance {
    token0: TokenBalance
    token1: TokenBalance
    locks?: LockedAmount[]

    constructor(token: Token, props: any) {
        super(token)
        for(const k in props) {
            if(['balance', 'totalSupply'].includes(k))
                this[k] = new TokenAmount(token, props[k])
            else
                this[k] = props[k]
        }
    }
}

export function usePair(_pair: string) : Pair | undefined {
    const { account, library, chainId } = useActiveWeb3React()
    const lockerContract = getLockerContract(chainId, library)

    const [pair] = useAllPairs(_pair ? [_pair] : [])
    const numUserLocked = useSingleCallResult(
        lockerContract, 
        'getUserNumLocksForToken', 
        [account, _pair]
    )?.result?.[0]?.toNumber()

    const userLocked = useSingleContractMultipleData(
        lockerContract, 
        'getUserLockForTokenAtIndex', 
        new Array(numUserLocked ?? 0).fill(0).map((_, i) => [account, _pair, i])
    )?.filter(state => state.valid && !state.loading && state.result).map(state => state.result[0])

    return useMemo(() => {
        if(pair) {
            if(userLocked) {
                pair.locks = userLocked.reduce((result, lock) => {
                    return [
                        ...result,
                        new LockedAmount(pair, lock.amount, {
                            lockID: lock.lockID.toNumber(),
                            lockDate: new Date(lock.lockDate.toNumber() * 1000),
                            unlockDate: new Date(lock.unlockDate.toNumber() * 1000),
                            owner: lock.owner,
                        })
                    ]
                }, [])
            }
        }
        return pair
    }, [pair, userLocked])
}

const useAllPairs = (lpTokens) : Pair[] => {
    const { library, account, chainId } = useActiveWeb3React()

    const callsPair = useMemo(() => {
        return lpTokens.reduce((args, token) => [
            ...args,
            {
                contract: getPairContract(token, library),
                methodName: 'balanceOf', 
                args: [account]
            }, {
                contract: getPairContract(token, library),
                methodName: 'totalSupply',
            }, {
                contract: getPairContract(token, library),
                methodName: 'decimals',
            }, {
                contract: getPairContract(token, library),
                methodName: 'getReserves',
            }, {
                contract: getPairContract(token, library),
                methodName: 'token0',
            }, {
                contract: getPairContract(token, library),
                methodName: 'token1',
            }
        ], [])
    }, [lpTokens, account, library])

    const pairResults = useMulticall(callsPair)?.filter(state => state.valid && !state.loading && state.result).map(state => state.result)

    const pairs = useMemo(() => {
        if(pairResults && pairResults.length===lpTokens.length * 6) {
            return lpTokens.map((address, index) => ({
                token: new Token(chainId, address, pairResults[index * 6 + 2]?.[0]),
                balance: pairResults[index * 6]?.[0],
                totalSupply: pairResults[index * 6 + 1]?.[0],
                reserve0: pairResults[index * 6 + 3]?.[0],
                reserve1: pairResults[index * 6 + 3]?.[1],
                token0Address: pairResults[index * 6 + 4]?.[0],
                token1Address: pairResults[index * 6 + 5]?.[0],
            }))
        }
        return []
    }, [pairResults, chainId, lpTokens])

    const callsTokens = useMemo(() => {
        return pairs.reduce((args, pair) => [
            ...args,
            {
                contract: getTokenContract(pair.token0Address, library),
                methodName: 'name',
            }, {
                contract: getTokenContract(pair.token0Address, library),
                methodName: 'symbol',
            }, {
                contract: getTokenContract(pair.token0Address, library),
                methodName: 'decimals',
            }, {
                contract: getTokenContract(pair.token0Address, library),
                methodName: 'totalSupply',
            }, {
                contract: getTokenContract(pair.token1Address, library),
                methodName: 'name',
            }, {
                contract: getTokenContract(pair.token1Address, library),
                methodName: 'symbol',
            }, {
                contract: getTokenContract(pair.token1Address, library),
                methodName: 'decimals',
            }, {
                contract: getTokenContract(pair.token1Address, library),
                methodName: 'totalSupply',
            }
        ], [])
    }, [pairs, library])

    const tokenResults = useMulticall(callsTokens)?.filter(state => state.valid && !state.loading && state.result).map(state => state.result[0])
    return useMemo(() => {
        if(pairs && tokenResults?.length===pairs.length * 8) {
            return pairs.map((pair, index) => {
                const token0 = new Token(chainId, pair.token0Address, tokenResults[index * 8 + 2], tokenResults[index * 8 + 1], tokenResults[index * 8 + 0])
                const token1 = new Token(chainId, pair.token1Address, tokenResults[index * 8 + 6], tokenResults[index * 8 + 5], tokenResults[index * 8 + 4])
                return new Pair(pair.token, {
                    balance: pair.balance,
                    totalSupply: pair.totalSupply,
                    token0: new TokenBalance(token0, {
                        balance: pair.reserve0,
                        totalSupply: tokenResults[index * 8 + 3]
                    }),
                    token1: new TokenBalance(token1, {
                        balance: pair.reserve1,
                        totalSupply: tokenResults[index * 8 + 7]
                    })
                })
            })
        }
        return []
    }, [pairs, tokenResults, chainId])
} 

export const usePairs = () : Pair[] => {
    const { account, library, chainId } = useActiveWeb3React()

    const lockerContract = getLockerContract(chainId, library)

    const numLockedTokens = useSingleCallResult(lockerContract, 'getUserNumLockedTokens', [account])
    const lockedTokens = useSingleContractMultipleData(
        account ? lockerContract : undefined, 
        'getUserLockedTokenAtIndex', 
        new Array(numLockedTokens?.result?.[0].toNumber()).fill(0).map((_, index) => [account, String(index)])
    )?.filter(state => state.valid && !state.loading && state.result).map(state => state.result[0])

    const pairs = useAllPairs(lockedTokens)

    const argsNumLocked = useMemo(() => {
        return lockedTokens?.map(token => [account, token])
    }, [lockedTokens, account])

    const numUserLocked = useSingleContractMultipleData(
        lockerContract, 
        'getUserNumLocksForToken', 
        argsNumLocked
    )?.filter(state => state.valid && !state.loading && state.result).map(state => state.result[0].toNumber())

    const argsUserLocked = useMemo(() => {
        if(!argsNumLocked || !numUserLocked)
            return []
        return argsNumLocked.reduce(
            (args, arg, i) => {
                return [
                    ...args, 
                    ...(
                        new Array(numUserLocked[i]).fill(0).map((_, j) => [...arg, j])
                    )
                ]
            }, 
            []
        )
    }, [argsNumLocked, numUserLocked])

    const userLocked = useSingleContractMultipleData(
        lockerContract, 
        'getUserLockForTokenAtIndex', 
        argsUserLocked
    )?.filter(state => state.valid && !state.loading && state.result).map(state => state.result[0])

    return useMemo(() => {
        if(userLocked) {
            return userLocked.reduce((result, lock) => {
                const key = lock.lpToken
                const pair = result.find(p => p.address===key)
                if(pair) {
                    pair.locks = [
                        ...(pair.locks ?? []),
                        new LockedAmount(pair, lock.amount, {
                            lockID: lock.lockID.toNumber(),
                            lockDate: new Date(lock.lockDate.toNumber() * 1000),
                            unlockDate: new Date(lock.unlockDate.toNumber() * 1000),
                            owner: lock.owner,
                        })
                    ]
                }
                return result
            }, pairs)
        }
        return []
    }, [pairs, userLocked])
}