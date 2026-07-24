import type {
  CommandContext,
  CommandLogger,
} from "../../src/core/command-context.ts";

export interface CapturedLogs {
  info: string[];
  warn: string[];
  error: string[];
  debug: string[];
}

export interface TestContextResult {
  context: CommandContext;
  logs: CapturedLogs;
}

export function createTestContext(
  cwd = "/test/project",
): TestContextResult {
  const logs: CapturedLogs = {
    info: [],
    warn: [],
    error: [],
    debug: [],
  };

  const logger: CommandLogger = {
    info(message) {
      logs.info.push(message);
    },

    warn(message) {
      logs.warn.push(message);
    },

    error(message) {
      logs.error.push(message);
    },

    debug(message) {
      logs.debug.push(message);
    },
  };

  return {
    context: {
      cwd,
      logger,
    },
    logs,
  };
}

export function getLastInfoJson<
  T = Record<string, unknown>,
>(
  logs: CapturedLogs,
): T {
  const output = logs.info.at(-1);

  if (output === undefined) {
    throw new Error(
      "Expected an info log containing JSON, but no info logs were recorded.",
    );
  }

  return JSON.parse(output) as T;
}
