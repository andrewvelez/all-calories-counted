// @ts-check
// Executes client-side in the browser.

import { createState } from "./model.js";

const STORAGE_KEY = "all-calories-counted:v1";

/**
 * Load calorie state from browser-like storage.
 * @param {Storage} [storage]
 */
export function loadState(storage = localStorage) {
  const saved = storage.getItem(STORAGE_KEY);

  if (!saved) {
    return createState();
  }

  try {
    const parsed = JSON.parse(saved);

    if (parsed?.version !== 1 || !parsed.foods || !parsed.mealEntries) {
      return createState();
    }

    return parsed;
  } catch (error) {
    console.warn("Could not read saved calorie data.", error);
    return createState();
  }
}

/**
 * Save calorie state to browser-like storage.
 * @param {Storage} [storage]
 * @returns {void}
 */
export function saveState(state, storage = localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}
