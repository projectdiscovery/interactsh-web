import * as Eq from "fp-ts/Eq";
import { pipe } from "fp-ts/function";
import * as s from "fp-ts/string";
import { Lens } from "monocle-ts";

export interface ID { id: string };

export const id = Lens.fromProp<ID>()("id").get;
export const eqId = pipe(s.Eq, Eq.contramap(id));