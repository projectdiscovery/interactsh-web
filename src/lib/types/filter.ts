import { summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import * as s from "fp-ts/string";
import * as t from "io-ts";

// import Protocol from "lib/types/protocol";
import { createRecord } from "lib/utils";

const { summon } = summonFor<{}>({});
export const protocols = ["dns", "http", "smtp"] as const;
const Filter = summon(
  (F) =>
    F.record(
      F.keysOf(createRecord(protocols), {
        ShowURI: () => ({
          show: s.toUpperCase,
        }),
      }),
      F.boolean()
    )
  // F.record(protocols(F), F.boolean())
);

type Filter = t.TypeOf<typeof Filter.type>;

export const defaultFilter: Filter = {
  dns: true,
  http: true,
  smtp: true,
};

export default Filter;
