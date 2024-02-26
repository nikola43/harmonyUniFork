import React from "react";
import { TYPE } from "theme";
const ResultTabLocked = () => {
    return (
        <div className="ResultTabLocked">
            <TYPE.text_xxs color={"white"}>
                Please be aware only the liquidity tokens are locked. Not the actual dollar value.
                This changes as people trade. More liquidity tokens are also minted as people add liquidity to the pool.
            </TYPE.text_xxs>
        </div>
    );
};
export default ResultTabLocked;