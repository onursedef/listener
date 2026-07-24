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
  handleCheck,
  type CheckOptions,
} from "../handlers/check.handler.ts";

interface CheckCommandOptions {
  agent?: AgentTarget[];
  cwd?: string;
  all?: boolean;
  strict?: boolean;
}

export function createCheckCommand(
  context: CommandContext,
): Command {
  return new Command("check")
    .description(
      "Verify that generated instructions match configuration.",
    )
    .option(
      "--agent <agent>",
      `Limit validation to an agent. Repeatable: ${AGENT_TARGETS.join(", ")}.`,
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
      "Check every registered project.",
      false,
    )
    .option(
      "--strict",
      "Treat warnings as validation failures.",
      false,
    )
    .action(
      async (
        rawOptions: CheckCommandOptions,
      ) => {
        const options: CheckOptions = {
          agents:
            rawOptions.agent ?? [],
          all:
            rawOptions.all ?? false,
          strict:
            rawOptions.strict ??
            false,
        };

        if (
          rawOptions.cwd !== undefined
        ) {
          options.cwd =
            rawOptions.cwd;
        }

        await handleCheck(
          context,
          options,
        );
      },
    );
}
