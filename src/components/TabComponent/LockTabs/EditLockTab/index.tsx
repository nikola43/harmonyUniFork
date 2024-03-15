import React, { useState } from "react";
import { BlueCardShadow } from "components/Card";
import { TYPE } from "theme";
import { useTranslation } from "react-i18next";
import { useLockerState } from "state/locker/locker.store";
import { AutoRow } from "components/Row";
import { usePair, usePairs } from "state/locker/hooks";
import { LockerSearchInput } from "../NewLockTab";
import EditPairCard from "./EditPairCard";
import EditPair from "./EditPair";

const EditLockTab = () => {

    const [editStep] = useLockerState("editStep");

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
            < BlueCardShadow >
                {
                    editStep === "initial" ?
                        <AutoRow>
                            <TYPE.text_lg color={'primary5'} marginBottom={"24px"}>Edit / Withdraw</TYPE.text_lg>
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
                        </AutoRow> :
                        <EditPair />
                }
            </BlueCardShadow>
        </div >
    );
};
export default EditLockTab;