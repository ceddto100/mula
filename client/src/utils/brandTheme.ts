const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;
const HEADING_FONT_MAP: Record<string, string> = {
  Inter: '"Inter", system-ui, sans-serif',
  Roboto: '"Roboto", system-ui, sans-serif',
  Poppins: '"Poppins", system-ui, sans-serif',
  Montserrat: '"Montserrat", system-ui, sans-serif',
  Lato: '"Lato", system-ui, sans-serif',
  'Nunito Sans': '"Nunito Sans", system-ui, sans-serif',
  Oswald: '"Oswald", system-ui, sans-serif',
  'Playfair Display': '"Playfair Display", Georgia, serif',
  Merriweather: '"Merriweather", Georgia, serif',
  Raleway: '"Raleway", system-ui, sans-serif',
};

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

export const applyHeadingFont = (fontName?: string): string => {
  const family = HEADING_FONT_MAP[fontName || ''] || '"Bebas Neue", Impact, sans-serif';
  document.documentElement.style.setProperty('--site-heading-font', family);
  return family;
};
