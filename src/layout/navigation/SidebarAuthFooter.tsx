import { IconLogin, IconLogout } from '@tabler/icons-react';
import { useAuth } from '../../contexts/useAuth';

function buildDiscordLoginUrl() {
  const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/discord/callback`;
  return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`;
}

export default function SidebarAuthFooter({
  collapsed,
  onLogout
}: {
  collapsed?: boolean;
  onLogout?: () => void;
}) {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  const handleLogin = () => {
    window.location.href = buildDiscordLoginUrl();
  };

  return (
    <div className="border-t border-white/20 px-3 py-4 mt-2">
      {isAuthenticated ? (
        <>
          <p
            className={`text-white/60 text-[11px] px-3 mb-3 overflow-hidden whitespace-nowrap transition-all duration-300 ${
              collapsed ? 'opacity-0 w-0 h-0' : 'opacity-100'
            }`}
          >
            Zalogowany: {user?.username}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 rounded-lg bg-white/10 py-2 px-3 text-[13px] font-medium text-white hover:bg-white/20 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              collapsed ? 'justify-center' : ''
            }`}
            aria-label="Wyloguj się"
            title={collapsed ? 'Wyloguj się' : undefined}
          >
            <span className="flex shrink-0 items-center">
              <IconLogout size={18} stroke={1.5} />
            </span>
            {!collapsed && <span className="overflow-hidden whitespace-nowrap">Wyloguj się</span>}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={handleLogin}
          className={`w-full flex items-center gap-2 rounded-lg bg-red-primary dark:bg-red-primary-light py-2 px-3 text-[13px] font-medium text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            collapsed ? 'justify-center' : ''
          }`}
          aria-label="Zaloguj się przez Discord"
          title={collapsed ? 'Zaloguj się' : undefined}
        >
          <span className="flex shrink-0 items-center">
            <IconLogin size={18} stroke={1.5} />
          </span>
          {!collapsed && <span className="overflow-hidden whitespace-nowrap">Zaloguj się</span>}
        </button>
      )}
    </div>
  );
}
