export interface CommandLogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  debug(message: string): void;
}

export interface CommandContext {
  cwd: string;
  logger: CommandLogger;
}

export function createCommandContext(options?: {
  cwd?: string,
  debug?: boolean
}): CommandContext {
  const debugEnabled = options?.debug ?? false;

  return {
    cwd: options?.cwd ?? process.cwd(),
    logger: {
      info(message) {
        console.log(message)
      },
      warn(message) {
        console.warn(message)
      },
      error(message) {
        console.error(message)
      },
      debug(message) {
        if (debugEnabled) {
          console.debug(message)
        }
      }
    }
  }
}
