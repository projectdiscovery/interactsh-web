import React, { useState } from "react";
import downloadData from "js-file-download";
import format from "date-fns/format";

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
import * as f from "fp-ts-std/Function";
import { flow, pipe } from "fp-ts/function";
import * as ss from "fp-ts-std/String";
import * as S from "fp-ts/string";
import * as t from "fp-ts/Tuple";
import { Show } from "fp-ts/Show";

import { matchConfig } from "@babakness/exhaustive-type-checking";

const capitalize = flow(
  ss.splitAt(1),
  t.bimap(S.toLowerCase, S.toUpperCase), // snd, first
  pipe(
    S.Semigroup.concat,
    f.curry2,
    f.uncurry2 // ((T, T) -> T) -> ([T, T] -> T)
  )
);

type Theme = "dark" | "synth" | "blue";

const showTheme: Show<Theme> = { show: capitalize };

const themeIcon = matchConfig<Theme>()({
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
  handleThemeSelection: (t: Theme) => void;
  theme: Theme;
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
  const setTheme = (t: Theme) => () => handleThemeSelection(t);

  const isThemeSelected = (t: Theme) => t === theme;
  const themeButtonStyle = (t: Theme) =>
    `${isSelectorVisible && "__selector_visible"} ${
      isThemeSelected(t) && "__selected"
    } ${!isSelectorVisible && "__without_bg"}`;

  const ThemeButton = ({ theme }: { theme: Theme }) => (
    <div className={themeButtonStyle(theme)} onClick={setTheme(theme)}>
      {themeIcon(theme)}
      {showTheme.show(theme)}
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
