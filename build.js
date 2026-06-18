#! /usr/bin/env bun
// Executes server-side under Bun as a local build script.
/**
 * build.js - package.json script commands
 * by: Andrew Velez 2026
 */

import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { parseArgs } from "node:util";

const OUTDIR = "./dist";
const OUTFILE = `${OUTDIR}/all-calories-counted`;
const ENTRYPOINT = "./src/core.js";
const CLIENT_BUILDS = [
  { entrypoint: "./web/app.js", outfile: "./public/app.js" },
  { entrypoint: "./web/main.js", outfile: "./public/main.js" },
  { entrypoint: "./web/model.js", outfile: "./public/model.js" },
  { entrypoint: "./web/storage.js", outfile: "./public/storage.js" },
  { entrypoint: "./web/sw.js", outfile: "./public/sw.js" },
];

const scriptCommands = Object.freeze({
  BUILD: "build",
  CLEAN: "clean",
  DEV: "dev",
  PROD: "prod",
  TEST: "test",
});

/**
 * Start the app with Bun's watch mode
 */
function dev() {
  test();
  run("bun", ["--watch", ENTRYPOINT], { ...process.env, APP_ENV: "dev" });
}

/**
 * Print usage and exit with an error.
 * @param {string} commandNames
 */
function errorUsage(commandNames) {
  console.error(`Usage: bun ./build.js <${commandNames.replaceAll(" ", "|")}>`);
  process.exit(2);
}

/**
 * Run a command and exit if it fails.
 * @param {string} command
 * @param {string[]} args
 */
function run(command, args, env = process.env) {
  const result = spawnSync(command, args, { env, stdio: "inherit" });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.signal) {
    console.error(`${command} exited with signal ${result.signal}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

/**
 * Remove generated output.
 */
function clean() {
  rmSync(OUTDIR, { recursive: true, force: true });
}

/**
 * Run the JSDoc/JavaScript typecheck.
 */
function typecheck() {
  run("bun", ["x", "tsc", "-p", "tsconfig.json", "--noEmit"]);
}

/**
 * Emit browser JavaScript without source-only comments.
 */
function buildClient() {
  for (const clientBuild of CLIENT_BUILDS) {
    run("bun", [
      "build",
      "--target=browser",
      "--format=esm",
      `--outfile=${clientBuild.outfile}`,
      "--no-bundle",
      "--minify-whitespace",
      clientBuild.entrypoint,
    ]);
  }
}

/**
 * Run unit tests.
 */
function test() {
  buildClient();
  typecheck();
  run("bun", ["test"]);
}

/**
 * Build a standalone Bun executable.
 */
function prod() {
  clean();
  test();
  mkdirSync(OUTDIR, { recursive: true });
  run("bun", ["build", "--compile", "--outfile", OUTFILE, ENTRYPOINT]);
}

const build = dev;

/**
 * Parse and validate the requested command.
 */
function parseCommandName() {
  const commandNames = Object.values(scriptCommands).join(" ");

  const { positionals } = parseArgs({
    args: Bun.argv.slice(2),
    allowPositionals: true,
  });

  const commandName = positionals[0] ?? "";

  if (typeof commandName !== "string" || !` ${commandNames} `.includes(` ${commandName} `)) {
    errorUsage(commandNames);
  }

  return commandName;
}

/**
 * Run the selected command.
 */
function main() {
  const commandName = parseCommandName();

  switch (commandName) {
    case scriptCommands.BUILD:
      build();
      break;
    case scriptCommands.CLEAN:
      clean();
      break;
    case scriptCommands.DEV:
      dev();
      break;
    case scriptCommands.PROD:
      prod();
      break;
    case scriptCommands.TEST:
      test();
      break;
  }
}

main();
