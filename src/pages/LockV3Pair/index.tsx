import React from "react";
import TabNavItem from "components/TabComponent/TabNavItem";
import CreateLock from "components/LockV3Pair/CreateLock";
import ManageLocks from "components/LockV3Pair/ManageLocks";
import "components/TabComponent/LockTabs.css";
import { activate, useLockerState } from "state/lockerV3/locker.store";

export default function LockV3Pair() {
  const [tab] = useLockerState("tab")

  return (
    <div className="Tabs">
      <ul className="nav">
        <TabNavItem title="Create" id="create" activeTab={tab} setActiveTab={activate} />
        <TabNavItem title="Manage" id="manage" activeTab={tab} setActiveTab={activate} />
      </ul>
      <div className="outlet">
        { tab==="create" && <CreateLock /> }
        { tab==="manage" && <ManageLocks /> }
      </div>
    </div>
  );
}