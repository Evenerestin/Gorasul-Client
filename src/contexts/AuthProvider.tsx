import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import api from '../lib/api';
import { AuthContext, type AuthContextType, type User } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api
      .get('/auth/me')
      .then((res) => {
        setUser(res.data.user);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handleAuthSuccess = (event: CustomEvent) => {
      setUser(event.detail);
      setIsAuthenticated(true);
    };

    window.addEventListener('auth-success', handleAuthSuccess as EventListener);
    return () => window.removeEventListener('auth-success', handleAuthSuccess as EventListener);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    api.post('/auth/logout').finally(() => {
      setUser(null);
      setIsAuthenticated(false);
    });
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
