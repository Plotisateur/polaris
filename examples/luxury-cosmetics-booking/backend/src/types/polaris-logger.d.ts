declare module '@polaris/logger' {
  export interface Logger {
    info(message: string, meta?: Record<string, unknown> | unknown): void;
    warn(message: string, meta?: Record<string, unknown> | unknown): void;
    error(message: string, meta?: Record<string, unknown> | unknown): void;
    debug(message: string, meta?: Record<string, unknown> | unknown): void;
  }

  export const log: Logger;
}
