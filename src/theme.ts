import * as f from "fp-ts-std/Function";
import * as ss from "fp-ts-std/String";
import * as S from "fp-ts/string";
import * as T from "fp-ts/Tuple";
import { Show } from "fp-ts/Show";
import { flow, pipe } from "fp-ts/function";

import { summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import * as t from "io-ts";
import { match } from "ts-pattern";

const capitalize = flow(
  ss.splitAt(1),
  T.bimap(S.toLowerCase, S.toUpperCase), // snd, first
  pipe(
    // ((T, T) -> T) -> ([T, T] -> T)
    S.Semigroup.concat,
    f.curry2,
    f.uncurry2
  )
);

const { summon } = summonFor<{}>({});

export const ThemeName = summon((F) =>
  F.keysOf({ dark: null, synth: null, blue: null })
);
export type ThemeName = t.TypeOf<typeof ThemeName.type>;

export interface Theme {
  background: string;
  secondaryBackground: string;
}

export const showThemeName: Show<ThemeName> = { show: capitalize };

export const darkTheme: Theme = {
  background: "#03030d",
  secondaryBackground: "#101624",
};
export const synthTheme: Theme = {
  background: "#240d2c",
  secondaryBackground: "#15071a",
};
export const blueTheme: Theme = {
  background: "#001729",
  secondaryBackground: "#001123",
};

export const getTheme = (theme: ThemeName): Theme =>
  match(theme)
    .with("blue", () => blueTheme)
    .with("dark", () => darkTheme)
    .with("synth", () => synthTheme)
    .exhaustive();
