const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;

export const normalizeAccentColor = (value?: string): string => {
  if (!value) return '#00E5FF';
  const trimmed = value.trim();
  return HEX_COLOR_REGEX.test(trimmed) ? trimmed : '#00E5FF';
};

export const applyAccentColor = (value?: string): string => {
  const normalized = normalizeAccentColor(value);
  document.documentElement.style.setProperty('--accent-electric', normalized);
  return normalized;
};
