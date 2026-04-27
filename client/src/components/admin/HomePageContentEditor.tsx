import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/admin.api';
import { HomePageContent } from '../../types';
import { defaultHomePageContent } from '../../pages/Home';
import { applyAccentColor, applyHeadingFont, saveBrandTheme } from '../../utils/brandTheme';
import { HEADING_FONT_OPTIONS, HERO_OVERLAY_COLORS } from '../../utils/adminTheme';

type FieldDef = {
  path: string;
  label: string;
  multiline?: boolean;
};

type SectionDef = {
  key: string;
  title: string;
  description?: string;
  fields: FieldDef[];
};

const sections: SectionDef[] = [
  {
    key: 'brandTheme',
    title: 'Brand Theme',
    description: 'Controls site accent color, hero turquoise overlay, and website heading font.',
    fields: [
      { path: 'brandTheme.accentColor', label: 'Accent color (hex)' },
      { path: 'brandTheme.heroOverlayColor', label: 'Hero overlay color (hex)' },
      { path: 'brandTheme.headingFont', label: 'Website heading font' },
    ],
  },
  {
    key: 'hero',
    title: 'Hero Section',
    description: 'Top-of-page banner copy.',
    fields: [
      { path: 'hero.badge', label: 'Badge' },
      { path: 'hero.headline1', label: 'Headline (line 1)' },
      { path: 'hero.headline2', label: 'Headline (line 2)' },
      { path: 'hero.subheading', label: 'Subheading', multiline: true },
      { path: 'hero.ctaPrimary', label: 'Primary button' },
      { path: 'hero.ctaSecondary', label: 'Secondary button' },
      { path: 'hero.scrollLabel', label: 'Scroll indicator' },
    ],
  },
  {
    key: 'shopByStyle',
    title: 'Shop By Style',
    description: 'Section heading and the five category cards.',
    fields: [
      { path: 'shopByStyle.sectionTitle', label: 'Section title' },

      { path: 'shopByStyle.men.badge', label: "Men — badge" },
      { path: 'shopByStyle.men.title', label: "Men — title" },
      { path: 'shopByStyle.men.description', label: "Men — description" },
      { path: 'shopByStyle.men.linkText', label: "Men — link text" },

      { path: 'shopByStyle.women.title', label: "Women — title" },
      { path: 'shopByStyle.women.description', label: "Women — description" },
      { path: 'shopByStyle.women.linkText', label: "Women — link text" },

      { path: 'shopByStyle.accessories.title', label: 'Accessories — title' },
      { path: 'shopByStyle.accessories.linkText', label: 'Accessories — link text' },

      { path: 'shopByStyle.sale.title', label: 'Sale — title' },
      { path: 'shopByStyle.sale.description', label: 'Sale — description' },
      { path: 'shopByStyle.sale.linkText', label: 'Sale — link text' },

      { path: 'shopByStyle.collections.title', label: 'Collections — title' },
      { path: 'shopByStyle.collections.description', label: 'Collections — description' },
      { path: 'shopByStyle.collections.linkText', label: 'Collections — link text' },
    ],
  },
  {
    key: 'freshDrops',
    title: 'Fresh Drops',
    description: 'Featured products section header.',
    fields: [
      { path: 'freshDrops.badge', label: 'Badge' },
      { path: 'freshDrops.sectionTitle', label: 'Section title' },
      { path: 'freshDrops.viewAllLink', label: 'View-all link text' },
    ],
  },
  {
    key: 'brandStatement',
    title: 'Brand Statement',
    description: 'The "Define Your Style" mid-page section.',
    fields: [
      { path: 'brandStatement.headlineLine1', label: 'Headline (line 1)' },
      { path: 'brandStatement.headlineLine2', label: 'Headline (line 2, accent color)' },
      { path: 'brandStatement.description', label: 'Description', multiline: true },
      { path: 'brandStatement.ctaButton', label: 'CTA button' },
    ],
  },
  {
    key: 'newsletter',
    title: 'Newsletter',
    description: 'Bottom signup card.',
    fields: [
      { path: 'newsletter.title', label: 'Title' },
      { path: 'newsletter.description', label: 'Description', multiline: true },
      { path: 'newsletter.emailPlaceholder', label: 'Email placeholder' },
      { path: 'newsletter.submitButton', label: 'Submit button' },
    ],
  },
];

const getByPath = (obj: any, path: string): string => {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj) ?? '';
};

