import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export interface IntegrationContext {
  projectPath: string;
  template: 'backend' | 'frontend' | 'fullstack';
}

export async function integrateLogger(context: IntegrationContext): Promise<void> {
  const { projectPath, template } = context;

  if (template === 'backend') {
    await integrateLoggerBackend(projectPath);
  } else if (template === 'frontend') {
    await integrateLoggerFrontend(projectPath);
  } else if (template === 'fullstack') {
    await integrateLoggerBackend(join(projectPath, 'apps/backend'));
    await integrateLoggerFrontend(join(projectPath, 'apps/frontend'));
  }
}

async function integrateLoggerBackend(backendPath: string): Promise<void> {
  // 1. Create logger instance file
  const configDir = join(backendPath, 'src/config');
  const loggerFilePath = join(configDir, 'logger.ts');
  const loggerContent = `import { logger } from '@polaris/logger';

export { logger };
`;
  writeFileSync(loggerFilePath, loggerContent);

  // 2. Update server.ts to use logger
  const serverPath = join(backendPath, 'src/server.ts');
  if (existsSync(serverPath)) {
    let serverContent = readFileSync(serverPath, 'utf-8');
    
    // Add import
    if (!serverContent.includes('logger')) {
      serverContent = `import { logger } from './config/logger.js';\n` + serverContent;
    }
    
    // Replace console.log with logger
    serverContent = serverContent.replace(
      /console\.log\(`Server running on http:\/\/localhost:\$\{port\}`\);/,
      `logger.info('Server started', { port });`
    );
    
    writeFileSync(serverPath, serverContent);
  }

  // 3. Update errorHandler to use logger
  const errorHandlerPath = join(backendPath, 'src/middlewares/errorHandler.ts');
  if (existsSync(errorHandlerPath)) {
    let errorContent = readFileSync(errorHandlerPath, 'utf-8');
    
    // Add import
    if (!errorContent.includes('logger')) {
      errorContent = `import { logger } from '../config/logger.js';\n` + errorContent;
    }
    
    // Replace console.error with logger
    errorContent = errorContent.replace(
      /console\.error\(err\.stack\);/,
      `logger.error('Request error', err);`
    );
    
    writeFileSync(errorHandlerPath, errorContent);
  }
}

async function integrateLoggerFrontend(frontendPath: string): Promise<void> {
  // For frontend, create a simple console wrapper
  const loggerFilePath = join(frontendPath, 'src/lib/logger.ts');
  const loggerContent = `// Simple logger for frontend (can be enhanced with @polaris/logger later)
export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    console.log(\`[INFO] \${message}\`, meta || '');
  },
  error: (message: string, error?: Error | unknown) => {
    console.error(\`[ERROR] \${message}\`, error || '');
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    console.warn(\`[WARN] \${message}\`, meta || '');
  },
  debug: (message: string, meta?: Record<string, unknown>) => {
    console.debug(\`[DEBUG] \${message}\`, meta || '');
  },
};
`;
  writeFileSync(loggerFilePath, loggerContent);
}
