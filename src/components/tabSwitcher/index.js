import React from 'react';
import styles from './styles.scss';
import CrossIcon from '../../assets/svg/cross.svg';
import PlusIcon from '../../assets/svg/plus.svg';
import CopyIcon from '../../assets/svg/copy.svg';

const TabSwitcher = props => {
  const { handleTabButtonClick, selectedTab, handleAddNewTab, data } = props;

  const index =
    (data.length !== 0 &&
      data.findIndex(item => {
        return parseInt(item.id) == parseInt(selectedTab);
      })) ||
    0;

  return (
    <>
      <div className={styles.tab_switcher}>
        {data.length !== 0 &&
          data.map((item, i) => {
            return (
              <div
                key={i}
                onClick={() => handleTabButtonClick(item.id)}
                className={`${styles.tab_button} ${selectedTab == item.id &&
                  styles.__selected_tab_button}`}
              >
                <div>{item.name}</div>
                <CrossIcon />
              </div>
            );
          })}
        <div onClick={handleAddNewTab} className={styles.add_new_tab_button}>
          <PlusIcon />
        </div>
      </div>
      <div className={`${styles.url_container} secondary_bg`}>
        <div>{data.length !== 0 && data[index].url}</div>
        <CopyIcon />
      </div>
    </>
  );
};

export default TabSwitcher;
