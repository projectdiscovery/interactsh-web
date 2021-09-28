import { summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import * as Eq from "fp-ts/Eq";
import { pipe } from "fp-ts/function";
import * as s from "fp-ts/string";
import * as t from "io-ts";

import { createRecord } from "lib/utils";

const { summon } = summonFor<{}>({});

const eqByView = pipe(
  s.Eq,
  Eq.contramap((p: string) => p)
);

export const protocols = ["dns", "http", "smtp"] as const;

const Protocol = summon((F) =>
  F.keysOf(createRecord(protocols), {
    ShowURI: () => ({
      show: s.toUpperCase,
    }),
    EqURI: () => eqByView,
  })
);

type Protocol = t.TypeOf<typeof Protocol.type>;

export default Protocol;
