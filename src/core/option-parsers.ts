import {
  InvalidArgumentError,
} from "commander";

export const INSTALLATION_SCOPES = [
  "global",
  "project",
] as const;

export type InstallationScope =
  (typeof INSTALLATION_SCOPES)[number];

export const CONSUMPTION_MODES = [
  "copy",
  "symlink",
] as const;

export type ConsumptionMode =
  (typeof CONSUMPTION_MODES)[number];

export const INSTALLATION_PRESETS = [
  "minimal",
  "full",
  "custom",
] as const;

export type InstallationPreset =
  (typeof INSTALLATION_PRESETS)[number];

export const AGENT_TARGETS = [
  "codex",
  "claude",
  "gemini",
  "cursor",
  "generic",
] as const;

export type AgentTarget =
  (typeof AGENT_TARGETS)[number];

export function parseInstallationScope(
  value: string,
): InstallationScope {
  return parseEnumValue(
    value,
    INSTALLATION_SCOPES,
    "installation scope",
  );
}

export function parseConsumptionMode(
  value: string,
): ConsumptionMode {
  return parseEnumValue(
    value,
    CONSUMPTION_MODES,
    "consumption mode",
  );
}

export function parseInstallationPreset(
  value: string,
): InstallationPreset {
  return parseEnumValue(
    value,
    INSTALLATION_PRESETS,
    "installation preset",
  );
}

export function parseAgentTarget(
  value: string,
): AgentTarget {
  return parseEnumValue(
    value,
    AGENT_TARGETS,
    "agent target",
  );
}

export function collectUnique<T>(
  value: T,
  previous: T[] | undefined,
): T[] {
  const values =
    previous ?? [];

  if (values.includes(value)) {
    return values;
  }

  return [
    ...values,
    value,
  ];
}

export function collectUniqueString(
  value: string,
  previous: string[] | undefined,
): string[] {
  const normalizedValue =
    value.trim();

  if (!normalizedValue) {
    throw new InvalidArgumentError(
      "The value cannot be empty.",
    );
  }

  return collectUnique(
    normalizedValue,
    previous,
  );
}

function parseEnumValue<
  const T extends readonly string[],
>(
  rawValue: string,
  allowedValues: T,
  label: string,
): T[number] {
  const value =
    rawValue
      .trim()
      .toLowerCase();

  if (
    !(
      allowedValues as readonly string[]
    ).includes(value)
  ) {
    throw new InvalidArgumentError(
      `Invalid ${label}: "${rawValue}". Expected one of: ${allowedValues.join(", ")}.`,
    );
  }

  return value as T[number];
}
