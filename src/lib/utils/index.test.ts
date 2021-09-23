import { createRecord, trueKeys } from '.';

describe("utils", () => {
  test("createRecord", () => {
    expect(createRecord(["a", "b"])).toEqual({ a: null, b: null });
  });

  test("trueKeys", () => {
    expect(trueKeys({ a: true, b: false, c: true })).toEqual(["a", "c"]);
  });

})
