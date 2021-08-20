import React, { useState } from "react";
import "./styles.scss";
import { ReactComponent as CrossIcon } from "assets/svg/cross.svg";
import { ReactComponent as PlusIcon } from "assets/svg/plus.svg";
import { ReactComponent as RefreshIcon } from "assets/svg/refresh.svg";

const TabSwitcher = (props) => {
  const {
    handleTabButtonClick,
    selectedTab,
    handleAddNewTab,
    data,
    handleDeleteTab,
    handleTabRename,
    processPolledData,
  } = props;

  const [isInputVisible, setIsInputVisible] = useState(false);

  const handleTabButtonClickTemp = (item) => {
    handleTabButtonClick(item);
    setIsInputVisible(false);
  };
  const handleTabRanameDone = (e) => {
    if (e.keyCode === 13) {
      setIsInputVisible(false);
    }
  };
  const handleTabButtonDoubleClick = (id) => {
    if (!isInputVisible) {
      setIsInputVisible(true);
      setTimeout(() => {
        document.getElementById(id).focus();
      }, 200);
    }
  };

  return (
    <>
      <div className="tab_switcher">
        {data.length !== 0 &&
          data.map(item => (
            <button
              type="button"
              key={item}
              onKeyUp={handleTabRanameDone}
              onClick={() => handleTabButtonClickTemp(item)}
              onDoubleClick={() => handleTabButtonDoubleClick(item.id)}
              className={`tab_button ${
                selectedTab.id === item.id && "__selected_tab_button"
              }`}
            >
              {isInputVisible && item.id === selectedTab.id ? (
                <input
                  id={item.id}
                  value={item.name}
                  onChange={handleTabRename}
                />
              ) : (
                <div title={item.name}>{item.name}</div>
              )}
              <CrossIcon onClick={() => handleDeleteTab(item.id)} />
            </button>
          ))}
        <button type="button" onClick={handleAddNewTab} className="add_new_tab_button">
          <PlusIcon />
        </button>
        <button
          type="button"
          onClick={processPolledData}
          className="refresh_button secondary_bg"
        >
          <RefreshIcon />
          <span>Refresh</span>
        </button>
      </div>
    </>
  );
};

export default TabSwitcher;
