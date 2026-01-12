/**
 * @polaris/authentication - IAP Provider
 *
 * Google Identity-Aware Proxy authentication provider
 * Validates JWT tokens signed by Google IAP
 */

import type { Request } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

import type { IapConfig, UserClaims, ValidationResult } from '../config';
import { AuthenticationError } from '../config';

export class IapProvider {
  private jwksClient: jwksClient.JwksClient;
  private expectedAudience?: string; // Auto-detected from first token

  constructor(_config: IapConfig) {
    // Google IAP JWKS endpoint
    this.jwksClient = jwksClient({
      jwksUri: 'https://www.gstatic.com/iap/verify/public_key-jwk',
      cache: true,
      cacheMaxAge: 24 * 60 * 60 * 1000,
      rateLimit: true,
      jwksRequestsPerMinute: 10,
    });
  }

  /**
   * Validate IAP JWT token
   */
  async validateToken(token: string): Promise<ValidationResult> {
    try {
      // Decode token header and payload (without verification yet)
      const decoded = jwt.decode(token, { complete: true });

      if (!decoded || typeof decoded === 'string') {
        return {
          valid: false,
          error: new AuthenticationError('Invalid IAP token format', 'TOKEN_MALFORMED', 401),
        };
      }

      // Auto-detect audience from first token
      if (!this.expectedAudience && typeof decoded.payload === 'object' && decoded.payload.aud) {
        this.expectedAudience = decoded.payload.aud as string;
      }

      // Get signing key
      const key = await this.getSigningKey(decoded.header.kid);

      // Verify token (audience will be validated automatically)
      const payload = jwt.verify(token, key, {
        issuer: 'https://cloud.google.com/iap',
        audience: this.expectedAudience,
        algorithms: ['ES256'], // IAP uses ES256
      }) as Record<string, unknown>;

      // Extract and validate IAP-specific claims
      const user = this.extractUserClaims(payload);

      if (!user.sub) {
        return {
          valid: false,
          error: new AuthenticationError('IAP token missing subject claim', 'TOKEN_INVALID', 401),
        };
      }

      return {
        valid: true,
        user,
      };
    } catch (error) {
      return this.handleValidationError(error);
    }
  }

  /**
   * Get signing key from Google's JWKS
   */
  private async getSigningKey(kid?: string): Promise<string> {
    try {
      if (!kid) {
        throw new Error('IAP token missing key ID (kid)');
      }

      const key = await this.jwksClient.getSigningKey(kid);
      return key.getPublicKey();
    } catch (error) {
      throw new AuthenticationError(
        `Failed to get IAP signing key: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'JWKS_ERROR',
        401,
        error
      );
    }
  }

  /**
   * Extract user claims from IAP token payload
   */
  private extractUserClaims(payload: Record<string, unknown>): UserClaims {
    return {
      sub: String(payload['sub'] || ''),
      email: payload['email'] as string | undefined,
      email_verified: payload['email_verified'] as boolean | undefined,
      name: payload['name'] as string | undefined,
      given_name: payload['given_name'] as string | undefined,
      family_name: payload['family_name'] as string | undefined,
      picture: payload['picture'] as string | undefined,

      // IAP-specific claims
      iss: payload['iss'] as string | undefined,
      aud: payload['aud'] as string | string[] | undefined,
      exp: payload['exp'] as number | undefined,
      iat: payload['iat'] as number | undefined,

      // Google-specific
      hd: payload['hd'] as string | undefined, // Hosted domain (for Google Workspace)

      // Preserve all original claims
      ...payload,
    } as UserClaims;
  }

  /**
   * Handle validation errors
   */
  private handleValidationError(error: unknown): ValidationResult {
    if (error instanceof AuthenticationError) {
      return { valid: false, error };
    }

    if (error instanceof jwt.TokenExpiredError) {
      return {
        valid: false,
        error: new AuthenticationError('IAP token has expired', 'TOKEN_EXPIRED', 401, error),
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
        error: new AuthenticationError(
          `IAP token validation failed: ${error.message}`,
          code,
          401,
          error
        ),
      };
    }

    return {
      valid: false,
      error: new AuthenticationError(
        error instanceof Error ? error.message : 'Unknown IAP validation error',
        'UNKNOWN_ERROR',
        401,
        error
      ),
    };
  }

  /**
   * Extract IAP-specific headers from request
   * IAP also provides user info in X-Goog-IAP-JWT-Assertion header
   */
  static extractIapHeaders(req: Request): {
    jwtAssertion?: string;
    authenticatedUserEmail?: string;
    authenticatedUserId?: string;
  } {
    const getHeader = (name: string): string | undefined => {
      const value = req.headers[name];
      return Array.isArray(value) ? value[0] : value;
    };

    return {
      jwtAssertion: getHeader('x-goog-iap-jwt-assertion'),
      authenticatedUserEmail: getHeader('x-goog-authenticated-user-email'),
      authenticatedUserId: getHeader('x-goog-authenticated-user-id'),
    };
  }
}
