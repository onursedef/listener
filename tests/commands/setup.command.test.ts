import {
  describe,
  expect,
  test,
} from "bun:test";

import type {
  SetupOptions,
} from "../../src/handlers/setup.handler.ts";
import {
  createSetupCommand,
} from "../../src/commands/setup.command.ts";
import {
  InvalidArgumentsError,
} from "../../src/core/errors.ts";
import {
  createTestContext,
  getLastInfoJson,
} from "../helpers/test-context.ts";
import {
  parseCommand,
  prepareCommand,
} from "../helpers/command.ts";

describe("createSetupCommand", () => {
  test("defines the setup command", () => {
    const command = createSetupCommand(
      createTestContext().context,
    );

    expect(command.name()).toBe("setup");

    expect(
      command.description(),
    ).toContain("Configure agent instructions");
  });

  test("parses all setup options", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    const command =
      createSetupCommand(context);

    prepareCommand(command);

    await parseCommand(command, [
      "--scope",
      "global",
      "--mode",
      "copy",
      "--agent",
      "codex",
      "--agent",
      "codex",
      "--agent",
      "claude",
      "--preset",
      "custom",
      "--module",
      "supervisor-loop",
      "--profile",
      "bun",
      "--integration",
      "gitnexus",
      "--cwd",
      "/custom/project",
      "--yes",
      "--dry-run",
      "--force",
    ]);

    const result = getLastInfoJson<{
      command: string;
      cwd: string;
      options: SetupOptions;
    }>(logs);

    expect(result.command).toBe("setup");
    expect(result.cwd).toBe(
      "/custom/project",
    );

    expect(result.options).toEqual({
      scope: "global",
      mode: "copy",
      agents: [
        "codex",
        "claude",
      ],
      preset: "custom",
      modules: [
        "supervisor-loop",
      ],
      profiles: ["bun"],
      integrations: ["gitnexus"],
      cwd: "/custom/project",
      yes: true,
      dryRun: true,
      force: true,
    });
  });

  test("rejects project mode with consumption mode", async () => {
    const command =
      createSetupCommand(
        createTestContext().context,
      );

    prepareCommand(command);

    expect(
          parseCommand(command, [
              "--scope",
              "project",
              "--mode",
              "copy",
              "--agent",
              "codex",
              "--preset",
              "full",
          ])
      ).rejects.toBeInstanceOf(
          InvalidArgumentsError
      );
  });

  test(
    "includes setup examples in help",
    () => {
      const command =
        createSetupCommand(
          createTestContext().context,
        );

      const output =
        prepareCommand(command);

      command.outputHelp();

      const help =
        output.stdout.join("");

      expect(help).toContain(
        "Examples:",
      );

      expect(help).toContain(
        "listener setup --scope project",
      );
    },
  );
});
