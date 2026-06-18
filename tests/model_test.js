import { expect, test } from "bun:test";
import { createState } from "../public/model.js";

/**
 * Verify that the empty state shape is available.
 * @returns {void}
 */
function testCreateState() {
  const state = createState();

  expect(state).toEqual({
    version: 1,
    foods: {},
    mealEntries: {},
  });
}

test("createState returns an empty state", testCreateState);
