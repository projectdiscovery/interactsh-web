import React, { useState } from "react";
import "./styles.scss";
import { ReactComponent as ThemeDarkButtonIcon } from "../../assets/svg/theme_dark_button.svg";
import { ReactComponent as ThemeSynthButtonIcon } from "../../assets/svg/theme_synth_button.svg";
import { ReactComponent as ThemeBlueButtonIcon } from "../../assets/svg/theme_blue_button.svg";
import { ReactComponent as DownloadIcon } from "../../assets/svg/download.svg";
import { ReactComponent as DeleteIcon } from "../../assets/svg/delete.svg";
import { ReactComponent as SwitchIcon } from "../../assets/svg/switch.svg";
import dateTransform from "../common/dateTransform";
import CustomHost from "../customHost";

const Header = (props) => {
  const { handleThemeSelection, theme, handleAboutPopupVisibility } = props;
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);
  const [isCustomHostDialogVisible, setIsCustomHostDialogVisible] =
    useState(false);
  const host = localStorage.getItem("host");

  const handleThemeSwitchesVisibility = () => {
    setIsSelectorVisible(!isSelectorVisible);
  };
  const handleCustomHostDialogVisibility = () => {
    setIsCustomHostDialogVisible(!isCustomHostDialogVisible);
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleDataExport = () => {
    // var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(localStorage.data));
    // var downloadAnchorElement = document.getElementById('download_anchor_element');
    // downloadAnchorElement.setAttribute('href', dataStr);
    // downloadAnchorElement.setAttribute('download', 'data.json');
    // downloadAnchorElement.click();

    const values = [];
    const keys = Object.keys(localStorage);
    let i = keys.length;

    while (i--) {
      values.push(
        JSON.stringify({
          key: keys[i],
          data: localStorage.getItem(keys[i]),
        })
      );
    }

    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      values
    )}`;
    const downloadAnchorElement = document.createElement("a");
    downloadAnchorElement.setAttribute("href", dataStr);
    downloadAnchorElement.setAttribute(
      "download",
      `${dateTransform(Date.now(), "yyyy-mm-dd_hh:mm")}.json`
    );
    document.body.appendChild(downloadAnchorElement); // required for firefox
    downloadAnchorElement.click();
    downloadAnchorElement.remove();
  };

  return (
    <div id="header" className="header">
      <div>interact.sh</div>
      <div onClick={handleThemeSwitchesVisibility}>
        <div
          className={`${isSelectorVisible && "__selector_visible"} ${
            theme == "dark" && ".__selected"
          } ${!isSelectorVisible && "__without_bg"}`}
          onClick={() => handleThemeSelection("dark")}
        >
          <ThemeDarkButtonIcon />
          Dark
        </div>
        <div
          className={`${isSelectorVisible && "__selector_visible"} ${
            theme == "synth" && "__selected"
          } ${!isSelectorVisible && "__without_bg"}`}
          onClick={() => handleThemeSelection("synth")}
        >
          <ThemeSynthButtonIcon />
          Synth
        </div>
        <div
          className={`${isSelectorVisible && "__selector_visible"} ${
            theme == "blue" && "__selected"
          } ${!isSelectorVisible && "__without_bg"}`}
          onClick={() => handleThemeSelection("blue")}
        >
          <ThemeBlueButtonIcon />
          Blue
        </div>
      </div>
      <div className="links">
        <div
          title="Switch host"
          className={host != "interact.sh" && "custom_host_active"}
          onClick={handleCustomHostDialogVisibility}
        >
          <SwitchIcon />
          {host == "interact.sh" ? "Custom Host" : host}
        </div>
        <div title="Reset data" onClick={handleReset}>
          <DeleteIcon />
          Reset
        </div>
        <div title="Export" onClick={handleDataExport}>
          <DownloadIcon />
          Export
        </div>
        <div className="vertical_bar" />
        <a href="/#/terms">Terms</a>
        <div onClick={handleAboutPopupVisibility}>About</div>
      </div>
      {isCustomHostDialogVisible && (
        <CustomHost handleCloseDialog={handleCustomHostDialogVisibility} />
      )}
    </div>
  );
};

export default Header;
