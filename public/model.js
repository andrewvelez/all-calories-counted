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

/** @returns {CalorieState} */
export function createState() {
  return {
    version: SCHEMA_VERSION,
    foods: {},
    mealEntries: {},
  };
}

/** @param {string} prefix */
export function createId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

/**
 * @param {CalorieState} state
 * @param {Partial<Food> & Pick<Food, "name">} food
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
 * @param {CalorieState} state
 * @param {Partial<MealEntry> & Pick<MealEntry, "foodId" | "eatenAt">} entry
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
 * @param {CalorieState} state
 * @param {string} date
 */
export function entriesForDate(state, date) {
  return Object.values(state.mealEntries).filter((entry) => entry.eatenAt.slice(0, 10) === date);
}

/**
 * @param {CalorieState} state
 * @param {string} date
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

/** @param {unknown} value */
function numberOrZero(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}