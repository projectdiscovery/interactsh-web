import { summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import * as t from 'io-ts';


const { summon } = summonFor<{}>({});

const View = summon(F => F.keysOf({ request: null, response: null, up_and_down: null, side_by_side: null }));
type View = t.TypeOf<typeof View.type>;

export default View;
