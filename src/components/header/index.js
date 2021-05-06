import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './styles.scss';
import ThemeDarkButtonIcon from '../../assets/svg/theme_dark_button.svg';
import ThemeSynthButtonIcon from '../../assets/svg/theme_synth_button.svg';
import ThemeBlueButtonIcon from '../../assets/svg/theme_blue_button.svg';
import DownloadIcon from '../../assets/svg/download.svg';
import DeleteIcon from '../../assets/svg/delete.svg';
import dateTransform from '../common/dateTransform';

const Header = props => {
  const { handleThemeSelection, theme, handleAboutPopupVisibility } = props;
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);

  const handleThemeSwitchesVisibility = () => {
    setIsSelectorVisible(!isSelectorVisible);
  };

  const handleReset = () => {
    localStorage.clear();
    location.reload();
  };

  const handleDataExport = () => {
    // var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(localStorage.data));
    // var downloadAnchorElement = document.getElementById('download_anchor_element');
    // downloadAnchorElement.setAttribute('href', dataStr);
    // downloadAnchorElement.setAttribute('download', 'data.json');
    // downloadAnchorElement.click();

    var values = [],
      keys = Object.keys(localStorage),
      i = keys.length;

    while (i--) {
      values.push(
        JSON.stringify({
          key: keys[i],
          data: localStorage.getItem(keys[i])
        })
      );
    }

    var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(values);
    var downloadAnchorElement = document.createElement('a');
    downloadAnchorElement.setAttribute('href', dataStr);
    downloadAnchorElement.setAttribute(
      'download',
      dateTransform(Date.now(), 'yyyy-mm-dd_hh:mm') + '.json'
    );
    document.body.appendChild(downloadAnchorElement); // required for firefox
    downloadAnchorElement.click();
    downloadAnchorElement.remove();
  };

  return (
    <div id="header" className={styles.header}>
      <div>interact.sh</div>
      <div onClick={handleThemeSwitchesVisibility}>
        <div
          className={`${isSelectorVisible && styles.__selector_visible} ${theme == 'dark' &&
            styles.__selected} ${!isSelectorVisible && styles.__without_bg}`}
          onClick={() => handleThemeSelection('dark')}
        >
          <ThemeDarkButtonIcon />
          Dark
        </div>
        <div
          className={`${isSelectorVisible && styles.__selector_visible} ${theme == 'synth' &&
            styles.__selected} ${!isSelectorVisible && styles.__without_bg}`}
          onClick={() => handleThemeSelection('synth')}
        >
          <ThemeSynthButtonIcon />
          Synth
        </div>
        <div
          className={`${isSelectorVisible && styles.__selector_visible} ${theme == 'blue' &&
            styles.__selected} ${!isSelectorVisible && styles.__without_bg}`}
          onClick={() => handleThemeSelection('blue')}
        >
          <ThemeBlueButtonIcon />
          Blue
        </div>
      </div>
      <div className={styles.links}>
        {/* <div className */}
        <div title="Reset data" onClick={handleReset}>
          <DeleteIcon />
          Reset
        </div>
        <div title="Export" onClick={handleDataExport}>
          <DownloadIcon />
          Export
        </div>
        <div className={styles.vertical_bar} />
        <a href="/#/terms">Terms</a>
        <div onClick={handleAboutPopupVisibility}>About</div>
      </div>
    </div>
  );
};

export default Header;
