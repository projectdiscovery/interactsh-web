import { AsOpaque, summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import type { AType, EType } from "@morphic-ts/summoners";
import * as l from "fp-ts-local-storage";
import { parseO } from "fp-ts-std/JSON";
import { flow, pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as RA from "fp-ts/ReadonlyArray";

import Filter from "lib/types/filter";
import Tab from "lib/types/tab";
import View from "lib/types/view";
import { ThemeName } from "theme";

const { summon } = summonFor<{}>({});

export const defaultStoredData: StoredData = {
  theme: "synth",
  privateKey: "",
  publicKey: "",
  correlationId: "",
  secretKey: "",
  data: [],
  aesKey: "",
  notes: [],
  view: "up_and_down",
  increment: 1,
  host: "interact.sh",
  tabs: [],
  token: "",
  selectedTab: {
    "unique-id": "",
    correlationId: "",
    name: "1",
    url: "",
    note: "",
  },
  filter: {
    dns: true,
    http: true,
    smtp: true,
  },
};

export const writeStoredData = (data: StoredData) =>
  O.tryCatch(l.setItem("app", JSON.stringify(data)));

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
export const Data = AsOpaque<DataRaw, Data>()(Data_);

// Data structure of localStorage
export const StoredData_ = summon((F) =>
  F.interface(
    {
      view: View(F),
      increment: F.number(),
      correlationId: F.string(),
      theme: ThemeName(F),

      publicKey: F.string(),
      privateKey: F.string(),
      secretKey: F.string(),

      host: F.string(),
      token: F.string(),
      selectedTab: Tab(F),
      tabs: F.array(Tab(F)),
      data: F.array(Data(F)),
      notes: F.array(F.string()),
      aesKey: F.string(),
      filter: Filter(F),
    },
    "StoredData"
  )
);

export interface StoredData extends AType<typeof StoredData_> {}
export interface StoredDataRaw extends EType<typeof StoredData_> {}
export const StoredData = AsOpaque<StoredDataRaw, StoredData>()(StoredData_);

export const getStoredData = () =>
  pipe(
    l.getItem("app"),
    O.tryCatch,
    O.flatten,
    O.chain(parseO),
    O.chain(flow(StoredData.type.decode, O.fromEither)),
    O.getOrElseW(() => StoredData.build(defaultStoredData))
  );
