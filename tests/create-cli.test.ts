import {
  CommanderError,
} from "commander";
import {
  mkdtemp,
} from "node:fs/promises";
import {
  tmpdir,
} from "node:os";
import {
  join,
} from "node:path";
import {
  describe,
  expect,
  test,
} from "bun:test";

import {
  createCli,
} from "../src/create-cli.ts";
import {
  createTestContext,
  getLastInfoJson,
} from "./helpers/test-context.ts";
import {
  parseCommand,
  prepareCommand,
} from "./helpers/command.ts";

describe("createCli", () => {
  test("creates the expected command surface", () => {
    const program = createCli({
      version: "0.1.0",
      context:
        createTestContext().context,
    });

    expect(program.name()).toBe(
      "listener",
    );

    expect(
      program.commands.map((command) =>
        command.name(),
      ),
    ).toEqual([
      "setup",
      "sync",
      "check",
      "doctor",
      "explain",
      "projects",
    ]);
  });

  test("displays the configured version", async () => {
    const program = createCli({
      version: "9.8.7",
      context:
        createTestContext().context,
    });

    const output =
      prepareCommand(program);

    let thrownError: unknown;

    try {
      await parseCommand(program, [
        "--version",
      ]);
    } catch (error) {
      thrownError = error;
    }

    expect(
      thrownError,
    ).toBeInstanceOf(CommanderError);

    expect(
      (thrownError as CommanderError)
        .code,
    ).toBe("commander.version");

    expect(
      output.stdout.join(""),
    ).toContain("9.8.7");
  });

  test("routes setup through the root CLI", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "listener-cli-"));
    const {
      context,
      logs,
    } = createTestContext(cwd);

    const program = createCli({
      version: "0.1.0",
      context,
    });

    prepareCommand(program);

    await parseCommand(program, [
      "setup",
      "--scope",
      "project",
      "--agent",
      "codex",
      "--preset",
      "minimal",
      "--yes",
    ]);

    const result = getLastInfoJson<{
      command: string;
    }>(logs);

    expect(result.command).toBe(
      "setup",
    );
  });

  test("includes all commands in help output", () => {
    const program = createCli({
      version: "0.1.0",
      context:
        createTestContext().context,
    });

    const help =
      program.helpInformation();

    expect(help).toContain("setup");
    expect(help).toContain("sync");
    expect(help).toContain("check");
    expect(help).toContain("doctor");
    expect(help).toContain("explain");
    expect(help).toContain("projects");
  });
});
