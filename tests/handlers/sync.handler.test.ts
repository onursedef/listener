import {
  describe,
  expect,
  test,
} from "bun:test";

import {
  handleSync,
  type SyncOptions,
} from "../../src/handlers/sync.handler.ts";
import {
  createTestContext,
  getLastInfoJson,
} from "../helpers/test-context.ts";

describe("handleSync", () => {
  test("logs the normalized sync request", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    const options: SyncOptions = {
      agents: [
        "codex",
        "claude",
      ],
      cwd: "/sync/project",
      all: true,
      dryRun: true,
      force: true,
      yes: true,
    };

    await handleSync(
      context,
      options,
    );

    const result = getLastInfoJson<{
      command: string;
      cwd: string;
      options: SyncOptions;
    }>(logs);

    expect(result).toEqual({
      command: "sync",
      cwd: "/sync/project",
      options,
    });
  });

  test("uses context cwd by default", async () => {
    const {
      context,
      logs,
    } = createTestContext(
      "/context/project",
    );

    await handleSync(
      context,
      {
        agents: [],
        all: false,
        dryRun: false,
        force: false,
        yes: false,
      },
    );

    const result = getLastInfoJson<{
      cwd: string;
    }>(logs);

    expect(result.cwd).toBe(
      "/context/project",
    );
  });
});
