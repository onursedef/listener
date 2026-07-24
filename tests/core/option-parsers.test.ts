import {
  describe,
  expect,
  test,
} from "bun:test";

import {
  AGENT_TARGETS,
  CONSUMPTION_MODES,
  INSTALLATION_PRESETS,
  INSTALLATION_SCOPES,
  collectUnique,
  parseAgentTarget,
  parseConsumptionMode,
  parseInstallationPreset,
  parseInstallationScope,
} from "../../src/core/option-parsers.ts";
import { InvalidArgumentError } from "commander";

describe("option constants", () => {
  test("contains supported scopes", () => {
    expect(INSTALLATION_SCOPES).toEqual([
      "global",
      "project",
    ]);
  });

  test("contains supported consumption modes", () => {
    expect(CONSUMPTION_MODES).toEqual([
      "copy",
      "symlink",
    ]);
  });

  test("contains supported presets", () => {
    expect(INSTALLATION_PRESETS).toEqual([
      "minimal",
      "full",
      "custom",
    ]);
  });

  test("contains supported agent targets", () => {
    expect(AGENT_TARGETS).toEqual([
      "codex",
      "claude",
      "gemini",
      "cursor",
      "generic",
    ]);
  });
});

describe("parseInstallationScope", () => {
  test("parses valid scopes", () => {
    expect(
      parseInstallationScope("global"),
    ).toBe("global");

    expect(
      parseInstallationScope("project"),
    ).toBe("project");
  });

  test("normalizes whitespace and casing", () => {
    expect(
      parseInstallationScope(" GLOBAL "),
    ).toBe("global");
  });

  test("rejects unsupported scopes", () => {
    expect(() =>
      parseInstallationScope("workspace"),
    ).toThrow(InvalidArgumentError);
  });
});

describe("parseConsumptionMode", () => {
  test("parses valid modes", () => {
    expect(
      parseConsumptionMode("copy"),
    ).toBe("copy");

    expect(
      parseConsumptionMode("symlink"),
    ).toBe("symlink");
  });

  test("rejects unsupported modes", () => {
    expect(() =>
      parseConsumptionMode("hybrid"),
    ).toThrow(InvalidArgumentError);
  });
});

describe("parseInstallationPreset", () => {
  test("parses valid presets", () => {
    expect(
      parseInstallationPreset("minimal"),
    ).toBe("minimal");

    expect(
      parseInstallationPreset("full"),
    ).toBe("full");

    expect(
      parseInstallationPreset("custom"),
    ).toBe("custom");
  });

  test("rejects unsupported presets", () => {
    expect(() =>
      parseInstallationPreset("advanced"),
    ).toThrow(InvalidArgumentError);
  });
});

describe("parseAgentTarget", () => {
  test("parses valid agent targets", () => {
    expect(
      parseAgentTarget("codex"),
    ).toBe("codex");

    expect(
      parseAgentTarget(" CLAUDE "),
    ).toBe("claude");
  });

  test("rejects unsupported agent targets", () => {
    expect(() =>
      parseAgentTarget("copilot"),
    ).toThrow(InvalidArgumentError);
  });
});

describe("collectUnique", () => {
  test("adds values that are not present", () => {
    expect(
      collectUnique("claude", ["codex"]),
    ).toEqual([
      "codex",
      "claude",
    ]);
  });

  test("does not add duplicate values", () => {
    const original = ["codex"];

    const result = collectUnique(
      "codex",
      original,
    );

    expect(result).toBe(original);
    expect(result).toEqual(["codex"]);
  });
});
