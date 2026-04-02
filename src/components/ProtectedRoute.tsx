import { Navigate } from 'react-router';
import { useAuth } from '../contexts/useAuth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated && !import.meta.env.DEV) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
