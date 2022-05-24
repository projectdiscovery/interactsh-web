import React, { useState } from "react";

import { NotificationOutlined } from "@ant-design/icons";
import { matchConfig } from "@babakness/exhaustive-type-checking";

import { ReactComponent as DeleteIcon } from "assets/svg/delete.svg";
import { ReactComponent as DownloadIcon } from "assets/svg/download.svg";
import { ReactComponent as SwitchIcon } from "assets/svg/switch.svg";
import { ReactComponent as ThemeBlueButtonIcon } from "assets/svg/theme_blue_button.svg";
import { ReactComponent as ThemeDarkButtonIcon } from "assets/svg/theme_dark_button.svg";
import { ReactComponent as ThemeSynthButtonIcon } from "assets/svg/theme_synth_button.svg";
import NotificationsPopup from "components/notificationsPopup";
import ResetPopup from "components/resetPopup";
import { handleDataExport } from "lib";
import { ThemeName, showThemeName } from "theme";
import "./styles.scss";

import CustomHost from "../customHost";

const themeIcon = matchConfig<ThemeName>()({
  dark: () => <ThemeDarkButtonIcon />,
  synth: () => <ThemeSynthButtonIcon />,
  blue: () => <ThemeBlueButtonIcon />,
});

interface HeaderP {
  handleThemeSelection: (t: ThemeName) => void;
  theme: ThemeName;
  host: string;
  handleAboutPopupVisibility: () => void;
  isResetPopupDialogVisible: boolean;
  isNotificationsDialogVisible: boolean;
  isCustomHostDialogVisible: boolean;
  handleResetPopupDialogVisibility: () => void;
  handleNotificationsDialogVisibility: () => void;
  handleCustomHostDialogVisibility: () => void;
}

const Header = ({
  handleThemeSelection,
  theme,
  host,
  handleAboutPopupVisibility,
  isResetPopupDialogVisible,
  isNotificationsDialogVisible,
  handleResetPopupDialogVisibility,
  handleNotificationsDialogVisibility,
  isCustomHostDialogVisible,
  handleCustomHostDialogVisibility,
}: HeaderP) => {
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);

  const handleThemeSwitchesVisibility = () => {
    setIsSelectorVisible(!isSelectorVisible);
  };

  const setTheme = (t: ThemeName) => () => handleThemeSelection(t);

  const isThemeSelected = (t: ThemeName) => ThemeName.eq.equals(t, theme);
  const themeButtonStyle = (t: ThemeName) =>
    `${isSelectorVisible && "__selector_visible"} ${isThemeSelected(t) && "__selected"} ${
      !isSelectorVisible && "__without_bg"
    }`;

  const ThemeButton = ({ theme: t }: { theme: ThemeName }) => (
    <button type="button" className={themeButtonStyle(t)} onClick={setTheme(t)}>
      {themeIcon(t)}
      {showThemeName.show(t)}
    </button>
  );

  return (
    <div id="header" className="header">
      <div>interactsh</div>
      <button type="button" onClick={handleThemeSwitchesVisibility}>
        <ThemeButton theme="dark" />
        <ThemeButton theme="synth" />
        <ThemeButton theme="blue" />
      </button>
      <div className="links">
        <button
          type="button"
          title="Switch host"
          className="custom_host_active"
          onClick={handleCustomHostDialogVisibility}
        >
          <SwitchIcon />
          {host}
        </button>
        <button type="button" title="Reset data" onClick={handleResetPopupDialogVisibility}>
          <DeleteIcon />
          Reset
        </button>
        <button type="button" title="Notifications" onClick={handleNotificationsDialogVisibility}>
          <NotificationOutlined style={{marginRight: '10px'}} />
          Notifications
        </button>
        <button type="button" title="Export" onClick={handleDataExport}>
          <DownloadIcon />
          Export
        </button>
        <div className="vertical_bar" />
        <a href="/#/terms">Terms</a>
        <button type="button" onClick={handleAboutPopupVisibility}>
          About
        </button>
      </div>
      {isCustomHostDialogVisible && (
        <CustomHost handleCloseDialog={handleCustomHostDialogVisibility} />
      )}
      {isResetPopupDialogVisible && (
        <ResetPopup handleCloseDialog={handleResetPopupDialogVisibility} />
      )}
      {isNotificationsDialogVisible && (
        <NotificationsPopup handleCloseDialog={handleNotificationsDialogVisibility} />
      )}
    </div>
  );
};

export default Header;
