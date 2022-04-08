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
  secretKey: "",
  data: [],
  aesKey: "",
  notes: [],
  view: "up_and_down",
  increment: 1,
  host: "interact.sh",
  tabs: [],
  token: "",
  telegram: {
    botToken: '5151651978:AAF9lh1LnfjCt3RfnLeAolF1kVLgvwwR6rA',
    chatId: '265643328',
  },
  slack: {
    hookKey: 'https://hooks.slack.com/services/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',
    channel: 'testing',
    botName: '',
  },
  discord: {
    webhook: 'https://discord.com/api/webhooks/773062411691098123/O2M-g9lVlJlNQFLIkyp-mozXp5oN-SyCsD1xEelZHwBP-9sqAnNlhjbr4wtnECifoRJH'
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
