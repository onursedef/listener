import {
  describe,
  expect,
  test,
} from "bun:test";

import {
  createProjectsCommand,
} from "../../src/commands/projects.command.ts";
import {
  createTestContext,
  getLastInfoJson,
} from "../helpers/test-context.ts";
import {
  parseCommand,
  prepareCommand,
} from "../helpers/command.ts";

describe("createProjectsCommand", () => {
  test("defines projects subcommands", () => {
    const command = createProjectsCommand(
      createTestContext().context,
    );

    expect(command.name()).toBe("projects");

    expect(
      command.commands.map((item) =>
        item.name(),
      ),
    ).toEqual([
      "list",
      "add",
      "remove",
    ]);
  });

  test("parses projects list", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    const command =
      createProjectsCommand(context);

    prepareCommand(command);

    await parseCommand(command, [
      "list",
      "--json",
    ]);

    const result = getLastInfoJson<{
      command: string;
      options: {
        json: boolean;
      };
    }>(logs);

    expect(result).toEqual({
      command: "projects:list",
      options: {
        json: true,
      },
    });
  });

  test("parses projects add", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    const command =
      createProjectsCommand(context);

    prepareCommand(command);

    await parseCommand(command, [
      "add",
      "/projects/example",
      "--name",
      "Example Project",
    ]);

    const result = getLastInfoJson<{
      command: string;
      projectPath: string;
      options: {
        name?: string;
      };
    }>(logs);

    expect(result).toEqual({
      command: "projects:add",
      projectPath: "/projects/example",
      options: {
        name: "Example Project",
      },
    });
  });

  test("parses projects remove", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    const command =
      createProjectsCommand(context);

    prepareCommand(command);

    await parseCommand(command, [
      "remove",
      "/projects/example",
      "--yes",
    ]);

    const result = getLastInfoJson<{
      command: string;
      projectPath: string;
      options: {
        yes: boolean;
      };
    }>(logs);

    expect(result).toEqual({
      command: "projects:remove",
      projectPath: "/projects/example",
      options: {
        yes: true,
      },
    });
  });

  test("supports rm alias", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    const command =
      createProjectsCommand(context);

    prepareCommand(command);

    await parseCommand(command, [
      "rm",
      "/projects/example",
      "--yes",
    ]);

    const result = getLastInfoJson<{
      command: string;
    }>(logs);

    expect(result.command).toBe(
      "projects:remove",
    );
  });
});
