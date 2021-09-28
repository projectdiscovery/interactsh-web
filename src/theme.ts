import { summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import * as Eq from "fp-ts/Eq";
import { pipe } from "fp-ts/function";
import { Show } from "fp-ts/Show";
import * as s from "fp-ts/string";
import * as t from "io-ts";
import { match } from "ts-pattern";


import { capitalize } from "lib/utils";

const { summon } = summonFor<{}>({});

const eqByName = pipe(
  s.Eq,
  Eq.contramap((v: string) => v)
);

export const ThemeName = summon((F) => F.keysOf({ dark: null, synth: null, blue: null },{ EqURI: () => eqByName }));
export type ThemeName = t.TypeOf<typeof ThemeName.type>;

export interface Theme {
  background: string;
  secondaryBackground: string;
  lightBackground: string;
}

export const showThemeName: Show<ThemeName> = { show: capitalize };

export const darkTheme: Theme = {
  background: "#03030d",
  secondaryBackground: "#101624",
  lightBackground: "#192030",
};
export const synthTheme: Theme = {
  background: "#240d2c",
  secondaryBackground: "#15071a",
  lightBackground: "#341D3B",
};
export const blueTheme: Theme = {
  background: "#001729",
  secondaryBackground: "#001123",
  lightBackground: "#192030",
};

export const getTheme = (theme: ThemeName): Theme =>
  match(theme)
    .with("blue", () => blueTheme)
    .with("dark", () => darkTheme)
    .with("synth", () => synthTheme)
    .exhaustive();
