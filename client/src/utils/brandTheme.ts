const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;
const BRAND_THEME_STORAGE_KEY = 'site.brandTheme';
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

const loadedFonts = new Set<string>();

const ensureGoogleFont = (fontName: string): void => {
  if (!fontName || loadedFonts.has(fontName) || typeof document === 'undefined') return;
  if (fontName === 'Bebas Neue') return; // already preloaded in index.html
  const family = fontName.replace(/ /g, '+');
  const href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;700&display=swap`;
  if (document.querySelector(`link[data-font="${fontName}"]`)) {
    loadedFonts.add(fontName);
    return;
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.setAttribute('data-font', fontName);
  document.head.appendChild(link);
  loadedFonts.add(fontName);
};

export const normalizeAccentColor = (value?: string): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  return HEX_COLOR_REGEX.test(trimmed) ? trimmed : null;
};

export const applyAccentColor = (value?: string): string | null => {
  const normalized = normalizeAccentColor(value);
  if (normalized) {
    document.documentElement.style.setProperty('--accent-electric', normalized);
  } else {
    document.documentElement.style.removeProperty('--accent-electric');
  }
  return normalized;
};

export const applyHeadingFont = (fontName?: string): string => {
  const family = HEADING_FONT_MAP[fontName || ''] || '"Bebas Neue", Impact, sans-serif';
  if (fontName && HEADING_FONT_MAP[fontName]) {
    ensureGoogleFont(fontName);
  }
  document.documentElement.style.setProperty('--site-heading-font', family);
  return family;
};

type PersistedBrandTheme = {
  accentColor?: string;
  headingFont?: string;
};

export const saveBrandTheme = (theme?: PersistedBrandTheme): void => {
  if (!theme) return;
  try {
    localStorage.setItem(BRAND_THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch (error) {
    console.warn('Failed to persist brand theme locally:', error);
  }
};

export const getStoredBrandTheme = (): PersistedBrandTheme | null => {
  try {
    const raw = localStorage.getItem(BRAND_THEME_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedBrandTheme;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (error) {
    console.warn('Failed to load stored brand theme:', error);
    return null;
  }
};

export const applyStoredBrandTheme = (): PersistedBrandTheme | null => {
  const storedTheme = getStoredBrandTheme();
  if (!storedTheme) return null;

  applyAccentColor(storedTheme.accentColor);
  applyHeadingFont(storedTheme.headingFont);
  return storedTheme;
};
