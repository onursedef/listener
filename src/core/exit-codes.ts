export const ExitCode = {
  SUCCESS: 0,
  FAILURE: 1,
  INVALID_ARGUMENTS: 2,
  CONFIGURATION_ERROR: 3,
  FILESYSTEM_ERROR: 4,
  VALIDATION_FAILED: 5,
  UNEXPECTED_ERROR: 10
} as const;

export type ExitCodeValue = (typeof ExitCode)[keyof typeof ExitCode];
