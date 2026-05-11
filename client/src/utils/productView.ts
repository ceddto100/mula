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
