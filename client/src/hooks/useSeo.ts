import { useEffect } from 'react';

interface SeoOptions {
  title: string;
  description?: string;
  canonicalPath?: string;
  ogType?: 'website' | 'product' | 'article';
  image?: string;
  imageAlt?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const upsertMeta = (selector: string, attr: 'name' | 'property', key: string, content?: string) => {
  if (!content) return;
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const upsertLink = (rel: string, href?: string) => {
  if (!href) return;
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

export const useSeo = ({ title, description, canonicalPath, ogType = 'website', image, imageAlt, jsonLd }: SeoOptions): void => {
  useEffect(() => {
    const origin = window.location.origin;
    const canonicalUrl = canonicalPath ? `${origin}${canonicalPath}` : window.location.href;
    const resolvedImage = image?.startsWith('http') ? image : image ? `${origin}${image}` : undefined;

    document.title = title;
    upsertMeta('meta[name="description"]', 'name', 'description', description);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', ogType);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', resolvedImage);
    upsertMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', imageAlt || title);
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', resolvedImage);
    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertLink('canonical', canonicalUrl);

    const existing = document.getElementById('dynamic-jsonld');
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.id = 'dynamic-jsonld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd]);
      document.head.appendChild(script);
    }
  }, [title, description, canonicalPath, ogType, image, imageAlt, JSON.stringify(jsonLd)]);
};