const setByPath = <T,>(obj: T, path: string, value: string): T => {
  const keys = path.split('.');
  const next: any = Array.isArray(obj) ? [...(obj as any)] : { ...(obj as any) };
  let cursor = next;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    cursor[k] = cursor[k] != null ? { ...cursor[k] } : {};
    cursor = cursor[k];
  }
  cursor[keys[keys.length - 1]] = value;
  return next;
};

const HomePageContentEditor: React.FC = () => {
  const [content, setContent] = useState<HomePageContent>(defaultHomePageContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.getHomePageContent();
        setContent(data);
        applyAccentColor(data.brandTheme?.accentColor);
      } catch (error) {
        console.error('Failed to load home page content:', error);
        toast.error('Failed to load home page content');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const onChange = (path: string, value: string) => {
    setContent((prev) => setByPath(prev, path, value));
    if (path === 'brandTheme.accentColor') {
      applyAccentColor(value);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updated = await adminApi.updateHomePageContent({
        hero: content.hero,
        shopByStyle: content.shopByStyle,
        freshDrops: content.freshDrops,
        brandStatement: content.brandStatement,
        newsletter: content.newsletter,
        brandTheme: content.brandTheme,
      });
      setContent(updated);
      applyAccentColor(updated.brandTheme?.accentColor);
      applyHeadingFont(updated.brandTheme?.headingFont);
      saveBrandTheme({
        accentColor: updated.brandTheme?.accentColor,
        headingFont: updated.brandTheme?.headingFont,
      });
      toast.success('Home page content updated');
    } catch (error) {
      console.error('Failed to save home page content:', error);
      toast.error('Failed to save home page content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setContent(defaultHomePageContent);
    applyAccentColor(defaultHomePageContent.brandTheme.accentColor);
    toast('Defaults loaded — click Save to apply.', { icon: '↺' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 text-gray-900">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Home Page Content Editor</h3>
          <p className="text-sm text-gray-700">
            Edit every line of copy from the hero down to the newsletter signup.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            disabled={isLoading || isSaving}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 disabled:opacity-60"
          >
            Reset to defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading || isSaving}
            className="px-4 py-2 bg-gray-900 text-white rounded-md font-medium disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save Content'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map((section) => (
            <details key={section.key} open className="border rounded-lg">
              <summary className="cursor-pointer select-none px-4 py-3 font-medium text-gray-800 bg-gray-50 rounded-t-lg">
                {section.title}
                {section.description && (
                  <span className="block text-xs font-normal text-gray-600 mt-0.5">
                    {section.description}
                  </span>
                )}
              </summary>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field) => {
                  const value = getByPath(content, field.path);
                  return (
                    <label
                      key={field.path}
                      className={`text-sm ${field.multiline ? 'md:col-span-2' : ''}`}
                    >
                      <span className="block text-gray-700 font-medium mb-1">{field.label}</span>
                      {field.multiline ? (
                        <textarea
                          value={value}
                          onChange={(e) => onChange(field.path, e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-gray-900"
                        />
                      ) : (
                        <div className="flex gap-2">
                          {field.path === 'brandTheme.headingFont' ? (
                            <select
                              value={value || 'Inter'}
                              onChange={(e) => onChange(field.path, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-gray-900"
                            >
                              {HEADING_FONT_OPTIONS.map((font) => (
                                <option key={font.value} value={font.value}>
                                  {font.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <>
                              <input
                                type={field.path.includes('Color') ? 'color' : 'text'}
                                value={value || '#00E5FF'}
                                onChange={(e) => onChange(field.path, e.target.value)}
                                className={`${
                                  field.path.includes('Color') ? 'w-14 h-10 p-1' : 'w-full px-3 py-2'
                                } border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-gray-900`}
                              />
                              {field.path.includes('Color') && (
                                <input
                                  type="text"
                                  value={value}
                                  onChange={(e) => onChange(field.path, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-gray-900"
                                  placeholder="#00E5FF"
                                />
                              )}
                            </>
                          )}
                        </div>
                      )}
                      {field.path === 'brandTheme.heroOverlayColor' && (
                        <div className="mt-2 grid grid-cols-6 sm:grid-cols-12 gap-2">
                          {HERO_OVERLAY_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => onChange(field.path, color)}
                              className={`h-8 w-8 rounded border-2 transition ${
                                (value || '').toLowerCase() === color.toLowerCase()
                                  ? 'border-gray-900 scale-110'
                                  : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      )}
                      {field.path === 'brandTheme.headingFont' && (
                        <div className="mt-2 text-sm text-gray-700">
                          Preview: <span style={{ fontFamily: HEADING_FONT_OPTIONS.find((f) => f.value === (value || 'Inter'))?.family }}>H1 H2 H3 H4 headings</span>
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePageContentEditor;
