/**
 * model.js - contains all models
 * @auth Andrew Velez 2026
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

/**
 * Create a namespaced id.
 * @param {string} prefix
    },
  };
}

/**
 * Add a normalized meal entry that references an existing food.
 */
export function addMealEntry(state, entry) {
  if (!state.foods[entry.foodId]) {
    throw new Error(`Unknown food: ${entry.foodId}`);
  }

  const id = entry.id ?? createId("entry");

  return {
    ...state,
    mealEntries: {
      ...state.mealEntries,
      [id]: {
        id,
        foodId: entry.foodId,
        eatenAt: entry.eatenAt,
        servings: numberOrZero(entry.servings),
      },
    },
  };
}

/**
 * Return entries whose eatenAt value starts with the provided YYYY-MM-DD date.
 * @param {string} date
 */
export function entriesForDate(state, date) {
  return Object.values(state.mealEntries).filter((entry) => entry.eatenAt.slice(0, 10) === date);
}

/**
 * Total calories for entries on a YYYY-MM-DD date.
 * @param {string} date
 * @returns {number}
 */
export function caloriesForDate(state, date) {
  return entriesForDate(state, date).reduce((total, entry) => {
    const food = state.foods[entry.foodId];

    if (!food) {
      return total;
    }

    return total + food.calories * entry.servings;
  }, 0);
}

/**
 * Coerce a value to a finite number, using zero when coercion fails.
 * @param {unknown} value
 * @returns {number}
 */
function numberOrZero(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}
