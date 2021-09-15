import { AsOpaque, summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import type { AType, EType } from "@morphic-ts/summoners";
import * as Eq from 'fp-ts/Eq';
import { pipe } from "fp-ts/function";
import * as s from 'fp-ts/string';

const eqByUniqueId = pipe(
  s.Eq,
  Eq.contramap((t: { "unique-id": string }) => t["unique-id"])
);


const { summon } = summonFor<{}>({});

const Tab_ = summon((F) =>
  F.interface(
    {
      correlationId: F.string(),
      "unique-id": F.string(),
      name: F.string(),
      note: F.string(),
      url: F.string(),
    },
    "Tab",
    { EqURI: () => eqByUniqueId }
  )
);

export interface Tab extends AType<typeof Tab_> {}
export interface TabRaw extends EType<typeof Tab_> {}
export const Tab = AsOpaque<TabRaw, Tab>()(Tab_);

export default Tab;
