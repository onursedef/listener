import {
  describe,
  expect,
  test,
} from "bun:test";

import {
  createSyncCommand,
} from "../../src/commands/sync.command.ts";
import {
  createTestContext,
  getLastInfoJson,
} from "../helpers/test-context.ts";
import {
  parseCommand,
  prepareCommand,
} from "../helpers/command.ts";

describe("createSyncCommand", () => {
  test("defines the sync command", () => {
    const command = createSyncCommand(
      createTestContext().context,
    );

    expect(command.name()).toBe("sync");
  });

  test("parses sync options", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    const command =
      createSyncCommand(context);

    prepareCommand(command);

    await parseCommand(command, [
      "--agent",
      "codex",
      "--agent",
      "codex",
      "--agent",
      "claude",
      "--cwd",
      "/sync/project",
      "--all",
      "--dry-run",
      "--force",
      "--yes",
    ]);

    const result = getLastInfoJson<{
      options: {
        agents: string[];
        cwd: string;
        all: boolean;
        dryRun: boolean;
        force: boolean;
        yes: boolean;
      };
    }>(logs);

    expect(result.options).toEqual({
      agents: [
        "codex",
        "claude",
      ],
      cwd: "/sync/project",
      all: true,
      dryRun: true,
      force: true,
      yes: true,
    });
  });
});