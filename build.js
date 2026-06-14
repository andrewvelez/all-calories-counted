#! /usr/bin/env bun
// @ts-check
/**
 * build.js - project commands for All Calories Counted
 * by: Andrew Velez 2026
 */

import { $ } from "bun";
import { mkdir, rm } from "node:fs/promises";
import { parseArgs } from "node:util";

const OUTDIR = "./dist";
const OUTFILE = `${OUTDIR}/all-calories-counted`;
const ENTRYPOINT = "./src/core.js";

/** @param {string[]} commandNames */
function errorUsage(commandNames) {
  console.error(`Usage: bun ./build.js <${commandNames.join("|")}>`);
  process.exit(2);
}

async function clean() {
  await rm(OUTDIR, { recursive: true, force: true });
}

function typecheck() {
  return $`bun x tsc -p tsconfig.json --noEmit`;
}

function test() {
  return $`bun test`;
}

async function build() {
  await clean();
  await typecheck();
  await test();
  await mkdir(OUTDIR, { recursive: true });
  await $`bun build --compile --outfile ${OUTFILE} ${ENTRYPOINT}`;
}

const commandHandlers = Object.freeze({
  build,
  clean,
  test,
  typecheck,
});

async function main() {
  const commandNames = Object.keys(commandHandlers);

  const { positionals } = parseArgs({
    args: Bun.argv.slice(2),
    allowPositionals: true,
  });

  const commandName = positionals[0];

  if (typeof commandName !== "string" || !Object.hasOwn(commandHandlers, commandName)) {
    errorUsage(commandNames);
  }

  await commandHandlers[/** @type {keyof typeof commandHandlers} */ (commandName)]();
}

await main();