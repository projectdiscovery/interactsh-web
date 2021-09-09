import React, { useState } from "react";

import { matchConfig } from "@babakness/exhaustive-type-checking";
import format from "date-fns/format";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as J from "fp-ts/Json";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import downloadData from "js-file-download";

import { ReactComponent as DeleteIcon } from "assets/svg/delete.svg";
import { ReactComponent as DownloadIcon } from "assets/svg/download.svg";
import { ReactComponent as SwitchIcon } from "assets/svg/switch.svg";
import { ReactComponent as ThemeBlueButtonIcon } from "assets/svg/theme_blue_button.svg";
import { ReactComponent as ThemeDarkButtonIcon } from "assets/svg/theme_dark_button.svg";
import { ReactComponent as ThemeSynthButtonIcon } from "assets/svg/theme_synth_button.svg";
import ResetPopup from "components/resetPopup";
import { ThemeName, showThemeName } from "theme";
import "./styles.scss";

import CustomHost from "../customHost";

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
  host: string;
  handleAboutPopupVisibility: () => void;
  handleReset: () => void;
}

const Header = ({
  handleThemeSelection,
  theme,
  host,
  handleReset,
  handleAboutPopupVisibility,
}: HeaderP) => {
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);
  const [isCustomHostDialogVisible, setIsCustomHostDialogVisible] = useState(false);
  const [isResetPopupDialog, setIsResetPopupDialog] = useState(false);

  const handleThemeSwitchesVisibility = () => {
    setIsSelectorVisible(!isSelectorVisible);
  };
  const handleCustomHostDialogVisibility = () => {
    setIsCustomHostDialogVisible(!isCustomHostDialogVisible);
  };
  const handleResetPopupDialogVisibility = () => {
    setIsResetPopupDialog(!isResetPopupDialog);
  };

  const handleDataExport = () => {
    const values = pipe(
      R.mapWithIndex((key) => ({ key, data: getData(key) }))(localStorage),
      R.filterMap((x) => x.data),
      J.stringify,
      E.getOrElse(() => "An error occured") // TODO: Handle error case.
    );

    const fileName = `${format(Date.now(), "yyyy-mm-dd_hh:mm")}.json`;
    downloadData(values, fileName);
  };

  const isCustomHost = host !== "interact.sh";
  const setTheme = (t: ThemeName) => () => handleThemeSelection(t);

  const isThemeSelected = (t: ThemeName) => t === theme;
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
      <div>interact.sh</div>
      <button type="button" onClick={handleThemeSwitchesVisibility}>
        <ThemeButton theme="dark" />
        <ThemeButton theme="synth" />
        <ThemeButton theme="blue" />
      </button>
      <div className="links">
        <button
          type="button"
          title="Switch host"
          className={isCustomHost ? "custom_host_active" : undefined}
          onClick={handleCustomHostDialogVisibility}
        >
          <SwitchIcon />
          {isCustomHost ? host : "Custom Host"}
        </button>
        <button type="button" title="Reset data" onClick={handleReset}>
          <DeleteIcon />
          Reset
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
      {isCustomHostDialogVisible && (
        <ResetPopup handleCloseDialog={handleResetPopupDialogVisibility} />
      )}
    </div>
  );
};

export default Header;
