import {
  describe,
  expect,
  test,
} from "bun:test";

import {
  createDoctorCommand,
} from "../../src/commands/doctor.command.ts";
import {
  createTestContext,
  getLastInfoJson,
} from "../helpers/test-context.ts";
import {
  parseCommand,
  prepareCommand,
} from "../helpers/command.ts";

describe("createDoctorCommand", () => {
  test("defines the doctor command", () => {
    const command =
      createDoctorCommand(
        createTestContext().context,
      );

    expect(command.name()).toBe(
      "doctor",
    );
  });

  test("parses doctor options", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    const command =
      createDoctorCommand(context);

    prepareCommand(command);

    await parseCommand(command, [
      "--cwd",
      "/doctor/project",
      "--global",
      "--json",
      "--fix",
    ]);

    const result = getLastInfoJson<{
      options: {
        cwd: string;
        global: boolean;
        json: boolean;
        fix: boolean;
      };
    }>(logs);

    expect(result.options).toEqual({
      cwd: "/doctor/project",
      global: true,
      json: true,
      fix: true,
    });
  });
});
