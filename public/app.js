// @ts-check

import { addFood, addMealEntry, caloriesForDate } from "./model.js";
import { loadState, saveState } from "./storage.js";

const form = document.querySelector("#meal-form");
const todayCalories = document.querySelector("#today-calories");
const entries = document.querySelector("#entries");
const dateInput = document.querySelector("#eaten-at");

let state = loadState();

if (dateInput instanceof HTMLInputElement) {
  dateInput.value = new Date().toISOString().slice(0, 16);
}

render();

if (form instanceof HTMLFormElement) {
  form.addEventListener("submit", handleSubmit);
}

/**
 * Persist a new food and meal entry from the meal form.
 * @param {SubmitEvent} event
 * @returns {void}
 */
function handleSubmit(event) {
  event.preventDefault();

  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const data = new FormData(form);
  const foodId = crypto.randomUUID();
  const entryId = crypto.randomUUID();

  state = addFood(state, {
    id: foodId,
    name: String(data.get("name") ?? ""),
    servingGrams: Number(data.get("servingGrams") ?? 0),
    calories: Number(data.get("calories") ?? 0),
    protein: Number(data.get("protein") ?? 0),
    carbs: Number(data.get("carbs") ?? 0),
    fat: Number(data.get("fat") ?? 0),
  });

  state = addMealEntry(state, {
    id: entryId,
    foodId,
    eatenAt: String(data.get("eatenAt") ?? new Date().toISOString()),
    servings: Number(data.get("servings") ?? 1),
  });

  saveState(state);
  form.reset();

  if (dateInput instanceof HTMLInputElement) {
    dateInput.value = new Date().toISOString().slice(0, 16);
  }

  render();
}

/**
 * Render the current calorie total and entry list.
 * @returns {void}
 */
function render() {
  const today = new Date().toISOString().slice(0, 10);

  if (todayCalories) {
    todayCalories.textContent = Math.round(caloriesForDate(state, today)).toLocaleString();
  }

  if (!entries) {
    return;
  }

  entries.replaceChildren(
    ...Object.values(state.mealEntries)
      .sort(compareEntriesByNewestFirst)
      .map(createEntryItem),
  );
}

/**
 * Sort meal entries from newest to oldest.
 * @returns {number}
 */
function compareEntriesByNewestFirst(a, b) {
  return b.eatenAt.localeCompare(a.eatenAt);
}

/**
 * Create an entry list item.
 * @returns {HTMLLIElement}
 */
function createEntryItem(entry) {
  const food = state.foods[entry.foodId];
  const item = document.createElement("li");

  if (!food) {
    item.textContent = "Unknown food";
    return item;
  }

  item.textContent = `${food.name} — ${Math.round(food.calories * entry.servings)} calories`;
  return item;
}
