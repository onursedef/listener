import {
  describe,
  expect,
  test,
} from "bun:test";

import {
  AgentKitError,
  ConfigurationError,
  InvalidArgumentsError,
  ValidationError,
  isAgentKitError,
} from "../../src/core/errors.ts";
import {
  ExitCode,
} from "../../src/core/exit-codes.ts";

describe("AgentKitError", () => {
  test("uses the default failure exit code", () => {
    const error = new AgentKitError("Something failed");

    expect(error.message).toBe("Something failed");
    expect(error.name).toBe("AgentKitError");
    expect(error.exitCode).toBe(ExitCode.FAILURE);
    expect(error.details).toBeUndefined();
  });

  test("stores a custom exit code, cause, and details", () => {
    const cause = new Error("Original error");
    const details = {
      path: "/example",
    };

    const error = new AgentKitError(
      "Wrapped failure",
      {
        exitCode: ExitCode.FILESYSTEM_ERROR,
        cause,
        details,
      },
    );

    expect(error.exitCode).toBe(
      ExitCode.FILESYSTEM_ERROR,
    );
    expect(error.cause).toBe(cause);
    expect(error.details).toEqual(details);
  });
});

describe("InvalidArgumentsError", () => {
  test("uses the invalid arguments exit code", () => {
    const error = new InvalidArgumentsError(
      "Invalid option",
      {
        option: "--scope",
      },
    );

    expect(error.name).toBe(
      "InvalidArgumentsError",
    );
    expect(error.exitCode).toBe(
      ExitCode.INVALID_ARGUMENTS,
    );
    expect(error.details).toEqual({
      option: "--scope",
    });
  });
});

describe("ConfigurationError", () => {
  test("uses the configuration error exit code", () => {
    const error = new ConfigurationError(
      "Configuration missing",
    );

    expect(error.name).toBe(
      "ConfigurationError",
    );
    expect(error.exitCode).toBe(
      ExitCode.CONFIGURATION_ERROR,
    );
  });
});

describe("ValidationError", () => {
  test("uses the validation failed exit code", () => {
    const error = new ValidationError(
      "Generated file is stale",
    );

    expect(error.name).toBe(
      "ValidationError",
    );
    expect(error.exitCode).toBe(
      ExitCode.VALIDATION_FAILED,
    );
  });
});

describe("isAgentKitError", () => {
  test("returns true for AgentKit errors", () => {
    expect(
      isAgentKitError(
        new AgentKitError("Failure"),
      ),
    ).toBe(true);

    expect(
      isAgentKitError(
        new InvalidArgumentsError("Failure"),
      ),
    ).toBe(true);
  });

  test("returns false for unrelated values", () => {
    expect(
      isAgentKitError(
        new Error("Normal error"),
      ),
    ).toBe(false);

    expect(
      isAgentKitError("error"),
    ).toBe(false);

    expect(
      isAgentKitError(null),
    ).toBe(false);
  });
});
