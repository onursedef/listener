import type {
  CommandContext,
} from "../core/command-context.ts";
import {
  InvalidArgumentsError,
} from "../core/errors.ts";
import {
  generateInstructions,
} from "../core/instruction-generator.ts";
import {
  unknownPolicyModules,
} from "../core/policy-catalog.ts";
import type {
  AgentTarget,
  ConsumptionMode,
  InstallationPreset,
  InstallationScope,
} from "../core/option-parsers.ts";

export interface SetupOptions {
  scope?: InstallationScope;
  mode?: ConsumptionMode;
  agents: AgentTarget[];
  preset?: InstallationPreset;
  modules: string[];
  profiles: string[];
  integrations: string[];
  cwd?: string;
  yes: boolean;
  dryRun: boolean;
  force: boolean;
}

export async function handleSetup(
  context: CommandContext,
  input: SetupOptions,
): Promise<void> {
  const options: SetupOptions = {
    ...input,
    agents:
      input.agents ?? [],
    modules:
      input.modules ?? [],
    profiles:
      input.profiles ?? [],
    integrations:
      input.integrations ?? [],
  };

  validateSetupOptions(options);

  const cwd = options.cwd ?? context.cwd;
  const generation = options.preset === undefined || options.agents.length === 0
    ? undefined
    : await generateInstructions({
      cwd,
      agents: options.agents,
      preset: options.preset,
      modules: options.modules,
      integrations: options.integrations,
      dryRun: options.dryRun,
      force: options.force,
    });

  context.logger.info(
    JSON.stringify(
      {
        command: "setup",
        cwd,
        options,
        generation,
      },
      null,
      2,
    ),
  );
}

function validateSetupOptions(
  options: SetupOptions,
): void {
  if (
    options.scope === "project" &&
    options.mode !== undefined
  ) {
    throw new InvalidArgumentsError(
      "--mode is only valid with --scope global.",
    );
  }

  if (
    options.preset !== "custom" &&
    options.modules.length > 0
  ) {
    throw new InvalidArgumentsError(
      "--module can only be used with --preset custom.",
    );
  }

  const unknownModules = unknownPolicyModules(options.modules);
  if (unknownModules.length > 0) {
    throw new InvalidArgumentsError(
      `Unknown policy module: ${unknownModules.join(", ")}.`,
    );
  }

  if (
    options.yes &&
    options.scope === undefined
  ) {
    throw new InvalidArgumentsError(
      "--scope is required when using --yes.",
    );
  }

  if (
    options.yes &&
    options.agents.length === 0
  ) {
    throw new InvalidArgumentsError(
      "At least one --agent is required when using --yes.",
    );
  }

  if (
    options.yes &&
    options.preset === undefined
  ) {
    throw new InvalidArgumentsError(
      "--preset is required when using --yes.",
    );
  }
}
