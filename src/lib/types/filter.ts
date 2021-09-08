import { summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import * as t from "io-ts";

const { summon } = summonFor<{}>({});

const Filter = summon((F) =>
  F.interface(
    {
      dns: F.boolean(),
      http: F.boolean(),
      smtp: F.boolean(),
      // [key: F.string()]: F.boolean()
    },
    "Filter"
  )
);

type Filter = t.TypeOf<typeof Filter.type>;

export default Filter;
