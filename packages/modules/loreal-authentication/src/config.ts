/**
 * @polaris/authentication - Unified Configuration
 *
 * Unified API for all authentication providers
 * One config interface for OIDC, IAP, and Entra ID
 */

import type { Request, Response as ExpressResponse } from 'express';

// ============================================================================
// Provider-Specific Configuration Types
// ============================================================================

/**
 * OIDC (OpenID Connect) configuration
 * For Auth0, Keycloak, Okta, Google, etc.
 */
export interface OidcConfig {
  /** OIDC issuer URL (e.g., https://accounts.google.com) */
  issuer: string;

  /** Client ID (audience) */
  audience: string;

  /** JWKS URI for public key retrieval (optional, auto-discovered from issuer) */
  jwksUri?: string;

  /** Client secret (for confidential clients) */
  clientSecret?: string;

  /** Token endpoint (optional, auto-discovered) */
  tokenEndpoint?: string;

  /** Userinfo endpoint (optional, auto-discovered) */
  userinfoEndpoint?: string;

  /** Additional scopes to request */
  scopes?: string[];

  /** Clock tolerance in seconds (for exp/nbf validation) */
  clockTolerance?: number;
}

/**
 * Google Identity-Aware Proxy configuration
 * Zero configuration required!
 */
export interface IapConfig {
  // Intentionally empty - IAP is fully automatic
}

/**
 * Microsoft Entra ID (Azure AD) configuration
 */
export interface EntraIdConfig {
  /** Azure AD tenant ID or 'common', 'organizations', 'consumers' */
  tenantId: string;

  /** Application (client) ID */
  clientId: string;

  /** Client secret (for confidential clients) */
  clientSecret?: string;

  /** Expected audience (usually same as clientId) */
  audience?: string;

  /** Azure cloud instance (default: https://login.microsoftonline.com) */
  cloudInstance?: string;

  /** API version (default: v2.0) */
  apiVersion?: 'v1.0' | 'v2.0';

  /** Validate groups claim */
  validateGroups?: boolean;

  /** Clock tolerance in seconds */
  clockTolerance?: number;
}

// ============================================================================
// Unified Provider Type
// ============================================================================

export type AuthProvider = 'oidc' | 'iap' | 'entra-id';

// ============================================================================
// Unified User Claims (Standard across all providers)
// ============================================================================

export interface UserClaims {
  // Standard claims (available in all providers)
  sub: string; // Subject (user ID)
  email?: string; // Email address
  email_verified?: boolean; // Email verification status
  name?: string; // Full name
  given_name?: string; // First name
  family_name?: string; // Last name
  picture?: string; // Avatar/profile picture URL

  // Token metadata
  iss?: string; // Issuer
  aud?: string | string[]; // Audience
  exp?: number; // Expiration time (Unix timestamp)
  iat?: number; // Issued at (Unix timestamp)

  // Authorization (common across providers)
  roles?: string[]; // User roles
  groups?: string[]; // User groups
  permissions?: string[]; // User permissions

  // Organization (common concept)
  organization?: string; // Organization name
  tenant_id?: string; // Tenant ID (multi-tenant apps)

  // Allow additional custom claims
  [key: string]: unknown;
}

// ============================================================================
// Unified Authentication Configuration
// ============================================================================

export interface AuthenticationConfig {
  /**
   * Authentication provider type
   * @example 'oidc' | 'iap' | 'entra-id'
   */
  provider: AuthProvider;

  /**
   * Issuer URL (required for OIDC and Entra ID)
   *
   * - OIDC: Your identity provider URL (e.g., https://accounts.google.com)
   * - Entra ID: https://login.microsoftonline.com/{tenantId}/v2.0
   * - IAP: Not used
   *
   * @example 'https://accounts.google.com'
   * @example 'https://auth.loreal.com'
   */
  issuer?: string;

  /**
   * Client ID / Application ID / Audience
   *
   * - OIDC: Your OAuth client ID
   * - Entra ID: Your application (client) ID
   * - IAP: Not used (uses project number instead)
   *
   * @example 'your-client-id.apps.googleusercontent.com'
   * @example 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6'
   */
  clientId?: string;

  /**
   * Client Secret (for confidential clients)
   * Optional, only needed for server-to-server authentication
   */
  clientSecret?: string;

  /**
   * Tenant ID (required for Entra ID only)
   * Can be: specific tenant ID, 'common', 'organizations', or 'consumers'
   * @example 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6'
   * @example 'common'
   */
  tenantId?: string;

  /**
   * Cloud Instance (Entra ID only)
   * @default 'https://login.microsoftonline.com'
   */
  cloudInstance?: string;

  /**
   * JWKS URI for public key retrieval (optional, auto-discovered)
   * Only needed if auto-discovery fails
   */
  jwksUri?: string;

  /**
   * Clock tolerance in seconds (for exp/nbf validation)
   * @default 30
   */
  clockTolerance?: number;

  /**
   * Additional scopes to request (optional)
   * @example ['profile', 'email', 'openid']
   */
  scopes?: string[];

  // ============================================================================
  // Token Configuration
  // ============================================================================

