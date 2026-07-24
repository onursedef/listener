import {
  describe,
  expect,
  test,
} from "bun:test";

import {
  main,
} from "../src/cli.ts";
import {
  ExitCode,
} from "../src/core/exit-codes.ts";
import {
  createTestContext,
  getLastInfoJson,
} from "./helpers/test-context.ts";

describe("main", () => {
  test("returns success for a valid command", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    const exitCode = await main({
      argv: [
        "setup",
        "--scope",
        "project",
        "--agent",
        "codex",
        "--preset",
        "minimal",
        "--yes",
      ],
      context,
      version: "0.1.0",
      writeOut() {},
      writeErr() {},
    });

    expect(exitCode).toBe(
      ExitCode.SUCCESS,
    );

    const result = getLastInfoJson<{
      command: string;
    }>(logs);

    expect(result.command).toBe(
      "setup",
    );
  });

  test("returns success for help", async () => {
    const stdout: string[] = [];

    const exitCode = await main({
      argv: ["--help"],
      context:
        createTestContext().context,
      version: "0.1.0",
      writeOut(value) {
        stdout.push(value);
      },
      writeErr() {},
    });

    expect(exitCode).toBe(
      ExitCode.SUCCESS,
    );

    expect(
      stdout.join(""),
    ).toContain("Usage: listener");
  });

  test("returns success for version", async () => {
    const stdout: string[] = [];

    const exitCode = await main({
      argv: ["--version"],
      context:
        createTestContext().context,
      version: "7.6.5",
      writeOut(value) {
        stdout.push(value);
      },
      writeErr() {},
    });

    expect(exitCode).toBe(
      ExitCode.SUCCESS,
    );

    expect(
      stdout.join(""),
    ).toContain("7.6.5");
  });

  test("returns invalid arguments for an unknown command", async () => {
    const stderr: string[] = [];

    const exitCode = await main({
      argv: [
        "unknown-command",
      ],
      context:
        createTestContext().context,
      version: "0.1.0",
      writeOut() {},
      writeErr(value) {
        stderr.push(value);
      },
    });

    expect(exitCode).toBe(
      ExitCode.INVALID_ARGUMENTS,
    );

    expect(
      stderr.join(""),
    ).toContain(
      "unknown command",
    );
  });

  test("returns handler error exit code", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    const exitCode = await main({
      argv: [
        "setup",
        "--scope",
        "project",
        "--mode",
        "copy",
        "--agent",
        "codex",
        "--preset",
        "full",
      ],
      context,
      version: "0.1.0",
      writeOut() {},
      writeErr() {},
    });

    expect(exitCode).toBe(
      ExitCode.INVALID_ARGUMENTS,
    );

    expect(logs.error).toContain(
      "--mode is only valid with --scope global.",
    );
  });

  test("returns invalid arguments when non-interactive setup is incomplete", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    const exitCode = await main({
      argv: [
        "setup",
        "--yes",
      ],
      context,
      version: "0.1.0",
      writeOut() {},
      writeErr() {},
    });

    expect(exitCode).toBe(
      ExitCode.INVALID_ARGUMENTS,
    );

    expect(logs.error).toContain(
      "--scope is required when using --yes.",
    );
  });

  test("returns success when debug is supplied with a valid command", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    const exitCode = await main({
      argv: [
        "--debug",
        "check",
        "--strict",
      ],
      context,
      version: "0.1.0",
      writeOut() {},
      writeErr() {},
    });

    expect(exitCode).toBe(
      ExitCode.SUCCESS,
    );

    const result = getLastInfoJson<{
      command: string;
      options: {
        strict: boolean;
      };
    }>(logs);

    expect(result.command).toBe(
      "check",
    );

    expect(
      result.options.strict,
    ).toBe(true);
  });
});
