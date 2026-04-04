const config = {
  api: import.meta.env.VITE_API_URL,
  redirectUri: `${import.meta.env.VITE_API_URL}/auth/discord/callback`,
  clientId: import.meta.env.VITE_DISCORD_CLIENT_ID
};

export default config;
