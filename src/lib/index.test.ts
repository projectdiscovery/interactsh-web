import isURL from 'validator/lib/isURL';

import { generateUrl } from '.'

describe("utils", () => {
  test("generateUrl", () => {
    const ret = generateUrl("id", 1, "google.com").url;
    expect(isURL(ret)).toBeTruthy()
  })
})
