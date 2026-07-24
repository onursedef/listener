import {
  describe,
  expect,
  test,
} from "bun:test";

import {
  ExitCode,
} from "../../src/core/exit-codes.ts";

describe("ExitCode", () => {
  test("contains the expected exit codes", () => {
    expect(ExitCode).toEqual({
      SUCCESS: 0,
      FAILURE: 1,
      INVALID_ARGUMENTS: 2,
      CONFIGURATION_ERROR: 3,
      FILESYSTEM_ERROR: 4,
      VALIDATION_FAILED: 5,
      UNEXPECTED_ERROR: 10,
    });
  });

  test("uses unique numeric values", () => {
    const values = Object.values(ExitCode);

    expect(
      new Set(values).size,
    ).toBe(values.length);
  });

  test("uses zero only for success", () => {
    expect(ExitCode.SUCCESS).toBe(0);

    const failureCodes = Object.entries(ExitCode)
      .filter(([name]) => name !== "SUCCESS")
      .map(([, value]) => value);

    expect(
      failureCodes.every((value) => value > 0),
    ).toBe(true);
  });
});
