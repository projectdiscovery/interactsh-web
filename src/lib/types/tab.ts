import { summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import * as t from 'io-ts';


const { summon } = summonFor<{}>({});

const Tab = summon((F) => F.interface({
  correlationId: F.string(),
  id: F.number(),
  name: F.string(),
  note: F.string(),
  url: F.string()
}, "StoredData"))

type Tab = t.TypeOf<typeof Tab.type>;

export default Tab;
