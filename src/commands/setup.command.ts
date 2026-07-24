import {
  Command,
  Option,
} from "commander";

import type {
  CommandContext,
} from "../core/command-context.ts";
import {
  AGENT_TARGETS,
  CONSUMPTION_MODES,
  INSTALLATION_PRESETS,
  INSTALLATION_SCOPES,
  collectUnique,
  collectUniqueString,
  parseAgentTarget,
  parseConsumptionMode,
  parseInstallationPreset,
  parseInstallationScope,
  type AgentTarget,
  type ConsumptionMode,
  type InstallationPreset,
  type InstallationScope,
} from "../core/option-parsers.ts";
import {
  handleSetup,
  type SetupOptions,
} from "../handlers/setup.handler.ts";

interface SetupCommandOptions {
  scope?: InstallationScope;
  mode?: ConsumptionMode;
  agent?: AgentTarget[];
  preset?: InstallationPreset;
  module?: string[];
  profile?: string[];
  integration?: string[];
  cwd?: string;
  yes?: boolean;
  dryRun?: boolean;
  force?: boolean;
}

export function createSetupCommand(
  context: CommandContext,
): Command {
  const command =
    new Command("setup");

  command
    .description(
      "Configure agent instructions and reusable skills.",
    )
    .addOption(
      new Option(
        "--scope <scope>",
        `Installation scope: ${INSTALLATION_SCOPES.join(", ")}.`,
      ).argParser(
        parseInstallationScope,
      ),
    )
    .addOption(
      new Option(
        "--mode <mode>",
        `How projects consume a global installation: ${CONSUMPTION_MODES.join(", ")}.`,
      ).argParser(
        parseConsumptionMode,
      ),
    )
    .option(
      "--agent <agent>",
      `Agent target. Repeatable: ${AGENT_TARGETS.join(", ")}.`,
      (
        value: string,
        previous:
          | AgentTarget[]
          | undefined,
      ) =>
        collectUnique(
          parseAgentTarget(value),
          previous,
        ),
      [],
    )
    .addOption(
      new Option(
        "--preset <preset>",
        `Installation policy preset: ${INSTALLATION_PRESETS.join(", ")}.`,
      ).argParser(
        parseInstallationPreset,
      ),
    )
    .option(
      "--module <module>",
      "Enable a module in custom mode. Repeatable.",
      collectUniqueString,
      [],
    )
    .option(
      "--profile <profile>",
      "Enable a project profile. Repeatable.",
      collectUniqueString,
      [],
    )
    .option(
      "--integration <integration>",
      "Enable an integration. Repeatable.",
      collectUniqueString,
      [],
    )
    .option(
      "--cwd <path>",
      "Repository or working directory.",
    )
    .option(
      "-y, --yes",
      "Skip interactive confirmation.",
      false,
    )
    .option(
      "--dry-run",
      "Preview changes without writing files.",
      false,
    )
    .option(
      "--force",
      "Replace conflicting Listener sections.",
      false,
    )
    .addHelpText(
      "after",
      `
Examples:
  $ listener setup
  $ listener setup --scope global
  $ listener setup --scope project --agent codex --preset minimal
  $ listener setup --scope global --mode copy --agent codex --preset full
  $ listener setup --scope project --agent codex --agent claude --preset full
  $ listener setup --scope project --agent codex --preset custom --module supervisor-loop
`,
    )
    .action(
      async (
        rawOptions: SetupCommandOptions,
      ) => {
        const options =
          normalizeSetupOptions(
            rawOptions,
          );

        await handleSetup(
          context,
          options,
        );
      },
    );

  return command;
}

function normalizeSetupOptions(
  raw: SetupCommandOptions,
): SetupOptions {
  const options: SetupOptions = {
    agents:
      raw.agent ?? [],
    modules:
      raw.module ?? [],
    profiles:
      raw.profile ?? [],
    integrations:
      raw.integration ?? [],
    yes:
      raw.yes ?? false,
    dryRun:
      raw.dryRun ?? false,
    force:
      raw.force ?? false,
  };

  if (raw.scope !== undefined) {
    options.scope =
      raw.scope;
  }

  if (raw.mode !== undefined) {
    options.mode =
      raw.mode;
  }

  if (raw.preset !== undefined) {
    options.preset =
      raw.preset;
  }

  if (raw.cwd !== undefined) {
    options.cwd =
      raw.cwd;
  }

  return options;
}
