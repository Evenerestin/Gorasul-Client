import { Navigate } from 'react-router';
import { useAuth } from '../contexts/useAuth';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (import.meta.env.DEV) return <>{children}</>;

  if (isLoading) return null;

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!user?.isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}
