export const HEADING_FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter', family: '"Inter", system-ui, sans-serif' },
  { value: 'Roboto', label: 'Roboto', family: '"Roboto", system-ui, sans-serif' },
  { value: 'Poppins', label: 'Poppins', family: '"Poppins", system-ui, sans-serif' },
  { value: 'Montserrat', label: 'Montserrat', family: '"Montserrat", system-ui, sans-serif' },
  { value: 'Lato', label: 'Lato', family: '"Lato", system-ui, sans-serif' },
  { value: 'Nunito Sans', label: 'Nunito Sans', family: '"Nunito Sans", system-ui, sans-serif' },
  { value: 'Oswald', label: 'Oswald', family: '"Oswald", system-ui, sans-serif' },
  { value: 'Playfair Display', label: 'Playfair Display', family: '"Playfair Display", Georgia, serif' },
  { value: 'Merriweather', label: 'Merriweather', family: '"Merriweather", Georgia, serif' },
  { value: 'Raleway', label: 'Raleway', family: '"Raleway", system-ui, sans-serif' },
];

export const HERO_OVERLAY_COLORS = [
  '#00AFC2',
  '#00B8D4',
  '#06B6D4',
  '#0EA5E9',
  '#3B82F6',
  '#14B8A6',
  '#22D3EE',
  '#0891B2',
  '#0284C7',
  '#2563EB',
  '#4338CA',
  '#7C3AED',
];

export const getHeadingFontFamily = (fontName?: string) => {
  return HEADING_FONT_OPTIONS.find((option) => option.value === fontName)?.family ?? '"Inter", system-ui, sans-serif';
};
