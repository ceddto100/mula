import { Product } from '../types';

export const getProductName = (product: Product): string => product.title || 'Untitled product';

export const getProductPrice = (product: Product): number => {
  if (product.priceRange) {
    return product.priceRange.min;
  }

  const firstVariantPrice = product.variants?.[0]?.price;
  return typeof firstVariantPrice === 'number' ? firstVariantPrice : 0;
};

export const getProductStock = (product: Product): number => {
  if (typeof product.totalInventory === 'number') {
    return product.totalInventory;
  }

  return product.variants?.reduce((sum, variant) => sum + (variant.inventoryQuantity || 0), 0) || 0;
};

export const getProductMedia = (product: Product): Array<{ url: string; mediaType: 'image' | 'video'; alt?: string }> => {
  if (product.media?.length) {
    return product.media.map((m) => ({ url: m.url, mediaType: m.mediaType, alt: m.alt }));
  }
  return product.images?.map((image) => ({ url: image.url, mediaType: 'image' as const, alt: image.alt })) || [];
};

export const getProductImageUrls = (product: Product): string[] =>
  getProductMedia(product).filter((m) => m.mediaType === 'image').map((m) => m.url).filter(Boolean);

export const getProductDescription = (product: Product): string =>
  product.seoDescription || product.descriptionHtml || '';

export const getProductCategory = (product: Product): string => product.productType || 'Uncategorized';

// Header categories a product can belong to, in priority order for the fallback.
const HEADER_CATEGORY_TAGS = ['men', 'women', 'collections', 'sale'];

/**
 * Resolves the header category a single product belongs to, using the product's
 * OWN context — gender first, then its header-category tags. This is not a
 * "dominant category" guess across products: it reflects this one product, so a
 * men's item resolves to `men` and a women's item to `women`.
 * Returns null when the product has no resolvable header category.
 */
export const getProductHeaderCategory = (product: Product): string | null => {
  if (product.gender === 'men' || product.gender === 'women') {
    return product.gender;
  }
  const tag = (product.tags || [])
    .map((t) => t.toLowerCase())
    .find((t) => HEADER_CATEGORY_TAGS.includes(t));
  return tag || null;
};

export const getProductColors = (product: Product): string[] => {
  if (product.colorFamily?.length) {
    return product.colorFamily;
  }

  const colorOption = product.options?.find((option) => /color/i.test(option.name));
  return colorOption?.values || [];
};

export const getProductSizes = (product: Product): string[] => {
  const sizeOption = product.options?.find((option) => /size/i.test(option.name));
  return sizeOption?.values || [];
};
