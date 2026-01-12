/**
 * @polaris/authentication - OIDC Provider
 *
 * OpenID Connect authentication provider
 * Supports Auth0, Keycloak, Okta, Google, and any OIDC-compliant provider
 */

import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

import type { OidcConfig, UserClaims, ValidationResult } from '../config';
import { AuthenticationError as AuthError } from '../config';
import { buildJwksUri } from '../utils';

export class OidcProvider {
  private jwksClient: jwksClient.JwksClient;
  private config: OidcConfig;

  constructor(config: OidcConfig) {
    this.config = config;

    // Initialize JWKS client for fetching public keys
    const jwksUri = config.jwksUri || buildJwksUri(config.issuer, 'oidc');

    this.jwksClient = jwksClient({
      jwksUri,
      cache: true,
      cacheMaxAge: 24 * 60 * 60 * 1000, // 24 hours
      rateLimit: true,
      jwksRequestsPerMinute: 10,
    });
  }

  /**
   * Validate JWT token and extract user claims
   */
  async validateToken(token: string): Promise<ValidationResult> {
    try {
      // Decode token to get header (for key ID)
      const decoded = jwt.decode(token, { complete: true });

      if (!decoded || typeof decoded === 'string') {
        return {
          valid: false,
          error: new AuthError('Invalid token format', 'TOKEN_MALFORMED', 401),
        };
      }

      // Get signing key from JWKS
      const key = await this.getSigningKey(decoded.header.kid);

      // Verify token signature and claims
      const payload = jwt.verify(token, key, {
        issuer: this.config.issuer,
        audience: this.config.audience,
        clockTolerance: this.config.clockTolerance || 30,
        algorithms: ['RS256', 'RS384', 'RS512'],
      }) as UserClaims;

      // Additional validation
      if (!payload.sub) {
        return {
          valid: false,
          error: new AuthError('Token missing subject claim', 'TOKEN_INVALID', 401),
        };
      }

      return {
        valid: true,
        user: payload,
      };
    } catch (error) {
      return this.handleValidationError(error);
    }
  }

  /**
   * Get signing key from JWKS
   */
  private async getSigningKey(kid?: string): Promise<string> {
    try {
      if (!kid) {
        throw new Error('Token missing key ID (kid)');
      }

      const key = await this.jwksClient.getSigningKey(kid);
      return key.getPublicKey();
    } catch (error) {
      throw new AuthError(
        `Failed to get signing key: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'JWKS_ERROR',
        401,
        error
      );
    }
  }

  /**
   * Handle validation errors
   */
  private handleValidationError(error: unknown): ValidationResult {
    if (error instanceof AuthError) {
      return { valid: false, error };
    }

    if (error instanceof jwt.TokenExpiredError) {
      return {
        valid: false,
        error: new AuthError('Token has expired', 'TOKEN_EXPIRED', 401, error),
      };
    }

    if (error instanceof jwt.JsonWebTokenError) {
      const code = error.message.includes('audience')
        ? 'AUDIENCE_INVALID'
        : error.message.includes('issuer')
          ? 'ISSUER_INVALID'
          : error.message.includes('signature')
            ? 'SIGNATURE_INVALID'
            : 'TOKEN_INVALID';

      return {
        valid: false,
        error: new AuthError(error.message, code, 401, error),
      };
    }

    return {
      valid: false,
      error: new AuthError(
        error instanceof Error ? error.message : 'Unknown validation error',
        'UNKNOWN_ERROR',
        401,
        error
      ),
    };
  }

  /**
   * Fetch user info from OIDC userinfo endpoint
   * Optional: for getting additional user claims not in JWT
   */
  async fetchUserInfo(accessToken: string): Promise<UserClaims | null> {
    if (!this.config.userinfoEndpoint) {
      return null;
    }

    try {
      const response = await fetch(this.config.userinfoEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Userinfo request failed: ${response.statusText}`);
      }

      return (await response.json()) as UserClaims;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      return null;
    }
  }

  /**
   * Discover OIDC configuration from issuer
   * Fetches .well-known/openid-configuration
   */
  static async discover(issuer: string): Promise<{
    jwksUri: string;
    tokenEndpoint: string;
    userinfoEndpoint: string;
    issuer: string;
  }> {
    const discoveryUrl = `${issuer.replace(/\/$/, '')}/.well-known/openid-configuration`;

    try {
      const response = await fetch(discoveryUrl);

      if (!response.ok) {
        throw new Error(`Discovery failed: ${response.statusText}`);
      }

      const config = (await response.json()) as {
        jwks_uri: string;
        token_endpoint: string;
        userinfo_endpoint: string;
        issuer: string;
      };

      return {
        jwksUri: config.jwks_uri,
        tokenEndpoint: config.token_endpoint,
        userinfoEndpoint: config.userinfo_endpoint,
        issuer: config.issuer,
      };
    } catch (error) {
      throw new AuthError(
        `Failed to discover OIDC configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'PROVIDER_CONFIG_INVALID',
        500,
        error
      );
    }
  }
}
