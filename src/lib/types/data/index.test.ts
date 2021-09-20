import  * as _ from '.'

describe("data", () => {
  test("createRecord", () => {
    expect(_.createRecord(["a", "b"])).toEqual({ a: null, b: null });
  });
})
