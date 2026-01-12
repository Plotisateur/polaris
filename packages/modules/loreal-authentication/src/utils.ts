/**
 * @polaris/authentication - Utilities
 *
 * Helper functions for token extraction, validation, and logging.
 */

import type { Request } from 'express';

import type { AuthenticationConfig, UserClaims, AuthenticationError } from './config';

/**
 * Extract token from request (header or cookie)
 */
export function extractToken(req: Request, config: AuthenticationConfig): string | null {
  const headerName = config.token?.header || 'Authorization';
  const cookieName = config.token?.cookieName;

  // Check Authorization header
  const authHeader = req.headers[headerName.toLowerCase()] as string | undefined;
  if (authHeader) {
    // Handle "Bearer <token>" format
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return authHeader;
  }

  // Check cookie if configured
  if (cookieName && req.cookies?.[cookieName]) {
    return req.cookies[cookieName];
  }

  return null;
}

/**
 * Check if token is about to expire
 */
export function isTokenExpiringSoon(
  user: UserClaims,
  threshold: number = 5 * 60 * 1000 // 5 minutes default
): boolean {
  if (!user.exp) {
    return false;
  }

  const expiryTime = user.exp * 1000; // Convert to milliseconds
  const now = Date.now();
  const timeUntilExpiry = expiryTime - now;

  return timeUntilExpiry <= threshold && timeUntilExpiry > 0;
}

/**
 * Check if token is expired
 */
export function isTokenExpired(user: UserClaims): boolean {
  if (!user.exp) {
    return false;
  }

  const expiryTime = user.exp * 1000;
  return Date.now() >= expiryTime;
}

/**
 * Redact sensitive fields from user claims for logging
 */
export function redactUserClaims(
  user: UserClaims,
  fieldsToRedact: string[] = ['email', 'phone_number', 'address']
): Record<string, unknown> {
  const redacted: Record<string, unknown> = { ...user };

  for (const field of fieldsToRedact) {
    if (field in redacted) {
      redacted[field] = '[REDACTED]';
    }
  }

  return redacted;
}

/**
 * Check if event should be logged based on configuration
 */
function shouldLogEvent(
  event: 'success' | 'failure' | 'refresh',
  config: AuthenticationConfig
): boolean {
  if (!config.logging?.enabled) {
    return false;
  }

  if (event === 'success') {
    return config.logging.logSuccessfulAuth ?? false;
  }
  if (event === 'failure') {
    return config.logging.logFailedAuth ?? false;
  }
  if (event === 'refresh') {
    return config.logging.logTokenRefresh ?? false;
  }

  return false;
}

/**
 * Create log data object from event details
 */
function createLogData(
  event: 'success' | 'failure' | 'refresh',
  config: AuthenticationConfig,
  details: {
    userId?: string;
    error?: AuthenticationError;
    provider?: string;
    path?: string;
  }
) {
  return {
    event: `auth.${event}`,
    provider: details.provider || config.provider,
    userId: details.userId,
    path: details.path,
    error: details.error
      ? {
          code: details.error.code,
          message: details.error.message,
        }
      : undefined,
  };
}

/**
 * Fallback console logging when @polaris/logger unavailable
 */
function fallbackConsoleLog(
  event: 'success' | 'failure' | 'refresh',
  config: AuthenticationConfig,
  details: {
    userId?: string;
    error?: AuthenticationError;
    provider?: string;
  }
): void {
  const timestamp = new Date().toISOString();
  const provider = details.provider || config.provider;
  const logMessage = `[${timestamp}] AUTH ${event.toUpperCase()}: ${provider}`;

  if (event === 'failure' && details.error) {
    console.warn(logMessage, details.error.message);
  } else {
    console.warn(logMessage, details.userId || 'unknown');
  }
}

/**
 * Log authentication event (with optional @polaris/logger integration)
 */
export function logAuthEvent(
  event: 'success' | 'failure' | 'refresh',
  config: AuthenticationConfig,
  details: {
    userId?: string;
    error?: AuthenticationError;
    provider?: string;
    path?: string;
  }
): void {
  if (!shouldLogEvent(event, config)) {
    return;
  }

  // Try to use @polaris/logger if available
  try {
    const { log } = require('@polaris/logger');
    const logData = createLogData(event, config, details);

    if (event === 'failure') {
      log.warn('Authentication failed', logData);
    } else {
      log.info(`Authentication ${event}`, logData);
    }
  } catch {
    fallbackConsoleLog(event, config, details);
  }
}

/**
 * Validate required configuration fields
 */
export function validateConfig(config: AuthenticationConfig): void {
  if (!config.provider) {
    throw new Error('Authentication provider is required');
  }

  switch (config.provider) {
    case 'oidc':
      if (!config.issuer) {
        throw new Error('OIDC issuer is required');
      }
      if (!config.clientId) {
        throw new Error('OIDC clientId is required');
      }
      break;

    case 'iap':
      // IAP requires no configuration - zero-config!
      break;

    case 'entra-id':
      if (!config.tenantId) {
        throw new Error('Entra ID tenant ID is required');
      }
      if (!config.clientId) {
        throw new Error('Entra ID client ID is required');
      }
      break;

    default:
      throw new Error(`Unknown authentication provider: ${config.provider}`);
  }
}

/**
 * Build JWKS URI from issuer
 */
export function buildJwksUri(issuer: string, provider: string): string {
  // Remove trailing slash
  const cleanIssuer = issuer.replace(/\/$/, '');

  switch (provider) {
    case 'oidc':
      // Standard OIDC discovery
      return `${cleanIssuer}/.well-known/jwks.json`;

    case 'iap':
      // Google IAP uses Google's JWKS
      return 'https://www.gstatic.com/iap/verify/public_key-jwk';

    case 'entra-id':
      // Microsoft Entra ID / Azure AD
      return `${cleanIssuer}/discovery/v2.0/keys`;

    default:
      return `${cleanIssuer}/.well-known/jwks.json`;
  }
}

/**
 * Parse "Bearer <token>" format
 */
export function parseBearerToken(authHeader: string): string | null {
  const parts = authHeader.split(' ');

  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1] || null;
  }

  return null;
}

/**
 * Check if path should skip authentication
 */
export function shouldSkipAuth(path: string, skipPaths?: (string | RegExp)[]): boolean {
  if (!skipPaths || skipPaths.length === 0) {
    return false;
  }

  return skipPaths.some((pattern) => {
    if (typeof pattern === 'string') {
      return path === pattern || path.startsWith(pattern);
    }
    return pattern.test(path);
  });
}

/**
 * Generate cache key for token validation
 */
export function generateCacheKey(token: string): string {
  // Use first 16 chars + last 8 chars for cache key (don't store full token)
  if (token.length < 24) {
    return token;
  }
  return `auth:${token.substring(0, 16)}...${token.substring(token.length - 8)}`;
}
