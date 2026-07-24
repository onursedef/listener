import {
  describe,
  expect,
  test,
} from "bun:test";

import {
  handleCheck,
  type CheckOptions,
} from "../../src/handlers/check.handler.ts";
import {
  createTestContext,
  getLastInfoJson,
} from "../helpers/test-context.ts";

describe("handleCheck", () => {
  test("logs the normalized check request", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    const options: CheckOptions = {
      agents: ["codex"],
      cwd: "/checked/project",
      all: true,
      strict: true,
    };

    await handleCheck(
      context,
      options,
    );

    const result = getLastInfoJson<{
      command: string;
      cwd: string;
      options: CheckOptions;
    }>(logs);

    expect(result).toEqual({
      command: "check",
      cwd: "/checked/project",
      options,
    });
  });
});
