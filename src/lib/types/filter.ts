import { summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import * as t from "io-ts";

import Protocol from "lib/types/protocol";

const { summon } = summonFor<{}>({});

const Filter = summon((F) => F.record(Protocol(F), F.boolean()));

type Filter = t.TypeOf<typeof Filter.type>;

export const defaultFilter: Filter = {
  dns: true,
  http: true,
  smtp: true,
};

export default Filter;
