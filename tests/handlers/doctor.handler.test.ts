import {
  describe,
  expect,
  test,
} from "bun:test";

import {
  handleDoctor,
  type DoctorOptions,
} from "../../src/handlers/doctor.handler.ts";
import {
  createTestContext,
  getLastInfoJson,
} from "../helpers/test-context.ts";

describe("handleDoctor", () => {
  test("logs the normalized doctor request", async () => {
    const {
      context,
      logs,
    } = createTestContext();

    const options: DoctorOptions = {
      cwd: "/doctor/project",
      global: true,
      json: true,
      fix: true,
    };

    await handleDoctor(
      context,
      options,
    );

    const result = getLastInfoJson<{
      command: string;
      cwd: string;
      options: DoctorOptions;
    }>(logs);

    expect(result).toEqual({
      command: "doctor",
      cwd: "/doctor/project",
      options,
    });
  });
});
