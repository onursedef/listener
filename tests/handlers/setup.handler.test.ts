import {
  describe,
  expect,
  test,
} from "bun:test";

import {
  handleSetup,
  type SetupOptions,
} from "../../src/handlers/setup.handler.ts";
import {
  createTestContext,
  getLastInfoJson,
} from "../helpers/test-context.ts";

function createOptions(
  overrides: Partial<SetupOptions> = {},
): SetupOptions {
  return {
    agents: ["codex"],
    modules: [],
    profiles: [],
    integrations: [],
    yes: false,
    dryRun: false,
    force: false,
    ...overrides,
  };
}

describe("handleSetup", () => {
  test("logs the normalized setup request", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    const options = createOptions({
      scope: "global",
      mode: "copy",
      preset: "full",
      agents: [
        "codex",
        "claude",
      ],
      profiles: ["bun"],
      integrations: ["gitnexus"],
      yes: true,
      dryRun: true,
    });

    await handleSetup(
      context,
      options,
    );

    const result = getLastInfoJson<{
      command: string;
      cwd: string;
      options: SetupOptions;
    }>(logs);

    expect(result.command).toBe("setup");
    expect(result.cwd).toBe(
      "/test/project",
    );
    expect(result.options).toEqual(options);
  });

  test("uses the option cwd when provided", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    await handleSetup(
      context,
      createOptions({
        cwd: "/another/project",
      }),
    );

    const result = getLastInfoJson<{
      cwd: string;
    }>(logs);

    expect(result.cwd).toBe(
      "/another/project",
    );
  });

  test("rejects mode for project scope", async () => {
    expect(
      handleSetup(
        createTestContext().context,
        createOptions({
          scope: "project",
          mode: "copy",
        })
      )
    ).rejects.toThrow(
      "--mode is only valid with --scope global."
    );
  });

  test("rejects modules outside custom preset", async () => {
    expect(
      handleSetup(
        createTestContext().context,
        createOptions({
          preset: "full",
          modules: [
            "supervisor-loop",
          ],
        })
      )
    ).rejects.toThrow(
      "--module can only be used with --preset custom.",
    );
  });

  test("requires scope when yes is enabled", async () => {
    expect(
      handleSetup(
        createTestContext().context,
        createOptions({
          preset: "full",
          yes: true,
        })
      )
    ).rejects.toThrow(
      "--scope is required when using --yes."
    );
  });

  test("requires at least one agent when yes is enabled", async () => {
    expect(
      handleSetup(
        createTestContext().context,
        createOptions({
          scope: "project",
          preset: "full",
          agents: [],
          yes: true,
        })
      )
    ).rejects.toThrow(
      "At least one --agent is required when using --yes."
    );
  });

  test("requires preset when yes is enabled", async () => {
    expect(
      handleSetup(
        createTestContext().context,
        createOptions({
          scope: "project",
          yes: true,
        }),
      ),
    ).rejects.toThrow(
      "--preset is required when using --yes.",
    );
  });

  test("accepts modules with custom preset", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    await handleSetup(
      context,
      createOptions({
        scope: "project",
        preset: "custom",
        modules: [
          "supervisor-loop",
        ],
        yes: true,
      }),
    );

    expect(logs.info).toHaveLength(1);
  });
});
