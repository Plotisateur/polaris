/**
 * @polaris/authentication
 *
 * L'Oréal Authentication Module
 * Unified API for OIDC, Google IAP, and Microsoft Entra ID authentication for Express.js
 *
 * @example
 * ```typescript
 * import { createAuthMiddleware } from '@polaris/authentication';
 *
 * // OIDC Example
 * const authMiddleware = createAuthMiddleware({
 *   provider: 'oidc',
 *   issuer: process.env.OIDC_ISSUER,
 *   clientId: process.env.OIDC_CLIENT_ID,
 * });
 *
 * // IAP Example
 * const authMiddleware = createAuthMiddleware({
 *   provider: 'iap',
 *   projectNumber: process.env.IAP_PROJECT_NUMBER,
 *   backendServiceId: process.env.IAP_BACKEND_SERVICE_ID,
 * });
 *
 * // Entra ID Example
 * const authMiddleware = createAuthMiddleware({
 *   provider: 'entra-id',
 *   tenantId: process.env.ENTRA_TENANT_ID,
 *   clientId: process.env.ENTRA_CLIENT_ID,
 * });
 *
 * app.use(authMiddleware);
 * ```
 */

// ============================================================================
// Unified Configuration (Primary API)
// ============================================================================

export type {
  AuthProvider,
  UserClaims,
  AuthenticationConfig,
  AuthMiddlewareOptions,
  ValidationResult,
  AuthErrorCode,
} from './config';

export { AuthenticationError } from './config';

// ============================================================================
// Unified Middleware (Primary API)
// ============================================================================

export {
  createAuthMiddleware,
  requireAuth,
  optionalAuth,
  getUser,
  isAuthenticated,
} from './middleware';

// ============================================================================
// Express Routes for Frontend Integration
// ============================================================================

export { createAuthRoutes, corsMiddleware } from './routes';

// ============================================================================
// Advanced: Direct Provider Access
// ============================================================================

export { OidcProvider } from './providers/oidc';
export { IapProvider } from './providers/iap';
export { EntraIdProvider } from './providers/entra-id';

// ============================================================================
// Environment Configuration
// ============================================================================

export { createConfigFromEnv } from './env';

// ============================================================================
// Advanced: Provider-Specific Types (for advanced usage)
// ============================================================================

export type { OidcConfig, IapConfig, EntraIdConfig } from './config';

// ============================================================================
// Utilities
// ============================================================================

export { extractToken, isTokenExpired, isTokenExpiringSoon, redactUserClaims } from './utils';
