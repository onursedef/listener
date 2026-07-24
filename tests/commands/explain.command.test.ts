import {
  describe,
  expect,
  test,
} from "bun:test";

import {
  createExplainCommand,
} from "../../src/commands/explain.command.ts";
import {
  createTestContext,
  getLastInfoJson,
} from "../helpers/test-context.ts";
import {
  parseCommand,
  prepareCommand,
} from "../helpers/command.ts";

describe("createExplainCommand", () => {
  test("defines the explain command", () => {
    const command =
      createExplainCommand(
        createTestContext().context,
      );

    expect(command.name()).toBe(
      "explain",
    );
  });

  test("parses path and options", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    const command =
      createExplainCommand(context);

    prepareCommand(command);

    await parseCommand(command, [
      "src/index.ts",
      "--agent",
      "codex",
      "--cwd",
      "/explain/project",
      "--json",
    ]);

    const result = getLastInfoJson<{
      targetPath: string;
      options: {
        agent: string;
        cwd: string;
        json: boolean;
      };
    }>(logs);

    expect(result.targetPath).toBe(
      "src/index.ts",
    );

    expect(result.options).toEqual({
      agent: "codex",
      cwd: "/explain/project",
      json: true,
    });
  });

  test("supports omitted path", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    const command =
      createExplainCommand(context);

    prepareCommand(command);

    await parseCommand(command, []);

    const result = getLastInfoJson<{
      targetPath?: string;
    }>(logs);

    expect(
      result.targetPath,
    ).toBeUndefined();
  });
});
