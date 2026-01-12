import type { AuthenticationConfig } from './config';

/**
 * Creates authentication config from environment variables
 * Uses unified variable names that work across providers
 */
export function createConfigFromEnv(): AuthenticationConfig {
  const provider = process.env['AUTH_PROVIDER'] as 'oidc' | 'iap' | 'entra-id';

  if (!provider) {
    throw new Error('AUTH_PROVIDER environment variable is required');
  }

  const config: AuthenticationConfig = {
    provider,
    clientId: process.env['CLIENT_ID'],
    clientSecret: process.env['CLIENT_SECRET'],
    issuer: process.env['ISSUER'],
    tenantId: process.env['TENANT_ID'],
    cloudInstance: process.env['CLOUD_INSTANCE'],
    clockTolerance: process.env['CLOCK_TOLERANCE']
      ? parseInt(process.env['CLOCK_TOLERANCE'])
      : undefined,
    token: {
      cacheEnabled: process.env['TOKEN_CACHE_ENABLED'] === 'true',
      cacheTtl: process.env['TOKEN_CACHE_TTL']
        ? parseInt(process.env['TOKEN_CACHE_TTL'])
        : undefined,
    },
    logging: {
      enabled: process.env['LOG_ENABLED'] === 'true',
    },
  };

  return config;
}
