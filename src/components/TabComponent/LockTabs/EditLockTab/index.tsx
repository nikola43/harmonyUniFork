import React, { useState } from "react";
import { BlueCardShadow } from "components/Card";
import { TYPE } from "theme";
import { useTranslation } from "react-i18next";
import { useLockerState } from "state/lockerV2/locker.store";
import { AutoRow } from "components/Row";
import { usePair, usePairs } from "state/lockerV2/hooks";
import { useActiveWeb3React } from "hooks";
import { useWalletModalToggle } from "state/application/hooks";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { ButtonSecondary } from "components/Button";
import { LockerSearchInput } from "../NewLockTab";
import EditPairCard from "./EditPairCard";
import EditPair from "./EditPair";

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

const EditLockTab = () => {

    const [editStep] = useLockerState("editStep");
    const { account } = useActiveWeb3React()

    const toggleWalletModal = useWalletModalToggle()


    const { t } = useTranslation()

    const [pairAddress, setPairAddress] = useState()
    const [searchQuery, setSearchQuery] = useState('')

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

    const pairsLocked = usePairs()
    const pairFound = usePair(pairAddress)

    return (
        <div className="EditLockTab">
            <BlueCardShadow>
                {
                    editStep === "initial" ?
                        <AutoRow>
                            <TYPE.text_lg color={'primary5'} marginBottom={"24px"}>Edit / Withdraw</TYPE.text_lg>
                            {
                                !account
                                ? <Web3StatusConnect id="connect-wallet" onClick={toggleWalletModal} faded={!account}>
                                    <Text>{t('Connect wallet')}</Text>
                                </Web3StatusConnect>
                                : <>
                                    <TYPE.text_xs color={"white"} marginY={"8px"} >Enter the Uniswap V2 pair address youd like to access</TYPE.text_xs>
                                    <LockerSearchInput
                                        type="text"
                                        id="pair-search-input"
                                        placeholder={t('Uniswap V2 pair address...')}
                                        autoComplete="off"
                                        onChange={handleInput}
                                        value={searchQuery}
                                    // ref={inputRef as RefObject<HTMLInputElement>}
                                    // onChange={handleInput}
                                    // onKeyDown={handleEnter}
                                    />
                                    <TYPE.text_xxs color={'primary5'} textAlign={'center'} marginBottom={"24px"}>e.g. 0xc70bb2736e218861dca818d1e9f7a1930fe61e5b</TYPE.text_xxs>
                                    <AutoRow gap="0.2rem" style={{marginTop: '0.5em'}}>
                                        {
                                            !!pairFound &&
                                            <EditPairCard pair={pairFound}/>
                                        }
                                        {
                                            !pairFound &&
                                            pairsLocked.map(pair => <EditPairCard key={`pair-locked-${pair.address}`} pair={pair}/>)
                                        }
                                    </AutoRow>
                                </>
                            }
                        </AutoRow> :
                        <EditPair />
                }
            </BlueCardShadow>
        </div >
    );
};
export default EditLockTab;