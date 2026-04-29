const DEFAULT_CLIENT_URL = 'http://localhost:5173';

export const getConfiguredClientUrls = (): string[] =>
  (process.env.CLIENT_URL || DEFAULT_CLIENT_URL)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

export const getPrimaryClientUrl = (): string => {
  const configuredOrigins = getConfiguredClientUrls();
  return configuredOrigins[0] || DEFAULT_CLIENT_URL;
};

export const getSafeClientUrl = (requestedUrl?: string): string => {
  if (!requestedUrl) return getPrimaryClientUrl();

  const configuredOrigins = getConfiguredClientUrls();
  return configuredOrigins.includes(requestedUrl) ? requestedUrl : getPrimaryClientUrl();
};
