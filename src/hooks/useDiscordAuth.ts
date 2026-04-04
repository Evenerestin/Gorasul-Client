import config from '../config/config';

export function useDiscordAuth() {
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code&scope=identify+guilds`;
  const redirect = () => {
    window.location.href = discordAuthUrl;
  };
  return { discordAuthUrl, redirect };
}
