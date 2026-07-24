import { Command } from "commander";

import type { CommandContext } from "./core/command-context.ts";
import { createCheckCommand } from "./commands/check.command.ts";
import { createDoctorCommand } from "./commands/doctor.command.ts";
import { createExplainCommand } from "./commands/explain.command.ts";
import { createProjectsCommand } from "./commands/projects.command.ts";
import { createSetupCommand } from "./commands/setup.command.ts";
import { createSyncCommand } from "./commands/sync.command.ts";

export interface CreateCliOptions {
  version: string;
  context: CommandContext;
}

export function createCli(
  options: CreateCliOptions,
): Command {
  const program = new Command();

  program
    .name("listener")
    .alias("li")
    .description(
      "Manage reusable agent instructions, skills, and project integrations.",
    )
    .version(
      options.version,
      "-v, --version",
      "Display the installed version.",
    )
    .showHelpAfterError()
    .showSuggestionAfterError();

  program.addCommand(
    createSetupCommand(options.context),
  );

  program.addCommand(
    createSyncCommand(options.context),
  );

  program.addCommand(
    createCheckCommand(options.context),
  );

  program.addCommand(
    createDoctorCommand(options.context),
  );

  program.addCommand(
    createExplainCommand(options.context),
  );

  program.addCommand(
    createProjectsCommand(options.context),
  );

  return program;
}
