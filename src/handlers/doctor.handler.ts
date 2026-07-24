import type { CommandContext } from "../core/command-context.ts";

export interface DoctorOptions {
  cwd?: string;
  global: boolean;
  json: boolean;
  fix: boolean;
}

export async function handleDoctor(
  context: CommandContext,
  options: DoctorOptions,
): Promise<void> {
  context.logger.info(
    JSON.stringify(
      {
        command: "doctor",
        cwd: options.cwd ?? context.cwd,
        options,
      },
      null,
      2,
    ),
  );
}
