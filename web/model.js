/**
 * model.js - contains model shape helpers
 * @auth Andrew Velez 2026
 * Executes client-side in the browser.
 */

export const SCHEMA_VERSION = 1;

/**
 * Create an empty calorie log state.
 */
export function createState() {
  return {
    version: SCHEMA_VERSION,
    foods: {},
    mealEntries: {},
  };
}
