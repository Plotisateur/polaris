import type { Request, Response, NextFunction } from 'express';

import type { UserClaims } from './config';

export interface AuthRouterOptions {
  loginUrl?: string;
  logoutUrl?: string;
  callbackUrl?: string;
}

export function createAuthRoutes(options: AuthRouterOptions = {}) {
  const {
    loginUrl = '/auth/login',
    logoutUrl = '/auth/logout',
    callbackUrl = '/auth/callback',
  } = options;

  return {
    me: (req: Request, res: Response): void => {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const user = req.user as UserClaims;

      const sanitizedUser = {
        sub: user.sub,
        email: user.email,
        name: user.name,
        given_name: user.given_name,
        family_name: user.family_name,
        picture: user.picture,
        roles: user.roles,
        permissions: user.permissions,
        metadata: user['metadata'],
      };

      res.json(sanitizedUser);
    },

    refresh: async (req: Request, res: Response): Promise<void> => {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      res.json({ success: true, user: req.user });
    },

    login: (_req: Request, res: Response) => {
      res.redirect(loginUrl);
    },

    logout: (_req: Request, res: Response) => {
      res.redirect(logoutUrl);
    },

    callback: (_req: Request, res: Response) => {
      res.redirect(callbackUrl);
    },
  };
}

export function corsMiddleware(
  allowedOrigins: string[] = ['http://localhost:3000', 'http://localhost:5173']
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }

    next();
  };
}
