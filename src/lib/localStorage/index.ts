import * as IOE from "fp-ts/IOEither";
import { flow, pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { parseO, stringifyO, unJSONString } from "fp-ts-std/JSON";

import { summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import { getItem, setItem } from "fp-ts-local-storage";
import * as t from "io-ts";
import { curry2 } from "fp-ts-std/Function";

import { ThemeName } from "theme";
import View from "lib/types/view";
import Tab from "lib/types/tab";


const { summon } = summonFor<{}>({});

const decodeJSONStr = <A>(decoder: t.Decoder<unknown, A>) =>
  flow(parseO, O.chain(flow(decoder.decode, O.fromEither)));

// objToStr : any -> Option<string>
const objToStr = flow(stringifyO, O.map(unJSONString));

/*
 * Safe way of accessing and decoding data from localstorage at a key.
 * TODO: Update to use Either instead of Option.
 */
export const getStoredData = <A>(key: string, decoder: t.Decoder<unknown, A>) =>
  pipe(
    IOE.tryCatch(getItem(key), E.toError),
    IOE.map(IOE.fromOption(() => new Error("Error retreiving object at key"))),
    IOE.flatten,
    IOE.map(
      flow(
        decodeJSONStr(decoder),
        IOE.fromOption(() => new Error("Error decoding object"))
      )
    ),
    IOE.flatten
  );

/*
 * Safe way of updating localstorage
 * TODO: Update to use Either instead of Option.
 */
export const writeStoredData = (key: string) =>
  flow(
    objToStr, // Option<string>
    O.map(flow(curry2(setItem)(key), (x) => IOE.tryCatch(x, E.toError))),
    IOE.fromOption(() => new Error("Error updating localstorage")),
    IOE.flatten
  );

// Data structure of localStorage

export const StoredData = summon((F) => F.interface({
  view: View(F),
  notes: F.array(F.string()),
  increment: F.number(),
  correlationId: F.string(),
  theme: ThemeName(F),
  data: F.array(F.string()),
  tabs: F.array(Tab(F)),

  publicKey: F.string(),
  privateKey: F.string(),
  secretKey: F.string(),
  aesKey: F.string(),
}, "Person"));
