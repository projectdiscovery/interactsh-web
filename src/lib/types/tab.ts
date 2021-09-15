import { AsOpaque, summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import type { AType, EType } from "@morphic-ts/summoners";


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
    "Tab"
  )
);

export interface Tab extends AType<typeof Tab_> {}
export interface TabRaw extends EType<typeof Tab_> {}
export const Tab = AsOpaque<TabRaw, Tab>()(Tab_);

export default Tab;
