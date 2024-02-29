import React, { useState } from "react";
import TabNavItem from "components/TabComponent/TabNavItem";
import TabContent from "components/TabComponent/TabContent";
import NewLockTab from "components/TabComponent/LockTabs/NewLockTab";
import EditLockTab from "components/TabComponent/LockTabs/EditLockTab";
import "components/TabComponent/LockTabs.css";

export default function LockService() {
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
}