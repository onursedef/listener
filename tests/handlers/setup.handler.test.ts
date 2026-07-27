import {
  describe,
  expect,
  test,
} from "bun:test";
import {
  mkdtemp,
  readFile,
} from "node:fs/promises";
import {
  tmpdir,
} from "node:os";
import {
  join,
} from "node:path";

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
    const cwd = await mkdtemp(join(tmpdir(), "listener-custom-"));
    const {
      context,
      logs,
    } = createTestContext(cwd);

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
    expect(await readFile(
      join(cwd, ".agents/skills/supervisor-loop/SKILL.md"),
      "utf8",
    )).toContain("name: supervisor-loop");
    expect(await readFile(join(cwd, "AGENTS.md"), "utf8"))
      .toContain("Mandatory enforcement");
  });

  test("minimal excludes full workflow modules", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "listener-minimal-"));

    await handleSetup(
      createTestContext(cwd).context,
      createOptions({
        scope: "project",
        preset: "minimal",
        yes: true,
      }),
    );

    const agents = await readFile(join(cwd, "AGENTS.md"), "utf8");
    expect(agents).toContain(".agents/rules/core.md");
    expect(agents).not.toContain("red-team-review");
  });

  test("full writes rules, hooks, skills, and plugin policy", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "listener-full-"));

    await handleSetup(
      createTestContext(cwd).context,
      createOptions({
        scope: "project",
        preset: "full",
        integrations: ["gitnexus"],
        yes: true,
      }),
    );

    const agents = await readFile(join(cwd, "AGENTS.md"), "utf8");
    expect(agents).toContain(".agents/rules/implementation.md");
    expect(agents).toContain(".agents/hooks/pre-task.md");
    expect(agents).toContain(".agents/skills/red-team-review/SKILL.md");
    expect(agents).toContain(".agents/plugins/tool-plugins.md");
    expect(agents).toContain("Do not use GitNexus unless user selected it");
  });

  test("dry run reports files without writing", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "listener-dry-"));
    const { context, logs } = createTestContext(cwd);

    await handleSetup(context, createOptions({
      scope: "project",
      preset: "full",
      yes: true,
      dryRun: true,
    }));

    const result = getLastInfoJson<{ generation: { files: string[] } }>(logs);
    expect(result.generation.files.length).toBeGreaterThan(4);
    expect(readFile(join(cwd, "AGENTS.md"), "utf8")).rejects.toThrow();
  });

  test("rejects unknown custom modules", async () => {
    expect(handleSetup(
      createTestContext().context,
      createOptions({
        scope: "project",
        preset: "custom",
        modules: ["missing-module"],
        yes: true,
      }),
    )).rejects.toThrow("Unknown policy module: missing-module.");
  });
});
