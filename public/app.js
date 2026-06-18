// @ts-check

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
 * Handle the meal form without applying calorie log behavior.
 * @param {SubmitEvent} event
 * @returns {void}
 */
function handleSubmit(event) {
  event.preventDefault();

  if (!(form instanceof HTMLFormElement)) {
    return;
  }

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
  if (todayCalories) {
    todayCalories.textContent = "0";
  }

  if (!entries) {
    return;
  }

  entries.replaceChildren();
}
