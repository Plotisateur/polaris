import type { IntegrationContext } from './logger.js';
import { integrateLogger } from './logger.js';
import { integrateAuthentication } from './authentication.js';
import { integrateCodeStyle } from './code-style.js';

export type { IntegrationContext };

export const integrations = {
  'code-style': integrateCodeStyle,
  logger: integrateLogger,
  authentication: integrateAuthentication,
};

export async function integrateModule(
  moduleName: 'code-style' | 'logger' | 'authentication',
  context: IntegrationContext
): Promise<void> {
  const integrationFn = integrations[moduleName];
  if (integrationFn) {
    await integrationFn(context);
  }
}
