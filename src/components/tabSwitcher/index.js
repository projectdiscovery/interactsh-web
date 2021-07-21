import React, { useState } from "react";
import styles from "./styles.scss";
import { ReactComponent as CrossIcon } from "../../assets/svg/cross.svg";
import { ReactComponent as PlusIcon } from "../../assets/svg/plus.svg";
import { ReactComponent as RefreshIcon } from "../../assets/svg/refresh.svg";

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
      <div className={styles.tab_switcher}>
        {data.length !== 0 &&
          data.map((item, i) => (
            <div
              key={i}
              onKeyUp={handleTabRanameDone}
              onClick={() => handleTabButtonClickTemp(item)}
              onDoubleClick={() => handleTabButtonDoubleClick(item.id)}
              className={`${styles.tab_button} ${
                selectedTab.id == item.id && styles.__selected_tab_button
              }`}
            >
              {isInputVisible && item.id == selectedTab.id ? (
                <input
                  id={item.id}
                  value={item.name}
                  onChange={handleTabRename}
                />
              ) : (
                <div title={item.name}>{item.name}</div>
              )}
              <CrossIcon onClick={() => handleDeleteTab(item.id)} />
            </div>
          ))}
        <div onClick={handleAddNewTab} className={styles.add_new_tab_button}>
          <PlusIcon />
        </div>
        <div
          onClick={processPolledData}
          className={`${styles.refresh_button} secondary_bg`}
        >
          <RefreshIcon />
          <span>Refresh</span>
        </div>
      </div>
    </>
  );
};

export default TabSwitcher;
