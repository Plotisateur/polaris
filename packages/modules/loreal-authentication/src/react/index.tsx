import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import type { UserClaims } from '../config';

export interface AuthContextValue {
  user: UserClaims | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: () => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
  apiUrl?: string;
  loginUrl?: string;
  logoutUrl?: string;
  // eslint-disable-next-line no-unused-vars
  onAuthError?: (error: Error) => void;
}

export function AuthProvider({
  children,
  apiUrl = '/api',
  loginUrl = '/auth/login',
  logoutUrl = '/auth/logout',
  onAuthError,
}: AuthProviderProps) {
  const [user, setUser] = useState<UserClaims | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${apiUrl}/auth/me`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.status === 401) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Authentication failed');
      setError(error);
      onAuthError?.(error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, onAuthError]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = () => {
    window.location.href = loginUrl;
  };

  const logout = () => {
    window.location.href = logoutUrl;
  };

  const refreshToken = async () => {
    await fetchUser();
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    error,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useRequireAuth(): UserClaims {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/auth/login';
    }
  }, [isLoading, isAuthenticated]);

  if (!user) {
    throw new Error('User is not authenticated');
  }

  return user;
}

export interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  fallback = <div>Loading...</div>,
  redirectTo = '/auth/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isLoading, isAuthenticated, redirectTo]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
