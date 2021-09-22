import { summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import * as t from "io-ts";

import Protocal from 'lib/types/protocal';

const { summon } = summonFor<{}>({});

const Filter = summon((F) =>
  F.record(Protocal(F), F.boolean())
);

type Filter = t.TypeOf<typeof Filter.type>;

export default Filter;
