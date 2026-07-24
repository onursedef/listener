import {
  ExitCode,
  type ExitCodeValue,
} from "./exit-codes.ts";

export class AgentKitError extends Error {
  readonly exitCode: ExitCodeValue;
  readonly details: unknown;

  constructor(
    message: string,
    options: {
      exitCode?: ExitCodeValue;
      cause?: unknown;
      details?: unknown;
    } = {},
  ) {
    super(message, {
      cause: options.cause,
    });

    Object.setPrototypeOf(
      this,
      new.target.prototype,
    );

    this.name = new.target.name;
    this.exitCode =
      options.exitCode ??
      ExitCode.FAILURE;
    this.details =
      options.details;

    Error.captureStackTrace?.(
      this,
      new.target,
    );
  }
}

export class InvalidArgumentsError extends AgentKitError {
  constructor(
    message: string,
    details?: unknown,
  ) {
    super(message, {
      exitCode:
        ExitCode.INVALID_ARGUMENTS,
      details,
    });

    this.name =
      "InvalidArgumentsError";
  }
}

export class ConfigurationError extends AgentKitError {
  constructor(
    message: string,
    details?: unknown,
  ) {
    super(message, {
      exitCode:
        ExitCode.CONFIGURATION_ERROR,
      details,
    });

    this.name =
      "ConfigurationError";
  }
}

export class ValidationError extends AgentKitError {
  constructor(
    message: string,
    details?: unknown,
  ) {
    super(message, {
      exitCode:
        ExitCode.VALIDATION_FAILED,
      details,
    });

    this.name =
      "ValidationError";
  }
}

export function isAgentKitError(
  error: unknown,
): error is AgentKitError {
  return (
    error instanceof AgentKitError
  );
}
