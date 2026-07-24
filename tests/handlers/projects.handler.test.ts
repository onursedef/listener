import {
  describe,
  expect,
  test,
} from "bun:test";

import {
  handleProjectsAdd,
  handleProjectsList,
  handleProjectsRemove,
} from "../../src/handlers/projects.handler.ts";
import {
  createTestContext,
  getLastInfoJson,
} from "../helpers/test-context.ts";

describe("project handlers", () => {
  test("logs list requests", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    await handleProjectsList(context, {
      json: true,
    });

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

  test("logs add requests", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    await handleProjectsAdd(
      context,
      "/projects/example",
      {
        name: "Example",
      },
    );

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
        name: "Example",
      },
    });
  });

  test("logs remove requests", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    await handleProjectsRemove(
      context,
      "/projects/example",
      {
        yes: true,
      },
    );

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
});
