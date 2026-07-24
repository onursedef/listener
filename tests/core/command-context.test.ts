import {
  describe,
  expect,
  spyOn,
  test,
} from "bun:test";

import {
  createCommandContext,
} from "../../src/core/command-context.ts";

describe("createCommandContext", () => {
  test("uses the provided working directory", () => {
    const context = createCommandContext({
      cwd: "/custom/project",
    });

    expect(context.cwd).toBe(
      "/custom/project",
    );
  });

  test("uses process.cwd when cwd is omitted", () => {
    const context = createCommandContext();

    expect(context.cwd).toBe(
      process.cwd(),
    );
  });

  test("routes logger messages to console methods", () => {
    const logSpy = spyOn(
      console,
      "log",
    ).mockImplementation(() => undefined);

    const warnSpy = spyOn(
      console,
      "warn",
    ).mockImplementation(() => undefined);

    const errorSpy = spyOn(
      console,
      "error",
    ).mockImplementation(() => undefined);

    try {
      const context = createCommandContext();

      context.logger.info("Info");
      context.logger.warn("Warning");
      context.logger.error("Error");

      expect(logSpy).toHaveBeenCalledWith(
        "Info",
      );

      expect(warnSpy).toHaveBeenCalledWith(
        "Warning",
      );

      expect(errorSpy).toHaveBeenCalledWith(
        "Error",
      );
    } finally {
      logSpy.mockRestore();
      warnSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });

  test("does not print debug logs by default", () => {
    const debugSpy = spyOn(
      console,
      "debug",
    ).mockImplementation(() => undefined);

    try {
      const context = createCommandContext();

      context.logger.debug("Hidden");

      expect(debugSpy).not.toHaveBeenCalled();
    } finally {
      debugSpy.mockRestore();
    }
  });

  test("prints debug logs when debugging is enabled", () => {
    const debugSpy = spyOn(
      console,
      "debug",
    ).mockImplementation(() => undefined);

    try {
      const context = createCommandContext({
        debug: true,
      });

      context.logger.debug("Visible");

      expect(debugSpy).toHaveBeenCalledWith(
        "Visible",
      );
    } finally {
      debugSpy.mockRestore();
    }
  });
});
