import React, { useState } from "react";
import "./styles.scss";
import downloadData from "js-file-download";
import { ReactComponent as ThemeDarkButtonIcon } from "../../assets/svg/theme_dark_button.svg";
import { ReactComponent as ThemeSynthButtonIcon } from "../../assets/svg/theme_synth_button.svg";
import { ReactComponent as ThemeBlueButtonIcon } from "../../assets/svg/theme_blue_button.svg";
import { ReactComponent as DownloadIcon } from "../../assets/svg/download.svg";
import { ReactComponent as DeleteIcon } from "../../assets/svg/delete.svg";
import { ReactComponent as SwitchIcon } from "../../assets/svg/switch.svg";
import dateTransform from "../common/dateTransform";
import CustomHost from "../customHost";

type Theme = "dark" | "synth" | "blue";

interface HeaderP {
  handleThemeSelection: (t: Theme) => void;
  theme: Theme;
  handleAboutPopupVisibility: () => void;
}

import * as R from "fp-ts/Record";
import * as O from "fp-ts/Option";
import * as J from "fp-ts/Json";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

const getData = (key: string) =>
  pipe(
    O.tryCatch(() => localStorage.getItem(key)),
    O.chain(O.fromNullable)
  );

const Header = ({
  handleThemeSelection,
  theme,
  handleAboutPopupVisibility,
}: HeaderP) => {
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
    const values = pipe(
      R.mapWithIndex((key) => ({ key, data: getData(key) }))(localStorage),
      R.filterMap((x) => x.data),
      J.stringify,
      E.getOrElse(() => "An error occured") // TODO: Handle error case.
    );

    downloadData(
      values,
      dateTransform(Date.now(), "yyyy-mm-dd_hh:mm") + ".json"
    );
  };

  const isCustomHost = host != "interact.sh";

  return (
    <div id="header" className="header">
      <div>interact.sh</div>
      <div onClick={handleThemeSwitchesVisibility}>
        <div
          className={`${isSelectorVisible && "__selector_visible"} ${
            theme == "dark" && "__selected"
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
          className={isCustomHost ? "custom_host_active" : undefined}
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