  token?: {
    /** HTTP header name for token @default 'Authorization' */
    header?: string;

    /** Cookie name for token (optional, checked if header not found) */
    cookieName?: string;

    /** Enable token caching for performance @default true */
    cacheEnabled?: boolean;

    /** Token cache TTL in seconds @default 300 */
    cacheTtl?: number;
  };

  // ============================================================================
  // Session Configuration (Optional)
  // ============================================================================

  session?: {
    /** Enable session management @default false */
    enabled?: boolean;

    /** Session secret for signing */
    secret?: string;

    /** Session max age in milliseconds @default 86400000 (24h) */
    maxAge?: number;

    /** Redis URL for distributed sessions (optional) */
    redis?: string;
  };

  // ============================================================================
  // Logging Configuration
  // ============================================================================

  logging?: {
    /** Enable authentication logging @default true */
    enabled?: boolean;

    /** Log successful authentication @default true */
    logSuccessfulAuth?: boolean;

    /** Log failed authentication @default true */
    logFailedAuth?: boolean;

    /** Log token refresh events @default false */
    logTokenRefresh?: boolean;
  };

  // ============================================================================
  // Advanced Configuration
  // ============================================================================

  /**
   * Custom user claims validator
   * Return true to allow, false to reject
   */
  // eslint-disable-next-line no-unused-vars
  validateUser?: (user: UserClaims) => boolean | Promise<boolean>;

  /**
   * Custom error handler
   */
  // eslint-disable-next-line no-unused-vars
  onError?: (error: AuthenticationError, req: Request) => void;

  /**
   * Provider-specific advanced configuration
   * Use this for provider-specific features not covered by the unified API
   */
  advanced?: {
    /** OIDC: Token endpoint URL */
    tokenEndpoint?: string;

    /** OIDC: Userinfo endpoint URL */
    userinfoEndpoint?: string;

    /** Entra ID: API version */
    entraApiVersion?: 'v1.0' | 'v2.0';

    /** Entra ID: Validate groups claim */
    entraValidateGroups?: boolean;

    /** IAP: Expected audience override */
    iapAudience?: string;

    /** IAP: Validate signature */
    iapValidateSignature?: boolean;
  };
}

// ============================================================================
// Middleware Options
// ============================================================================

export interface AuthMiddlewareOptions {
  /** Skip authentication for specific paths */
  skipPaths?: (string | RegExp)[];

  /** Require authentication (throw error if missing) @default true */
  required?: boolean;

  /** Custom unauthorized handler */
  // eslint-disable-next-line no-unused-vars
  onUnauthorized?: (req: Request, res: ExpressResponse) => void;
}

// ============================================================================
// Error Types
// ============================================================================

export type AuthErrorCode =
  | 'TOKEN_MISSING'
  | 'TOKEN_INVALID'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_MALFORMED'
  | 'SIGNATURE_INVALID'
  | 'AUDIENCE_INVALID'
  | 'ISSUER_INVALID'
  | 'JWKS_ERROR'
  | 'USER_VALIDATION_FAILED'
  | 'PROVIDER_CONFIG_INVALID'
  | 'UNKNOWN_ERROR';

export class AuthenticationError extends Error {
  constructor(
    message: string,
    // eslint-disable-next-line no-unused-vars
    public code: AuthErrorCode,
    // eslint-disable-next-line no-unused-vars
    public statusCode: number = 401,
    // eslint-disable-next-line no-unused-vars
    public details?: unknown
  ) {
    super(message);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

// ============================================================================
// Validation Result
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  user?: UserClaims;
  error?: AuthenticationError;
}

// ============================================================================
// Request Extension
// ============================================================================

declare global {
  namespace Express {
    interface Request {
      user?: UserClaims;
      token?: string;
    }
  }
}

// ============================================================================
// Configuration Helpers
// ============================================================================

/**
 * Create OIDC configuration from unified config
 */
export function createOidcConfig(config: AuthenticationConfig) {
  if (!config.issuer) {
    throw new Error('OIDC provider requires "issuer" field');
  }
  if (!config.clientId) {
    throw new Error('OIDC provider requires "clientId" field');
  }

  return {
    issuer: config.issuer,
    audience: config.clientId,
    jwksUri: config.jwksUri,
    clientSecret: config.clientSecret,
    tokenEndpoint: config.advanced?.tokenEndpoint,
    userinfoEndpoint: config.advanced?.userinfoEndpoint,
    scopes: config.scopes,
    clockTolerance: config.clockTolerance,
  };
}

/**
 * Create IAP configuration from unified config
 * IAP requires zero configuration!
 */
export function createIapConfig(_config: AuthenticationConfig) {
  return {}; // No config needed - audience auto-detected from JWT
}

/**
 * Create Entra ID configuration from unified config
 */
export function createEntraIdConfig(config: AuthenticationConfig) {
  if (!config.tenantId) {
    throw new Error('Entra ID provider requires "tenantId" field');
  }
  if (!config.clientId) {
    throw new Error('Entra ID provider requires "clientId" field');
  }

  return {
    tenantId: config.tenantId,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    audience: config.clientId, // Usually same as clientId
    cloudInstance: config.cloudInstance || 'https://login.microsoftonline.com',
    apiVersion: config.advanced?.entraApiVersion || 'v2.0',
    validateGroups: config.advanced?.entraValidateGroups,
    clockTolerance: config.clockTolerance,
  };
}
