import * as f from "fp-ts-std/Function";
import * as ss from "fp-ts-std/String";
import * as S from "fp-ts/string";
import * as t from "fp-ts/Tuple";

import { Show } from "fp-ts/Show";
import { flow, pipe } from "fp-ts/function";

import { match } from "ts-pattern";

const capitalize = flow(
  ss.splitAt(1),
  t.bimap(S.toLowerCase, S.toUpperCase), // snd, first
  pipe(
    // ((T, T) -> T) -> ([T, T] -> T)
    S.Semigroup.concat,
    f.curry2,
    f.uncurry2
  )
);

export type ThemeName = "dark" | "synth" | "blue";

export interface Theme {
  background: string;
  secondaryBackground: string;
}

export const showThemeName: Show<ThemeName> = { show: capitalize };

export const darkTheme = {
  background: "#03030d",
  secondaryBackground: "#101624",
};
export const synthTheme = {
  background: "#240d2c",
  secondaryBackground: "#15071a",
};
export const blueTheme = {
  background: "#001729",
  secondaryBackground: "#001123",
};

export const getTheme = (theme: ThemeName) =>
  match(theme)
    .with("blue", () => blueTheme)
    .with("dark", () => darkTheme)
    .with("synth", () => synthTheme)
    .exhaustive();
