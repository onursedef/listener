import { Command, Option } from "commander";

import type { CommandContext } from "../core/command-context.ts";
import {
  AGENT_TARGETS,
  parseAgentTarget,
} from "../core/option-parsers.ts";
import {
  handleExplain,
  type ExplainOptions,
} from "../handlers/explain.handler.ts";

export function createExplainCommand(
  context: CommandContext,
): Command {
  return new Command("explain")
    .description(
      "Explain which instructions apply to a path.",
    )
    .argument(
      "[path]",
      "File or directory whose effective policy should be explained.",
    )
    .addOption(
      new Option(
        "--agent <agent>",
        "Explain policy for a specific agent.",
      )
        .argParser(parseAgentTarget),
    )
    .option(
      "--cwd <path>",
      "Repository or working directory.",
    )
    .option(
      "--json",
      "Print machine-readable output.",
      false,
    )
    .action(
      async (
        targetPath: string | undefined,
        options: ExplainOptions,
      ) => {
        await handleExplain(
          context,
          targetPath,
          options,
        );
      },
    );
}
