#!/usr/bin/env bun

import {
  CommanderError,
} from "commander";
import packageJson from "../package.json";

import {
  createCommandContext,
  type CommandContext,
} from "./core/command-context.ts";
import {
  ExitCode,
  type ExitCodeValue,
} from "./core/exit-codes.ts";
import {
  isAgentKitError,
} from "./core/errors.ts";
import {
  createCli,
} from "./create-cli.ts";

export interface MainOptions {
  argv?: string[];
  context?: CommandContext;
  version?: string;
  writeOut?: (
    value: string,
  ) => void;
  writeErr?: (
    value: string,
  ) => void;
}

export async function main(
  options: MainOptions = {},
): Promise<ExitCodeValue> {
  const usesInjectedArguments =
    options.argv !== undefined;

  const argv =
    options.argv ??
    process.argv;

  const debug =
    argv.includes("--debug");

  const context =
    options.context ??
    createCommandContext({
      debug,
    });

  const program = createCli({
    version:
      options.version ??
      packageJson.version,
    context,
  });

  program
    .option(
      "--debug",
      "Print diagnostic information.",
      false,
    )
    .exitOverride()
    .configureOutput({
      writeOut:
        options.writeOut ??
        ((value) => {
          process.stdout.write(value);
        }),

      writeErr:
        options.writeErr ??
        ((value) => {
          process.stderr.write(value);
        }),
    });

  try {
    await program.parseAsync(
      argv,
      usesInjectedArguments
        ? {
            from: "user",
          }
        : {
            from: "node",
          },
    );

    return ExitCode.SUCCESS;
  } catch (error) {
    if (
      error instanceof CommanderError
    ) {
      if (
        error.code ===
          "commander.helpDisplayed" ||
        error.code ===
          "commander.version"
      ) {
        return ExitCode.SUCCESS;
      }

      return ExitCode.INVALID_ARGUMENTS;
    }

    if (isAgentKitError(error)) {
      context.logger.error(
        error.message,
      );

      if (
        debug &&
        error.details !== undefined
      ) {
        context.logger.debug(
          JSON.stringify(
            error.details,
            null,
            2,
          ),
        );
      }

      return error.exitCode;
    }

    const message =
      error instanceof Error
        ? error.message
        : String(error);

    context.logger.error(
      `Unexpected error: ${message}`,
    );

    if (
      debug &&
      error instanceof Error
    ) {
      context.logger.debug(
        error.stack ??
          error.message,
      );
    }

    return ExitCode.UNEXPECTED_ERROR;
  }
}

if (import.meta.main) {
  process.exitCode =
    await main();
}
