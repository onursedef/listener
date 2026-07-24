import {
  Command,
} from "commander";

import type {
  CommandContext,
} from "../core/command-context.ts";
import {
  AGENT_TARGETS,
  collectUnique,
  parseAgentTarget,
  type AgentTarget,
} from "../core/option-parsers.ts";
import {
  handleSync,
  type SyncOptions,
} from "../handlers/sync.handler.ts";

interface SyncCommandOptions {
  agent?: AgentTarget[];
  cwd?: string;
  all?: boolean;
  dryRun?: boolean;
  force?: boolean;
  yes?: boolean;
}

export function createSyncCommand(
  context: CommandContext,
): Command {
  return new Command("sync")
    .description(
      "Regenerate configured agent instructions and skills.",
    )
    .option(
      "--agent <agent>",
      `Limit synchronization to an agent. Repeatable: ${AGENT_TARGETS.join(", ")}.`,
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
    .option(
      "--cwd <path>",
      "Repository or working directory.",
    )
    .option(
      "--all",
      "Synchronize every registered project.",
      false,
    )
    .option(
      "--dry-run",
      "Preview generated changes.",
      false,
    )
    .option(
      "--force",
      "Replace conflicting Listener sections.",
      false,
    )
    .option(
      "-y, --yes",
      "Skip confirmation when synchronizing multiple projects.",
      false,
    )
    .action(
      async (
        rawOptions: SyncCommandOptions,
      ) => {
        const options: SyncOptions = {
          agents:
            rawOptions.agent ?? [],
          all:
            rawOptions.all ?? false,
          dryRun:
            rawOptions.dryRun ??
            false,
          force:
            rawOptions.force ??
            false,
          yes:
            rawOptions.yes ?? false,
        };

        if (
          rawOptions.cwd !== undefined
        ) {
          options.cwd =
            rawOptions.cwd;
        }

        await handleSync(
          context,
          options,
        );
      },
    );
}
