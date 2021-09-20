import * as _ from ".";
import { defaultStoredData } from ".";

describe("localStorage", () => {
  it("writeStoredData", () => {
    jest.spyOn(window.localStorage.__proto__, "setItem");
    _.writeStoredData(defaultStoredData);

    // Tests that localStorage.setItem is called with the correct data.
    expect(localStorage.setItem).toHaveBeenCalledWith("app", JSON.stringify(defaultStoredData));
  });

  it("getStorageData", () => {
    _.writeStoredData(defaultStoredData); // Prep stored data.
    const data = _.getStoredData();

    jest.spyOn(window.localStorage.__proto__, "getItem");
    _.getStoredData();

    // Tests that localStorage.getItem is called with the right key.
    expect(localStorage.getItem).toHaveBeenCalledWith("app");

    // Test that data is retreived and decoded correctly.
    expect(data).toEqual(defaultStoredData);
  });
});
