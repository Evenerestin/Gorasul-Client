import { Navigate, useSearchParams } from 'react-router';
import { useAuth } from '../contexts/useAuth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const hasToken = searchParams.has('token');

  if (isLoading) return null;

  if (!isAuthenticated && !hasToken && !import.meta.env.DEV) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
