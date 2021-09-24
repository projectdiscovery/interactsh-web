import React, { useState } from "react";

import "./styles.scss";
import { ReactComponent as CrossIcon } from "assets/svg/cross.svg";
import { ReactComponent as PlusIcon } from "assets/svg/plus.svg";
import { ReactComponent as RefreshIcon } from "assets/svg/refresh.svg";
import Tab from "lib/types/tab";

interface TabSwitcherP {
  handleTabButtonClick: (tab: Tab) => void;
  selectedTab: Tab;
  handleAddNewTab: () => void;
  data: Tab[];
  handleDeleteTab: (tab: Tab) => void;
  handleTabRename: React.ChangeEventHandler<HTMLInputElement>;
  processPolledData: () => void;
}
const TabSwitcher = ({
  handleTabButtonClick,
  selectedTab,
  handleAddNewTab,
  data,
  handleDeleteTab,
  handleTabRename,
  processPolledData,
}: TabSwitcherP) => {
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);

  const handleTabButtonClickTemp = (item: Tab) => {
    handleTabButtonClick(item);
    setIsInputVisible(false);
  };
  const handleTabRanameDone = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.keyCode === 13) {
      setIsInputVisible(false);
    }
  };
  const handleTabButtonDoubleClick = (id: string) => {
    if (!isInputVisible) {
      setIsInputVisible(true);
      setTimeout(() => {
        document.getElementById(id.toString())?.focus();
      }, 200);
    }
  };

  return (
    <>
      <div className="tab_switcher light_bg">
        {data.length !== 0 &&
          data.map((item) => (
            <button
              type="button"
              key={item["unique-id"]}
              onKeyUp={handleTabRanameDone}
              onClick={() =>
                !Tab.eq.equals(selectedTab, item) ? handleTabButtonClickTemp(item) : ""
              }
              onDoubleClick={() => handleTabButtonDoubleClick(item["unique-id"])}
              className={`tab_button ${
                Tab.eq.equals(selectedTab, item) && "__selected_tab_button"
              }`}
            >
              {isInputVisible && Tab.eq.equals(selectedTab, item) ? (
                <input
                  id={item["unique-id"].toString()}
                  value={item.name}
                  onChange={handleTabRename}
                />
              ) : (
                <div title={item.name}>{item.name}</div>
              )}
              <CrossIcon onClick={() => handleDeleteTab(item)} />
            </button>
          ))}
        <button type="button" onClick={handleAddNewTab} className="add_new_tab_button">
          <PlusIcon />
        </button>
        <button type="button" onClick={processPolledData} className="refresh_button">
          <RefreshIcon />
          <span>Refresh</span>
        </button>
      </div>
    </>
  );
};

export default TabSwitcher;
