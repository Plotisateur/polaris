/**
 * @polaris/authentication - Entra ID Provider
 *
 * Microsoft Entra ID (Azure AD) authentication provider
 * Validates JWT tokens from Azure Active Directory
 */

import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

import type { EntraIdConfig, UserClaims, ValidationResult } from '../config';
import { AuthenticationError } from '../config';

export class EntraIdProvider {
  private jwksClient: jwksClient.JwksClient;
  private config: EntraIdConfig;
  private issuer: string;

  constructor(config: EntraIdConfig) {
    this.config = config;

    // Build issuer URL based on cloud instance and tenant
    const cloudInstance = config.cloudInstance || 'https://login.microsoftonline.com';
    const apiVersion = config.apiVersion || 'v2.0';
    this.issuer = `${cloudInstance}/${config.tenantId}/${apiVersion}`;

    // Build JWKS URI
    const jwksUri = `${cloudInstance}/${config.tenantId}/discovery/${apiVersion}/keys`;

    this.jwksClient = jwksClient({
      jwksUri,
      cache: true,
      cacheMaxAge: 24 * 60 * 60 * 1000,
      rateLimit: true,
      jwksRequestsPerMinute: 10,
    });
  }

  /**
   * Validate Entra ID JWT token
   */
  async validateToken(token: string): Promise<ValidationResult> {
    try {
      // Decode token header
      const decoded = jwt.decode(token, { complete: true });

      if (!decoded || typeof decoded === 'string') {
        return {
          valid: false,
          error: new AuthenticationError('Invalid Entra ID token format', 'TOKEN_MALFORMED', 401),
        };
      }

      // Get signing key
      const key = await this.getSigningKey(decoded.header.kid);

      // Expected audience (usually the client ID)
      const audience = this.config.audience || this.config.clientId;

      // Verify token
      const payload = jwt.verify(token, key, {
        issuer: this.issuer,
        audience,
        clockTolerance: this.config.clockTolerance || 30,
        algorithms: ['RS256'],
      }) as Record<string, unknown>;

      // Extract and validate claims
      const user = this.extractUserClaims(payload);

      if (!user.sub && !user['oid']) {
        return {
          valid: false,
          error: new AuthenticationError(
            'Entra ID token missing subject or object ID claim',
            'TOKEN_INVALID',
            401
          ),
        };
      }

      // Validate groups if configured
      if (this.config.validateGroups && !payload['groups'] && !payload['roles']) {
        return {
          valid: false,
          error: new AuthenticationError(
            'Entra ID token missing groups/roles claim',
            'TOKEN_INVALID',
            401
          ),
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
   * Get signing key from Microsoft's JWKS
   */
  private async getSigningKey(kid?: string): Promise<string> {
    try {
      if (!kid) {
        throw new Error('Entra ID token missing key ID (kid)');
      }

      const key = await this.jwksClient.getSigningKey(kid);
      return key.getPublicKey();
    } catch (error) {
      throw new AuthenticationError(
        `Failed to get Entra ID signing key: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'JWKS_ERROR',
        401,
        error
      );
    }
  }

  /**
   * Extract user claims from Entra ID token payload
   */
  private extractUserClaims(payload: Record<string, unknown>): UserClaims {
    // Entra ID uses 'oid' (object ID) as the primary user identifier
    // 'sub' may be different for each app, 'oid' is consistent across apps
    const sub = String(payload['oid'] || payload['sub'] || '');

    return {
      sub,
      oid: payload['oid'] as string | undefined,
      email:
        (payload['email'] as string | undefined) ||
        (payload['preferred_username'] as string | undefined),
      email_verified: true, // Entra ID emails are verified
      name: payload['name'] as string | undefined,
      given_name: payload['given_name'] as string | undefined,
      family_name: payload['family_name'] as string | undefined,

      // Entra ID-specific claims
      iss: payload['iss'] as string | undefined,
      aud: payload['aud'] as string | string[] | undefined,
      exp: payload['exp'] as number | undefined,
      iat: payload['iat'] as number | undefined,
      nbf: payload['nbf'] as number | undefined,

      // Azure-specific
      tid: payload['tid'] as string | undefined, // Tenant ID
      uti: payload['uti'] as string | undefined, // Unique token identifier
      rh: payload['rh'] as string | undefined, // Refresh token hash

      // Authorization
      roles: payload['roles'] as string[] | undefined,
      groups: payload['groups'] as string[] | undefined,

      // App-specific
      idtyp: payload['idtyp'] as string | undefined, // Token type (app, user)
      azp: payload['azp'] as string | undefined, // Authorized party
      azpacr: payload['azpacr'] as string | undefined, // Auth context class reference

      // Organization
      tenant_id: payload['tid'] as string | undefined,

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
        error: new AuthenticationError('Entra ID token has expired', 'TOKEN_EXPIRED', 401, error),
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
          `Entra ID token validation failed: ${error.message}`,
          code,
          401,
          error
        ),
      };
    }

    return {
      valid: false,
      error: new AuthenticationError(
        error instanceof Error ? error.message : 'Unknown Entra ID validation error',
        'UNKNOWN_ERROR',
        401,
        error
      ),
    };
  }

  /**
   * Get Microsoft Graph API user profile
   * Requires access token with User.Read scope
   */
  async fetchUserProfile(accessToken: string): Promise<Record<string, unknown> | null> {
    try {
      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Graph API request failed: ${response.statusText}`);
      }

      return (await response.json()) as Record<string, unknown>;
    } catch (error) {
      console.error('Failed to fetch user profile from Microsoft Graph:', error);
      return null;
    }
  }

  /**
   * Get user's photo from Microsoft Graph
   */
  async fetchUserPhoto(accessToken: string): Promise<string | null> {
    try {
      const response = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');

      return `data:${blob.type};base64,${base64}`;
    } catch (error) {
      console.error('Failed to fetch user photo from Microsoft Graph:', error);
      return null;
    }
  }
}
