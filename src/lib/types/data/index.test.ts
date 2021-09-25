import { testProp, fc } from "jest-fast-check";
import { summonFor } from '@morphic-ts/batteries/lib/summoner-ESBASTJ'

import * as A from 'fp-ts/Array';
import * as s from 'fp-ts/string';
import * as R from 'fp-ts/Record';

import  Data, {filterByProtocols, groupByTabId } from '.';
import { pipe } from "fp-ts/function";
import Protocol from "../protocol";
import { difference } from "fp-ts/lib/ReadonlyRecord";

const { summon: summonESBASTJ } = summonFor({});
const DataArb = summonESBASTJ(Data);
const ProtocolArb = summonESBASTJ(Protocol);

describe("Data", () => {
  testProp("groupByTabId", [fc.array(DataArb.arb)], (dataArr) => {
    const groupedData = groupByTabId(dataArr);

    // Keys are tabIds
    expect(pipe(groupedData, R.keys, A.sort(s.Ord)))
      .toEqual(pipe(dataArr, A.map(x => x.tabId), A.uniq(s.Eq), A.sort(s.Ord)))

    // TODO: Data filed under correct key.
    })


  testProp("filterByProtocols", [fc.array(DataArb.arb), fc.array(ProtocolArb.arb)], (ds, ps) => {
    const a = pipe(
      filterByProtocols(ps)(ds),
      A.map(x => x.protocol),
      A.uniq(Protocol.eq),
      A.sort(s.Ord)
    )

    const b = pipe(
      ps,
      A.uniq(Protocol.eq),
      A.sort(s.Ord)
    )

    /*
     * (A ∪ B = B) => (A <= B)
     * The set of protocols in the filtered array of Data should only contains the
     * protocols contained in the filter.
     */
    expect(A.union(Protocol.eq)(a)(b)).toEqual(b)

  })

})
