import type { CommandContext } from "../core/command-context.ts";
import type { AgentTarget } from "../core/option-parsers.ts";

export interface CheckOptions {
  agents: AgentTarget[];
  cwd?: string;
  all: boolean;
  strict: boolean;
}

export async function handleCheck(
  context: CommandContext,
  options: CheckOptions,
): Promise<void> {
  context.logger.info(
    JSON.stringify(
      {
        command: "check",
        cwd: options.cwd ?? context.cwd,
        options,
      },
      null,
      2,
    ),
  );
}
