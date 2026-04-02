import { createContext } from 'react';

export interface User {
  id: string;
  username: string;
  avatar?: string;
  isAdmin?: boolean;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
