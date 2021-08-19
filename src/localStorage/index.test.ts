import * as t from 'io-ts';
import * as E from 'fp-ts/Either';

import * as _ from '.';

describe("localStorage", () => {
  it("writeStoredData", () => {
    jest.spyOn(window.localStorage.__proto__, 'setItem');
    _.writeStoredData("key")(({ a: 1 }))()

    // Tests that localStorage.setItem is called with the correct data.
    expect(localStorage.setItem).toHaveBeenCalledWith("key", JSON.stringify({ a: 1 }));
  })

  it("getStorageData", () => {
    const decoder = t.interface({ a: t.number }).asDecoder();

    _.writeStoredData("key")(({ a: 1 }))() // Prep stored data.
    const data = _.getStoredData("key", decoder)();

    jest.spyOn(window.localStorage.__proto__, 'getItem');
    _.getStoredData("key", decoder)();

    // Tests that localStorage.getItem is called with the right key.
    expect(localStorage.getItem).toHaveBeenCalledWith("key");

    // Test that data is retreived and decoded correctly.
    expect(data).toEqual(E.right({ a: 1 }))
  })
})
