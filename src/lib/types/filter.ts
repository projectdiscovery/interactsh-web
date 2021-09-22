import { summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import * as t from "io-ts";

import { createRecord } from "./data";

const { summon } = summonFor<{}>({});

const keys = ["dns", "http", "smtp"] as const;

const Filter = summon((F) => F.record(F.keysOf(createRecord(keys)), F.boolean()));

type Filter = t.TypeOf<typeof Filter.type>;

export default Filter;
