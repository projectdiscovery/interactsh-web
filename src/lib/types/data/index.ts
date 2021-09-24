import { summonFor, AsOpaque } from "@morphic-ts/batteries/lib/summoner-ESBST";
import type { AType, EType } from "@morphic-ts/summoners";

import Protocol from 'lib/types/protocol';
import { createRecord } from "lib/utils";


const { summon } = summonFor<{}>({});

// Must include "as const" to capture type information.
const dnsRecordTypes = ["A", "AAAA", "ALIAS", "CNAME", "MX", "NS", "PTR", "SOA", "TXT"] as const;

export const Data_ = summon((F) =>
  F.intersection(
    // Required
    F.interface(
      {
        id: F.string(),
        "full-id": F.string(),
        protocol: Protocol(F),
        "raw-request": F.string(),
        "remote-address": F.string(),
        timestamp: F.string(), // TODO: Convert to ISODate
        "unique-id": F.string(),
      },
      ""
    ),
    // Optional
    F.partial(
      {
        "raw-response": F.string(),
        "q-type": F.keysOf(createRecord(dnsRecordTypes)),
        "smtp-from": F.string(),
      },
      ""
    )
  )("Data")
);
export interface Data extends AType<typeof Data_> {}
export interface DataRaw extends EType<typeof Data_> {}
export default AsOpaque<DataRaw, Data>()(Data_);
