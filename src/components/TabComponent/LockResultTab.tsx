import React, { useState } from "react";
import TabNavItem from "./TabNavItem";
import TabContent from "./TabContent";
import ResultTabLocked from "./LockResultTabs/ResultTabLocked";
import ResultTabUnlocked from "./LockResultTabs/ResultTabUnlocked";
import "./LockResultTabs.css";

const LockResultTab = () => {
    const [activeTab, setActiveTab] = useState("tab1");

    return (
        <div className="LockResultTabs">
            <ul className="nav">
                <TabNavItem title="LOCKED (1)" id="tab1" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabNavItem title="UNLOCKED (0)" id="tab2" activeTab={activeTab} setActiveTab={setActiveTab} />
            </ul>

            <div className="outlet">
                <TabContent id="tab1" activeTab={activeTab}>
                    <ResultTabLocked />
                </TabContent>
                <TabContent id="tab2" activeTab={activeTab}>
                    <ResultTabUnlocked />
                </TabContent>
            </div>
        </div>
    );
};
export default LockResultTab;