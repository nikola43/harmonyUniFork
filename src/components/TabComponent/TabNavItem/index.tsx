import React from "react";
import { TYPE } from "theme";
const TabNavItem = ({ id, title, activeTab, setActiveTab }) => {

    const handleClick = () => {
        setActiveTab(id);
    };

    return (
        <li onClick={handleClick} className={activeTab === id ? "active" : ""}>
            <TYPE.text_sm>{title}</TYPE.text_sm>
        </li>
    );
};
export default TabNavItem;