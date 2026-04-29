const DEFAULT_CLIENT_URL = 'http://localhost:5173';

export const getPrimaryClientUrl = (): string => {
  const configuredOrigins = (process.env.CLIENT_URL || DEFAULT_CLIENT_URL)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return configuredOrigins[0] || DEFAULT_CLIENT_URL;
};

