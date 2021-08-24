import * as t from "io-ts";
import * as E from "fp-ts/Either";

import * as _ from ".";

const testData = 12;
const decoder = t.number.asDecoder();

describe("localStorage", () => {
  it("writeStoredData", () => {
    jest.spyOn(window.localStorage.__proto__, "setItem");
    _.writeStoredData("key")(testData)();

    // Tests that localStorage.setItem is called with the correct data.
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "key",
      JSON.stringify(testData)
    );
  });

  it("getStorageData", () => {
    _.writeStoredData("key")(testData)(); // Prep stored data.
    const data = _.getStoredData("key", decoder)();

    jest.spyOn(window.localStorage.__proto__, "getItem");
    _.getStoredData("key", decoder)();

    // Tests that localStorage.getItem is called with the right key.
    expect(localStorage.getItem).toHaveBeenCalledWith("key");

    // Test that data is retreived and decoded correctly.
    expect(data).toEqual(E.right(testData));
  });

  it("createRecord", () => {
    expect(_.createRecord(["a", "b"])).toEqual({ a: null, b: null })
  })
});
