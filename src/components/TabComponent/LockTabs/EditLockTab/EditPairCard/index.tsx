import React from "react";
import Row from "components/Row";
import styled from 'styled-components'
import { TYPE } from "theme";
import { BlueCardShadow } from "components/Card";
import { selectPair, setEditStep } from "state/locker/locker.store";
import Copy from "components/AccountDetails/Copy";
import { unwrappedToken } from "utils/wrappedCurrency";
import DoubleCurrencyLogo from "components/DoubleLogo";
import { Pair } from "state/locker/hooks";

const LockPairCardWrapper = styled(BlueCardShadow) <{ width?: string; padding?: string; border?: string; borderRadius?: string }>`
  padding: 16px;
  @media (max-width: 1024px) {
    padding: 14px;
  }
  @media (max-width: 768px) {
    padding: 12px; /* Adjust padding for smaller screens */
  }
  @media (max-width: 480px) {
    padding: 10px; /* Adjust padding for smaller screens */
  }
`;

const PairLogo = styled(DoubleCurrencyLogo)`
`

function EditPairCard({pair}: {pair: Pair}) {
    const handleLockSelect = () => {
        setEditStep("pair_selected", true)
        selectPair(pair.address)
    }

    const currency0 = unwrappedToken(pair.token0)
    const currency1 = unwrappedToken(pair.token1)

    if(!pair || !pair.locks || !pair.locks.length)
        return <></>

    return (
        <LockPairCardWrapper>
            <Row marginY={10} justify='space-between' onClick={handleLockSelect}>
                <Row>
                    <PairLogo currency0={currency0} currency1={currency1} size={30}/>
                    <TYPE.text_xs fontWeight={500} color={"white"} padding={2} wrap="nowrap">
                        {pair.token0.symbol} / {pair.token1.symbol}
                    </TYPE.text_xs>
                </Row>
                <Row justify="flex-end">
                    <TYPE.text_xs color={"white"}>
                        {pair.address.slice(0, 6)}...{pair.address.slice(-4)}
                    </TYPE.text_xs>
                    <Copy toCopy={pair.address}/>
                </Row>
            </Row> 
        </LockPairCardWrapper>
    );
};
export default EditPairCard;

