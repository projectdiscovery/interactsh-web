import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './styles.scss';
import ThemeDarkButtonIcon from '../../assets/svg/theme_dark_button.svg';
import ThemeSynthButtonIcon from '../../assets/svg/theme_synth_button.svg';
import ThemeBlueButtonIcon from '../../assets/svg/theme_blue_button.svg';

const Header = props => {
  const { handleThemeSelection, theme, handleAboutPopupVisibility } = props;
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);

  const handleThemeSwitchesVisibility = () => {
    setIsSelectorVisible(!isSelectorVisible);
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
      <div onClick={handleAboutPopupVisibility}>About</div>
    </div>
  );
};

export default Header;
