import type { CommandContext } from "../core/command-context.ts";
import type { AgentTarget } from "../core/option-parsers.ts";

export interface SyncOptions {
  agents: AgentTarget[];
  cwd?: string;
  all: boolean;
  dryRun: boolean;
  force: boolean;
  yes: boolean;
}

export async function handleSync(
  context: CommandContext,
  options: SyncOptions,
): Promise<void> {
  context.logger.info(
    JSON.stringify(
      {
        command: "sync",
        cwd: options.cwd ?? context.cwd,
        options,
      },
      null,
      2,
    ),
  );
}
