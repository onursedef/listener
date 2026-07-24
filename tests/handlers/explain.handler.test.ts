import {
  describe,
  expect,
  test,
} from "bun:test";

import {
  handleExplain,
  type ExplainOptions,
} from "../../src/handlers/explain.handler.ts";
import {
  createTestContext,
  getLastInfoJson,
} from "../helpers/test-context.ts";

describe("handleExplain", () => {
  test("logs the path and normalized options", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    const options: ExplainOptions = {
      agent: "codex",
      cwd: "/explain/project",
      json: true,
    };

    await handleExplain(
      context,
      "src/index.ts",
      options,
    );

    const result = getLastInfoJson<{
      command: string;
      cwd: string;
      targetPath: string;
      options: ExplainOptions;
    }>(logs);

    expect(result).toEqual({
      command: "explain",
      cwd: "/explain/project",
      targetPath: "src/index.ts",
      options,
    });
  });

  test("supports an omitted target path", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    await handleExplain(
      context,
      undefined,
      {
        json: false,
      },
    );

    const result = getLastInfoJson<{
      targetPath?: string;
    }>(logs);

    expect(
      result.targetPath,
    ).toBeUndefined();
  });
});
