/**
 * @polaris/authentication - Express Middleware
 *
 * Unified middleware with single API for all authentication providers
 */

import type { Request, Response, NextFunction } from 'express';

import type {
  AuthenticationConfig,
  AuthMiddlewareOptions,
  UserClaims,
  ValidationResult,
} from './config';
import {
  AuthenticationError,
  createOidcConfig,
  createIapConfig,
  createEntraIdConfig,
} from './config';
import { createConfigFromEnv } from './env';
import { EntraIdProvider } from './providers/entra-id';
import { IapProvider } from './providers/iap';
import { OidcProvider } from './providers/oidc';
import { extractToken, logAuthEvent, shouldSkipAuth } from './utils';

type AuthProvider = OidcProvider | IapProvider | EntraIdProvider;

/**
 * Wrapper for async Express middleware to handle promise rejection
 */
// eslint-disable-next-line no-unused-vars
function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Check token cache and return cached user if valid
 */
function checkTokenCache(
  token: string,
  tokenCache: Map<string, { user: UserClaims; expiry: number }>,
  req: Request,
  config: AuthenticationConfig
): UserClaims | null {
  if (!config.token?.cacheEnabled) {
    return null;
  }

  const cached = tokenCache.get(token);
  if (cached && cached.expiry > Date.now()) {
    req.user = cached.user;
    req.token = token;
    return cached.user;
  }

  return null;
}

/**
 * Attach user to request and cache token if enabled
 */
function attachUserAndCache(
  user: UserClaims,
  token: string,
  req: Request,
  tokenCache: Map<string, { user: UserClaims; expiry: number }>,
  config: AuthenticationConfig
): void {
  req.user = user;
  req.token = token;

  if (config.token?.cacheEnabled && user.exp) {
    const cacheTtl = config.token.cacheTtl || 300;
    tokenCache.set(token, {
      user,
      expiry: Date.now() + cacheTtl * 1000,
    });
  }
}

/**
 * Handle missing token scenario
 */
function handleMissingToken(
  req: Request,
  res: Response,
  next: NextFunction,
  options: AuthMiddlewareOptions,
  config: AuthenticationConfig
): void {
  if (options.required === false) {
    next();
    return;
  }

  const error = new AuthenticationError('Authentication token is required', 'TOKEN_MISSING', 401);

  logAuthEvent('failure', config, {
    error,
    path: req.path,
  });

  if (options.onUnauthorized) {
    options.onUnauthorized(req, res);
    return;
  }

  res.status(401).json({
    error: 'Unauthorized',
    message: error.message,
    code: error.code,
  });
}

/**
 * Handle invalid token scenario
 */
function handleInvalidToken(
  req: Request,
  res: Response,
  result: ValidationResult,
  options: AuthMiddlewareOptions,
  config: AuthenticationConfig
): void {
  const error =
    result.error || new AuthenticationError('Token validation failed', 'TOKEN_INVALID', 401);

  logAuthEvent('failure', config, {
    error,
    path: req.path,
  });

  if (config.onError) {
    config.onError(error, req);
  }

  if (options.onUnauthorized) {
    options.onUnauthorized(req, res);
    return;
  }

  res.status(error.statusCode).json({
    error: 'Unauthorized',
    message: error.message,
    code: error.code,
  });
}

/**
 * Validate custom user validation function
 */
async function validateCustomUser(
  user: UserClaims,
  config: AuthenticationConfig,
  req: Request,
  res: Response
): Promise<boolean> {
  if (!config.validateUser) {
    return true;
  }

  const isValid = await config.validateUser(user);

  if (!isValid) {
    const error = new AuthenticationError('User validation failed', 'USER_VALIDATION_FAILED', 403);

    logAuthEvent('failure', config, {
      error,
      userId: user.sub,
      path: req.path,
    });

    res.status(403).json({
      error: 'Forbidden',
      message: error.message,
      code: error.code,
    });

    return false;
  }

  return true;
}

/**
 * Create authentication middleware
 * If no config provided, reads from environment variables
 */
export function createAuthMiddleware(
  config?: AuthenticationConfig,
  options: AuthMiddlewareOptions = {}
) {
  // Use env vars if no config provided
  const finalConfig: AuthenticationConfig = config || createConfigFromEnv();

  // Validate and create provider instance
  const provider = createProvider(finalConfig);

  // Token cache (optional)
  const tokenCache = new Map<string, { user: UserClaims; expiry: number }>();

  const middleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Check if path should skip auth
      if (options.skipPaths && shouldSkipAuth(req.path, options.skipPaths)) {
        next();
        return;
      }

      // Extract token from request
      const token = extractToken(req, finalConfig);

      if (!token) {
        handleMissingToken(req, res, next, options, finalConfig);
        return;
      }

      // Check cache first (if enabled)
      const cachedUser = checkTokenCache(token, tokenCache, req, finalConfig);
      if (cachedUser) {
        next();
        return;
      }

      // Validate token
      const result = await provider.validateToken(token);

      if (!result.valid || !result.user) {
        handleInvalidToken(req, res, result, options, finalConfig);
        return;
      }

      // Custom user validation
      const isUserValid = await validateCustomUser(result.user, finalConfig, req, res);
      if (!isUserValid) {
        return;
      }

      // Attach user and token to request + cache
      attachUserAndCache(result.user, token, req, tokenCache, finalConfig);

      // Log successful auth
      logAuthEvent('success', finalConfig, {
        userId: result.user.sub,
        path: req.path,
      });

      next();
    } catch (error) {
      const authError =
        error instanceof AuthenticationError
          ? error
          : new AuthenticationError(
              error instanceof Error ? error.message : 'Authentication failed',
              'UNKNOWN_ERROR',
              500,
              error
            );

      logAuthEvent('failure', finalConfig, {
        error: authError,
        path: req.path,
      });

      if (finalConfig.onError) {
        finalConfig.onError(authError, req);
      }

      res.status(authError.statusCode).json({
        error: 'Authentication Error',
        message: authError.message,
        code: authError.code,
      });
    }
  };

  return asyncHandler(middleware);
}

/**
 * Require authentication (shorthand for createAuthMiddleware with required: true)
 */
export function requireAuth(config: AuthenticationConfig, options: AuthMiddlewareOptions = {}) {
  return createAuthMiddleware(config, { ...options, required: true });
}

/**
 * Optional authentication (shorthand for createAuthMiddleware with required: false)
 */
export function optionalAuth(config: AuthenticationConfig, options: AuthMiddlewareOptions = {}) {
  return createAuthMiddleware(config, { ...options, required: false });
}

/**
 * Create authentication provider based on unified config
 */
function createProvider(config: AuthenticationConfig): AuthProvider {
  switch (config.provider) {
    case 'oidc':
      return new OidcProvider(createOidcConfig(config));

    case 'iap':
      return new IapProvider(createIapConfig(config));

    case 'entra-id':
      return new EntraIdProvider(createEntraIdConfig(config));

    default:
      throw new Error(`Unknown authentication provider: ${config.provider}`);
  }
}

/**
 * Extract user from request (helper for routes)
 */
export function getUser(req: Request): UserClaims | undefined {
  return req.user;
}

/**
 * Check if request is authenticated
 */
export function isAuthenticated(req: Request): boolean {
  return !!req.user;
}
