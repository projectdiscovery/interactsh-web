import { summonFor, AsOpaque } from "@morphic-ts/batteries/lib/summoner-ESBST";
import type { AType, EType } from "@morphic-ts/summoners";
import { pipe } from "fp-ts/function";
import * as RA from "fp-ts/ReadonlyArray";

const { summon } = summonFor<{}>({});

export type TupleToRecord<X extends readonly string[]> = {
  [K in X[number]]: null;
};
/*
 * @example
 *
 * createRecord(
 *  ["dns", "http", "https"] as const // Must include "as const"
 * )
 */
export const createRecord = <X extends readonly string[]>(arr: X): TupleToRecord<X> =>
  pipe(
    arr,
    RA.reduce({ [arr[0]]: null }, (a, b) => ({ ...a, [b]: null })),
    (x) => x as TupleToRecord<X>
  );

// Must include "as const" to capture type information.
const protocols = ["dns", "http", "https", "arp", "smtp"] as const;

const dnsRecordTypes = ["A", "AAAA", "ALIAS", "CNAME", "MX", "NS", "PTR", "SOA", "TXT"] as const;

export const Data_ = summon((F) =>
  F.intersection(
    // Required
    F.interface(
      {
        id: F.string(),
        "full-id": F.string(),
        protocol: F.keysOf(createRecord(protocols)),
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
