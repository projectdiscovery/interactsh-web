import React, { useState } from "react";
import downloadData from "js-file-download";
import format from "date-fns/format";

import { ThemeName, showThemeName } from "theme";
import CustomHost from "../customHost";
import "./styles.scss";

import { ReactComponent as ThemeDarkButtonIcon } from "assets/svg/theme_dark_button.svg";
import { ReactComponent as ThemeSynthButtonIcon } from "assets/svg/theme_synth_button.svg";
import { ReactComponent as ThemeBlueButtonIcon } from "assets/svg/theme_blue_button.svg";
import { ReactComponent as DownloadIcon } from "assets/svg/download.svg";
import { ReactComponent as DeleteIcon } from "assets/svg/delete.svg";
import { ReactComponent as SwitchIcon } from "assets/svg/switch.svg";

import * as R from "fp-ts/Record";
import * as O from "fp-ts/Option";
import * as J from "fp-ts/Json";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

import { matchConfig } from "@babakness/exhaustive-type-checking";

const themeIcon = matchConfig<ThemeName>()({
  dark: () => <ThemeDarkButtonIcon />,
  synth: () => <ThemeSynthButtonIcon />,
  blue: () => <ThemeBlueButtonIcon />,
});

const getData = (key: string) =>
  pipe(
    O.tryCatch(() => localStorage.getItem(key)),
    O.chain(O.fromNullable)
  );

interface HeaderP {
  handleThemeSelection: (t: ThemeName) => void;
  theme: ThemeName;
  handleAboutPopupVisibility: () => void;
}

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

    const fileName = format(Date.now(), "yyyy-mm-dd_hh:mm") + ".json";
    downloadData(values, fileName);
  };

  const isCustomHost = host != "interact.sh";
  const setTheme = (t: ThemeName) => () => handleThemeSelection(t);

  const isThemeSelected = (t: ThemeName) => t === theme;
  const themeButtonStyle = (t: ThemeName) =>
    `${isSelectorVisible && "__selector_visible"} ${
      isThemeSelected(t) && "__selected"
    } ${!isSelectorVisible && "__without_bg"}`;

  const ThemeButton = ({ theme }: { theme: ThemeName }) => (
    <div className={themeButtonStyle(theme)} onClick={setTheme(theme)}>
      {themeIcon(theme)}
      {showThemeName.show(theme)}
    </div>
  );

  return (
    <div id="header" className="header">
      <div>interact.sh</div>
      <div onClick={handleThemeSwitchesVisibility}>
        <ThemeButton theme="dark" />
        <ThemeButton theme="synth" />
        <ThemeButton theme="blue" />
      </div>
      <div className="links">
        <div
          title="Switch host"
          className={isCustomHost ? "custom_host_active" : undefined}
          onClick={handleCustomHostDialogVisibility}
        >
          <SwitchIcon />
          {isCustomHost ? host : "Custom Host"}
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
