// @ts-check

export const SCHEMA_VERSION = 1;

/**
 * @typedef {object} Food
 * @property {string} id
 * @property {string} name
 * @property {number} servingGrams
 * @property {number} calories
 * @property {number} protein
 * @property {number} carbs
 * @property {number} fat
 */

/**
 * @typedef {object} MealEntry
 * @property {string} id
 * @property {string} foodId
 * @property {string} eatenAt
 * @property {number} servings
 */

/**
 * @typedef {object} CalorieState
 * @property {number} version
 * @property {Record<string, Food>} foods
 * @property {Record<string, MealEntry>} mealEntries
 */

/**
 * Create an empty calorie log state.
 * @returns {CalorieState}
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
 * @returns {string}
 */
export function createId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

/**
 * Add or replace a normalized food record.
 * 
 * @returns {CalorieState}
 */
export function addFood(state, food) {
  const id = food.id ?? createId("food");

  return {
    ...state,
    foods: {
      ...state.foods,
      [id]: {
        id,
        name: food.name.trim(),
        servingGrams: numberOrZero(food.servingGrams),
        calories: numberOrZero(food.calories),
        protein: numberOrZero(food.protein),
        carbs: numberOrZero(food.carbs),
        fat: numberOrZero(food.fat),
      },
    },
  };
}

/**
 * Add a normalized meal entry that references an existing food.
 * 
 * @returns {CalorieState}
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
 * @param {CalorieState} state
 * @param {string} date
 * @returns {MealEntry[]}
 */
export function entriesForDate(state, date) {
  return Object.values(state.mealEntries).filter((entry) => entry.eatenAt.slice(0, 10) === date);
}

/**
 * Total calories for entries on a YYYY-MM-DD date.
 * @param {CalorieState} state
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