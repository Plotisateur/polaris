import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { IntegrationContext } from './logger.js';

export async function integrateAuthentication(context: IntegrationContext): Promise<void> {
  const { projectPath, template } = context;

  if (template === 'backend') {
    await integrateAuthBackend(projectPath);
  } else if (template === 'frontend') {
    await integrateAuthFrontend(projectPath);
  } else if (template === 'fullstack') {
    await integrateAuthBackend(join(projectPath, 'apps/backend'));
    await integrateAuthFrontend(join(projectPath, 'apps/frontend'));
  }
}

async function integrateAuthBackend(backendPath: string): Promise<void> {
  // 1. Create auth config file
  const configDir = join(backendPath, 'src/config');
  const authConfigPath = join(configDir, 'auth.ts');
  const authConfigContent = `import { createAuthMiddleware } from '@polaris/authentication';

// Choose your provider: 'oidc', 'iap', or 'entra-id'
export const authMiddleware = createAuthMiddleware({
  provider: 'oidc',
  issuer: process.env['OIDC_ISSUER'] || '',
  clientId: process.env['OIDC_CLIENT_ID'] || '',
});
`;
  writeFileSync(authConfigPath, authConfigContent);

  // 2. Create auth routes
  const routesDir = join(backendPath, 'src/routes');
  mkdirSync(routesDir, { recursive: true });
  
  const authRoutesPath = join(routesDir, 'auth.ts');
  const authRoutesContent = `import { Router } from 'express';
import { createAuthRoutes } from '@polaris/authentication';

const router = Router();

// Mount auth routes (/login, /logout, /me)
router.use(createAuthRoutes());

export default router;
`;
  writeFileSync(authRoutesPath, authRoutesContent);

  // 3. Update app.ts to include auth routes
  const appPath = join(backendPath, 'src/app.ts');
  if (existsSync(appPath)) {
    let appContent = readFileSync(appPath, 'utf-8');
    
    // Add import after errorHandler import
    if (!appContent.includes('authRoutes')) {
      appContent = appContent.replace(
        /(import { errorHandler } from '\.\/middlewares\/errorHandler\.js';)/,
        `$1\nimport authRoutes from './routes/auth.js';`
      );
    }
    
    // Add routes before error handler
    if (!appContent.includes('/auth')) {
      appContent = appContent.replace(
        /(\/\/ Routes\n(?:\/\/ app\.use\('\/api\/v1', routes\);\n)?)/,
        `$1app.use('/auth', authRoutes);\n`
      );
    }
    
    writeFileSync(appPath, appContent);
  }

  // 4. Update .env.example
  const envExamplePath = join(backendPath, '.env.example');
  if (existsSync(envExamplePath)) {
    let envContent = readFileSync(envExamplePath, 'utf-8');
    if (!envContent.includes('OIDC_ISSUER')) {
      envContent += `\n# Authentication (OIDC example)\nOIDC_ISSUER=https://your-issuer.com\nOIDC_CLIENT_ID=your-client-id\n`;
      writeFileSync(envExamplePath, envContent);
    }
  }
}

async function integrateAuthFrontend(frontendPath: string): Promise<void> {
  // Create simple auth context
  const libDir = join(frontendPath, 'src/lib');
  mkdirSync(libDir, { recursive: true });
  
  const authContextPath = join(libDir, 'auth.tsx');
  const authContextContent = `import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    window.location.href = 'http://localhost:3001/auth/login';
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
`;
  writeFileSync(authContextPath, authContextContent);
}