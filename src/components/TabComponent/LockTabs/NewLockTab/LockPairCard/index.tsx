import React from "react";
import Row, { AutoRow } from "components/Row";
import styled from 'styled-components'
import { TYPE } from "theme";
import { ResponsiveButtonSecondary } from "components/Button";
import { BlueCardShadow } from "components/Card";
import { selectPair, setLockerStep } from "state/lockerV2/locker.store";
import Copy from "components/AccountDetails/Copy";
import { unwrappedToken } from "utils/wrappedCurrency";
import DoubleCurrencyLogo from "components/DoubleLogo";
import { Pair } from "state/lockerV2/hooks";

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

const ButtonPairContinue = styled(ResponsiveButtonSecondary)`
  width: 100%;
`

const PairLogo = styled(DoubleCurrencyLogo)`
`

function LockPairCard({pair}: {pair: Pair}) {

    const handlePairSelect = () => {
        setLockerStep("pair_selected")
        selectPair(pair.address)
    }

    const handleLockSelect = () => {
        setLockerStep("lock_result", true)
        selectPair(pair.address)
    }

    const currency0 = unwrappedToken(pair.token0)
    const currency1 = unwrappedToken(pair.token1)

    return (
        <LockPairCardWrapper>
            {
                pair.locks && pair.locks.length
                ?   <Row marginY={10} justify='space-between' onClick={handleLockSelect}>
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
                :   <AutoRow>
                        <TYPE.text_sm fontWeight={600} color={"white"}>
                            Pair found
                        </TYPE.text_sm>
                        <Row marginY={10} justify='space-between'>
                            <Row>
                                <PairLogo currency0={currency0} currency1={currency1} size={30}/>
                                <TYPE.text_xs fontWeight={500} color={"white"} padding={2}>
                                    {pair.token0.symbol} / {pair.token1.symbol}
                                </TYPE.text_xs>
                                {/* <Copy toCopy={pair.address}/> */}
                            </Row>
                            <TYPE.text_xs color={"white"} padding={2}>
                                {pair.balance?.toFixed(6)}
                            </TYPE.text_xs>
                        </Row>
                        <ButtonPairContinue
                            onClick={handlePairSelect}
                            disabled={!pair.balance || pair.balance.equalTo('0')}
                        >
                            <TYPE.text_xs fontWeight={500} color={"white"} textAlign={'center'}>CONTINUE</TYPE.text_xs>
                        </ButtonPairContinue>
                    </AutoRow>
            }
        </LockPairCardWrapper>
    );
};
export default LockPairCard;

