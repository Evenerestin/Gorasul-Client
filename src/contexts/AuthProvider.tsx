import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import api from '../lib/api';
import { AuthContext, type AuthContextType, type User } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const authSetByCallback = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((res) => {
        setUser(res.data.user);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handleAuthSuccess = (event: CustomEvent) => {
      authSetByCallback.current = true;
      setUser(event.detail);
      setIsAuthenticated(true);
      setIsLoading(false);
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
