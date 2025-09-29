import * as l from "fp-ts-local-storage";
import { parseO } from "fp-ts-std/JSON";
import { flow, pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";

import { defaultFilter } from "lib/types/filter";
import StoredDataS, { StoredData } from "lib/types/storedData";

export const defaultStoredData: StoredData = {
  theme: "synth",
  privateKey: "",
  publicKey: "",
  correlationId: "",
  correlationIdLength: process.env.REACT_APP_CIDL ? +process.env.REACT_APP_CIDL : 20,
  correlationIdNonceLength: process.env.REACT_APP_CIDN ? +process.env.REACT_APP_CIDN : 13,  
  responseExport: false,
  secretKey: "",
  data: [],
  aesKey: "",
  notes: [],
  view: "up_and_down",
  increment: 1,
  host: process.env?.REACT_APP_HOST || "oast.fun",
  tabs: [],
  token: process.env?.REACT_APP_TOKEN || "",
  telegram: {
    enabled: false,
    botToken: '',
    chatId: '',
  },
  slack: {
    enabled: false,
    hookKey: '',
    channel: '',
  },
  discord: {
    enabled: false,
    webhook: '',
    channel: '',
  },
  selectedTab: {
    "unique-id": "",
    correlationId: "",
    name: "1",
    url: "",
    note: "",
  },
  filter: defaultFilter,
};

export const writeStoredData = (data: StoredData) =>
  O.tryCatch(l.setItem("app", JSON.stringify(data)));

export const getStoredData = () =>
  pipe(
    l.getItem("app"),
    O.tryCatch,
    O.flatten,
    O.chain(parseO),
    O.chain(flow(StoredDataS.type.decode, O.fromEither)),
    O.getOrElseW(() => StoredDataS.build(defaultStoredData))
  );
