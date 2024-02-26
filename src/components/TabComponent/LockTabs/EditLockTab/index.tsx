import React from "react";
import { BlueCardShadow } from "components/Card";
import { TYPE } from "theme";
import { LockerSearchInput } from "../NewLockTab";
import { useTranslation } from "react-i18next";
import EditPairCard from "./EditPairCard";
import { useLockerState } from "state/locker/locker.store";
import EditPair from "./EditPair";
import { AutoRow } from "components/Row";

const EditLockTab = () => {

    const [editStep] = useLockerState("editStep");

    const { t } = useTranslation()

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
                            // value={searchQuery}
                            // ref={inputRef as RefObject<HTMLInputElement>}
                            // onChange={handleInput}
                            // onKeyDown={handleEnter}
                            />
                            <TYPE.text_xxs color={'primary5'} textAlign={'center'} marginBottom={"24px"}>e.g. 0xc70bb2736e218861dca818d1e9f7a1930fe61e5b</TYPE.text_xxs>
                            <EditPairCard />
                        </AutoRow> :
                        <EditPair />
                }
            </BlueCardShadow>
        </div >
    );
};
export default EditLockTab;