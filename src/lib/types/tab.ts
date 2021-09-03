import { summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import * as t from "io-ts";

const { summon } = summonFor<{}>({});

const Tab = summon((F) =>
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

type Tab = t.TypeOf<typeof Tab.type>;

export default Tab;
