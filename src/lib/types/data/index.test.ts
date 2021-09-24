import { testProp, fc } from "jest-fast-check";
import { summonFor } from '@morphic-ts/batteries/lib/summoner-ESBASTJ'

import * as A from 'fp-ts/Array';
import * as s from 'fp-ts/string';
import * as R from 'fp-ts/Record';

import  Data, {groupByTabId } from '.';
import { pipe } from "fp-ts/function";

const { summon: summonESBASTJ } = summonFor({});
const DataArb = summonESBASTJ(Data);

describe("Data", () => {
  testProp("groupByTabId", [fc.array(DataArb.arb)], (dataArr) => {
    const groupedData = groupByTabId(dataArr);

    // Keys are tabIds
    expect(pipe(groupedData, R.keys, A.sort(s.Ord)))
      .toEqual(pipe(dataArr, A.map(x => x.tabId), A.uniq(s.Eq), A.sort(s.Ord)))
    })

   // TODO: Data filed under correct key.
})
