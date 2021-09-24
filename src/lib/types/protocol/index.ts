import { summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import * as s from 'fp-ts/string';
import * as t from 'io-ts';

import { createRecord } from "lib/utils";


const { summon } = summonFor<{}>({});

export const protocols = ["dns", "http", "https", "arp", "smtp"] as const;

const Protocol = summon((F) =>
  F.keysOf(createRecord(protocols), { ShowURI: () => ({
    show: s.toUpperCase
  }) }))

type Protocol = t.TypeOf<typeof Protocol.type>;

export default Protocol;
