export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export type LoggerConfig = {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  enableSentry: boolean;
};

export type LogMeta = Record<string, unknown>;
