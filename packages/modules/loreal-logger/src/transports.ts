import * as Sentry from '@sentry/node';
import winston from 'winston';

export function createConsoleTransport(): winston.transport {
  return new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.colorize(),
      winston.format.printf(({ level, message, timestamp, ...meta }) => {
        const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] ${level}: ${message}${metaStr}`;
      })
    ),
  });
}

export function createFileTransport(type: 'error' | 'combined'): winston.transport {
  return new winston.transports.File({
    filename: `logs/${type}.log`,
    level: type === 'error' ? 'error' : 'info',
    maxsize: 5242880,
    maxFiles: 5,
  });
}

export function createSentryTransport(): winston.transport {
  return new winston.transports.Console({
    level: 'error',
    format: winston.format.printf((info) => {
      if (info.level === 'error' && info['error']) {
        Sentry.captureException(info['error']);
      }
      return '';
    }),
  });
}
