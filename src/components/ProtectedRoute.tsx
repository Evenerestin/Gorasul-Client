import { useEffect } from 'react';
import { useLocation } from 'react-router';
import config from '../config/config';
import { useAuth } from '../contexts/useAuth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !import.meta.env.DEV) {
      const redirectUri = `${config.api}/auth/discord/callback?redirect=${location.pathname}`;
      const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify+guilds`;
      window.location.href = discordUrl;
    }
  }, [isLoading, isAuthenticated, location.pathname]);

  if (isLoading || (!isAuthenticated && !import.meta.env.DEV)) return null;

  return <>{children}</>;
}
