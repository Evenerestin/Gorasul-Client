const config = {
  api: import.meta.env.VITE_API_URL,
  redirectUri: `${window.location.origin}/auth/callback`,
  clientId: import.meta.env.VITE_DISCORD_CLIENT_ID
};

export default config;
