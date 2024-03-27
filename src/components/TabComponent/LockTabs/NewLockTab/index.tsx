import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import uniLogo from 'assets/images/token-logo.png'
import { ButtonSecondary } from 'components/Button'
import { BlueCardShadow } from 'components/Card'
import Loader from 'components/Loader'
import Row, { AutoRow, RowBetween } from 'components/Row'
import { SearchInput } from 'components/SearchModal/styleds'
// import useENSName from 'hooks/useENSName'
import { useHasSocks } from 'hooks/useSocksBalance'
import { darken, lighten } from 'polished'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWalletModalToggle } from 'state/application/hooks'
import { useLockerState } from 'state/lockerV2/locker.store'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import styled, { css } from 'styled-components'
import { TYPE } from '../../../../theme'
import LockPair from './LockPair'
import LockPairCard from './LockPairCard'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { Pair, usePair, usePairs } from 'state/lockerV2/hooks'
import Loading from 'components/LockV3Pair/Loading'

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`

const Web3StatusConnect = styled(Web3StatusGeneric) <{ faded?: boolean }>`
  background-color: ${({ theme }) => theme.primary4};
  border: none;
  color: ${({ theme }) => theme.primaryText1};
  font-weight: 500;

  :hover,
  :focus {
    border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)};
    color: ${({ theme }) => theme.primaryText1};
  }

  ${({ faded }) =>
    faded &&
    css`
      background-color: ${({ theme }) => theme.primary5};
      border: 1px solid ${({ theme }) => theme.primary5};
      color: ${({ theme }) => theme.primaryText1};

      :hover,
      :focus {
        border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)};
        color: ${({ theme }) => darken(0.05, theme.primaryText1)};
      }
    `}
`

const Web3StatusConnected = styled('div') <{ pending?: boolean }>`
  /* background-color: ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg2)}; */
  /* border: 1px solid ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg3)}; */
  width: 100%;
  color: ${({ pending, theme }) => (pending ? theme.white : theme.text1)};
  /* font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ pending, theme }) => (pending ? darken(0.05, theme.primary1) : lighten(0.05, theme.bg2))};

    :focus {
      border: 1px solid ${({ pending, theme }) => (pending ? darken(0.1, theme.primary1) : darken(0.1, theme.bg3))};
    }
  } */
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`

export const LockerSearchInput = styled(SearchInput)`
  background: white;
  /* border-style: none; */
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

const SOCK = (
  <span role="img" aria-label="has socks emoji" style={{ marginTop: -4, marginBottom: -4 }}>
    🧦
  </span>
)

function Web3StatusLock() {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  // const [pairSelected] = useLockerState("pairSelected");

  // const { ENSName } = useENSName(account ?? undefined)
  const [pairAddress, setPairAddress] = useState()
  const [searchQuery, setSearchQuery] = useState('')

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)

  const hasPendingTransactions = !!pending.length
  const hasSocks = useHasSocks()
  const toggleWalletModal = useWalletModalToggle()

  const handleInput = (e) => {
    const query = e.target.value
    if(!query || /^(0|0x|0x[\da-fA-F]{0,40})$/.test(query)) {
      setSearchQuery(query)
      if(/^0x[\da-fA-F]{0,40}$/.test(query))
        setPairAddress(query)
      else
        setPairAddress(undefined)
    } else
      setPairAddress(undefined)
  }

  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const pairsLocked = usePairs()

  const pairsFromLiquidity = useMemo(
    () => liquidityTokensWithBalances.filter(({liquidityToken}) => !pairsLocked?.find(pair => pair.address===liquidityToken.address)),
    [liquidityTokensWithBalances, pairsLocked]
  )

  const pairFound = usePair(pairAddress)

  if (account) {
    return (
      <Web3StatusConnected id="web3-status-connected" pending={hasPendingTransactions}>
        {hasPendingTransactions ? (
          <RowBetween>
            <Text>{pending?.length} Pending</Text> <Loader stroke="white" />
          </RowBetween>
        ) : (
          <>
            {hasSocks ? SOCK : null}
            {/* <Text>{ENSName || account}</Text> */}
            <TYPE.text_xs color={"white"} marginY={10}>
              Enter the Uniswap V2 pair address youd like to lock liquidity for
            </TYPE.text_xs>
            <LockerSearchInput
              type="text"
              id="pair-search-input"
              placeholder={t('Uniswap V2 pair address...')}
              autoComplete="off"
              value={searchQuery}
            // ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
            // onKeyDown={handleEnter}
            />
            <TYPE.text_xxs color={'primary5'} textAlign={'center'}>e.g. 0xc70bb2736e218861dca818d1e9f7a1930fe61e5b</TYPE.text_xxs>
            {
              <AutoRow gap="0.2rem" style={{marginTop: '0.5em'}}>
                {
                  !!pairFound &&// pairsFromLiquidity.length==0 &&
                  <LockPairCard pair={pairFound}/>
                }
                {
                  !pairFound && pairsFromLiquidity.map(({liquidityToken, tokens}) => <LockPairCard key={`pair-${liquidityToken.address}`} pair={{ ...liquidityToken, token0: tokens[0], token1: tokens[1], balance: v2PairsBalances[liquidityToken.address]} as Pair}/>)
                }
                {
                  !pairFound &&
                  pairsLocked.map(pair => <LockPairCard key={`pair-locked-${pair.address}`} pair={pair}/>)
                }
              </AutoRow>
            }
          </>
        )}
      </Web3StatusConnected>
    )
  } else {
    return (
      <Web3StatusConnect id="connect-wallet" onClick={toggleWalletModal} faded={!account}>
        <Text>{t('Connect wallet')}</Text>
      </Web3StatusConnect>
    )
  }
}

const NewLockTab = () => {
  const [lockerStep] = useLockerState("lockerStep");

  return (
    <div className="NewLockTab">
      <BlueCardShadow>
        {
          lockerStep === "initial" ?
            <AutoRow>
              <Row style={{ marginBottom: "10px" }}>
                <img width={'36px'} src={uniLogo} alt="logo" />
                <TYPE.text_sm fontWeight={600} color={"white"} padding={2}>
                  Uniswap V2 Locker
                </TYPE.text_sm>
              </Row>
              <TYPE.text_xs color={"white"} marginY={10}>
                Use the locker to prove to investors you have locked liquidity. If you are not a token developer, this section is almost definitely not for you.
              </TYPE.text_xs>
              <TYPE.text_xs color={"white"} width={"100%"} marginY={10}>
                Our lockers offer
              </TYPE.text_xs>
              <ul style={{ marginBottom: "20px" }}>
                <li><TYPE.text_xs color={"white"}>Lock splitting</TYPE.text_xs></li>
                <li><TYPE.text_xs color={"white"}>Liquidity Migration</TYPE.text_xs></li>
                <li><TYPE.text_xs color={"white"}>Relocking</TYPE.text_xs></li>
                <li><TYPE.text_xs color={"white"}>Lock ownership transfer</TYPE.text_xs></li>
              </ul>
              <Web3StatusLock />

            </AutoRow> :
            <LockPair />
        }
      </BlueCardShadow>
    </div>
  );
};
export default NewLockTab;