import React, { useState } from "react";
import TabNavItem from "./TabNavItem";
import TabContent from "./TabContent";
import NewLockTab from "./LockTabs/NewLockTab";
import EditLockTab from "./LockTabs/EditLockTab";
import "./Tabs.css";

const Tabs = () => {
    const [activeTab, setActiveTab] = useState("tab1");

    return (
        <div className="Tabs">
            <ul className="nav">
                <TabNavItem title="New Lock" id="tab1" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabNavItem title="Edit / Withdraw" id="tab2" activeTab={activeTab} setActiveTab={setActiveTab} />
            </ul>

            <div className="outlet">
                <TabContent id="tab1" activeTab={activeTab}>
                    <NewLockTab />
                </TabContent>
                <TabContent id="tab2" activeTab={activeTab}>
                    <EditLockTab />
                </TabContent>
            </div>
        </div>
    );
};
export default Tabs;