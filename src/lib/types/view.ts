import { summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import * as Eq from "fp-ts/Eq";
import { pipe } from "fp-ts/function";
import * as s from "fp-ts/string";
import * as t from "io-ts";

const { summon } = summonFor<{}>({});

const eqByView = pipe(
  s.Eq,
  Eq.contramap((v: string) => v)
);

const View = summon((F) =>
  F.keysOf(
    { request: null, response: null, up_and_down: null, side_by_side: null },
    { EqURI: () => eqByView }
  )
);
type View = t.TypeOf<typeof View.type>;

export default View;
