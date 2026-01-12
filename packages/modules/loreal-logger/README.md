# @polaris/logger

Structured logging with Winston and Sentry integration for L'Oréal projects.

## Installation

```bash
# Via Polaris CLI (recommended)
polaris add loreal-logger

# Or manually
npm install @polaris/logger
```

## Usage

```typescript
import { logger, log } from '@polaris/logger';

// Simple logging with convenience methods
log.info('User logged in', { userId: '123' });
log.error('Failed to process payment', new Error('Payment failed'), { orderId: '456' });
log.warn('API rate limit approaching');
log.debug('Debugging information');

// Advanced logging with Winston instance
logger.info('Custom log', { customField: 'value' });
```

## Configuration

Set environment variables:

```bash
LOG_LEVEL=info           # error, warn, info, debug
NODE_ENV=production      # production, development
SENTRY_DSN=https://...   # Optional: Enable Sentry error tracking
```

## Features

- ✅ Multiple log levels (error, warn, info, debug)
- ✅ Console output (development only)
- ✅ File rotation (logs/error.log, logs/combined.log)
- ✅ Sentry integration for error tracking
- ✅ Structured JSON logging
- ✅ Timestamp formatting

## API

### `log`

Convenience methods for quick logging:

```typescript
log.info(message: string, meta?: LogMeta): void
log.error(message: string, error?: Error, meta?: LogMeta): void
log.warn(message: string, meta?: LogMeta): void
log.debug(message: string, meta?: LogMeta): void
```

### `logger`

Full Winston logger instance for advanced usage:

```typescript
logger.log(level: string, message: string, meta?: LogMeta): void
logger.info(message: string, meta?: LogMeta): void
logger.warn(message: string, meta?: LogMeta): void
logger.error(message: string, meta?: LogMeta): void
logger.debug(message: string, meta?: LogMeta): void
```

## License

PROPRIETARY - L'Oréal Internal Use Only
