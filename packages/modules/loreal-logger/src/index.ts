import * as Sentry from '@sentry/node';
import winston from 'winston';

import { createConsoleTransport, createFileTransport, createSentryTransport } from './transports';
import type { LoggerConfig, LogLevel, LogMeta } from './types';

if (process.env['SENTRY_DSN']) {
  Sentry.init({
    dsn: process.env['SENTRY_DSN'],
    environment: process.env['NODE_ENV'] || 'development',
    tracesSampleRate: 1.0,
  });
}

const config: LoggerConfig = {
  level: (process.env['LOG_LEVEL'] as LogLevel) || 'info',
  enableConsole: process.env['NODE_ENV'] !== 'production',
  enableFile: true,
  enableSentry: !!process.env['SENTRY_DSN'],
};

const transports: winston.transport[] = [];

if (config.enableFile) {
  transports.push(createFileTransport('error'));
  transports.push(createFileTransport('combined'));
}

if (config.enableConsole) {
  transports.push(createConsoleTransport());
}

if (config.enableSentry) {
  transports.push(createSentryTransport());
}

export const logger = winston.createLogger({
  level: config.level,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.metadata(),
    winston.format.json()
  ),
  transports,
});

export const log = {
  info: (message: string, meta?: LogMeta) => logger.info(message, meta),
  error: (message: string, error?: Error, meta?: LogMeta) =>
    logger.error(message, { error: error?.message, stack: error?.stack, ...meta }),
  warn: (message: string, meta?: LogMeta) => logger.warn(message, meta),
  debug: (message: string, meta?: LogMeta) => logger.debug(message, meta),
};

export { LogLevel, LoggerConfig, LogMeta } from './types';
export default logger;
