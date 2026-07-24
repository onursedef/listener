import type { CommandContext } from "../core/command-context.ts";
import type { AgentTarget } from "../core/option-parsers.ts";

export interface ExplainOptions {
  agent?: AgentTarget;
  cwd?: string;
  json: boolean;
}

export async function handleExplain(
  context: CommandContext,
  targetPath: string | undefined,
  options: ExplainOptions,
): Promise<void> {
  context.logger.info(
    JSON.stringify(
      {
        command: "explain",
        cwd: options.cwd ?? context.cwd,
        targetPath,
        options,
      },
      null,
      2,
    ),
  );
}
