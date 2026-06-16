import { expect, test } from "bun:test";
import { addFood, addMealEntry, caloriesForDate, createState, entriesForDate } from "../public/model.js";

/**
 * Verify that food records are stored in normalized state by id.
 * @returns {void}
 */
function testAddFood() {
  const state = addFood(createState(), {
    id: "food_1",
    name: "Eggs",
    servingGrams: 100,
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
  });

  const food = state.foods.food_1;

  expect(food).toBeDefined();
  expect(food?.name).toBe("Eggs");
  expect(food?.calories).toBe(155);
}

/**
 * Verify that entries cannot reference missing foods.
 * @returns {void}
 */
function testUnknownFood() {
  expect(() => addMealEntry(createState(), {
    id: "entry_1",
    foodId: "missing",
    eatenAt: "2026-06-14T12:00",
    servings: 1,
  })).toThrow("Unknown food: missing");
}

/**
 * Verify that calorie totals only include entries on the requested date.
 * @returns {void}
 */
function testCaloriesForDate() {
  let state = addFood(createState(), {
    id: "food_1",
    name: "Rice",
    servingGrams: 100,
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
  });

  state = addMealEntry(state, {
    id: "entry_1",
    foodId: "food_1",
    eatenAt: "2026-06-14T12:00",
    servings: 2,
  });

  state = addMealEntry(state, {
    id: "entry_2",
    foodId: "food_1",
    eatenAt: "2026-06-15T12:00",
    servings: 1,
  });

  expect(entriesForDate(state, "2026-06-14")).toHaveLength(1);
  expect(caloriesForDate(state, "2026-06-14")).toBe(260);
}

test("addFood stores foods by id", testAddFood);
test("addMealEntry rejects unknown foods", testUnknownFood);
test("caloriesForDate totals entries for one date", testCaloriesForDate);