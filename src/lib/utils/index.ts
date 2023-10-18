import * as f from "fp-ts-std/Function";
import * as ss from "fp-ts-std/String";
import { pipe, flow } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as RA from "fp-ts/ReadonlyArray";
import * as R from "fp-ts/Record";
import * as S from "fp-ts/string";
import * as T from "fp-ts/Tuple";



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


/**
 * trueKeys : Record string boolean -> string[]
 *
 * Returns a list of "true" keys in a record
 */
 export const trueKeys = <K extends string>(r: Record<K, boolean>) => pipe(
  r,
  R.map<boolean, O.Option<boolean>>(O.fromPredicate(x =>  !!x)),
  R.compact, // Removes false keys
  R.keys,    // Converts to array of keys.
  x => x as K[]
)

export const capitalize = flow(
  ss.splitAt(1),
  T.bimap(S.toLowerCase, S.toUpperCase), // snd, first
  pipe(
    // ((T, T) -> T) -> ([T, T] -> T)
    S.Semigroup.concat,
    f.curry2,
    f.uncurry2
  )
);

export const generateRandomString = (length: number, lettersOnly: boolean = false) => {
  let characters = '';
  if (lettersOnly) {
    characters = 'abcdefghijklmnopqrstuvwxyz';
  } else {
    characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  }
  let result = '';
  for (let i = 0; i < length; i+=1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};