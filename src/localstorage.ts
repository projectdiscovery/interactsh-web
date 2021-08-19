import  * as IOE from 'fp-ts/IOEither'
import { flow, pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { parseO } from 'fp-ts-std/JSON';

import { getItem } from 'fp-ts-local-storage'
import * as t from 'io-ts';

const decodeJSONStr = <A>(decoder: t.Decoder<unknown, A>) =>
  flow(
    parseO,
    O.chain(flow( decoder.decode, O.fromEither)),
  )

/*
 * Safe way of accessing and decoding data from localstorage at a key.
 */
export const getStoredData = <A>(key: string, decoder: t.Decoder<unknown, A>) => pipe(
  IOE.tryCatch(getItem(key), E.toError),
  IOE.map(IOE.fromOption(() => new Error("Error retreiving object at key"))),
  IOE.flatten,
  IOE.map(flow(
    decodeJSONStr(decoder),
    IOE.fromOption(() => new Error("Error decoding object"))
  )),
  IOE.flatten
)
