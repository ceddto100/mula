/**
 * Product utility functions for Shopify-style product management
 */

import Product from '../models/Product';

/**
 * Converts a string to a URL-safe slug/handle
 * @param text - The text to slugify
 * @returns A lowercase, hyphenated slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars except hyphens
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

/**
 * Generates a unique handle for a product, appending a number if needed
 * @param title - The product title to generate handle from
 * @param existingHandle - Optional existing handle to check against (for updates)
 * @returns A unique handle string
 */
export async function generateUniqueHandle(
  title: string,
  existingHandle?: string
): Promise<string> {
  const baseHandle = slugify(title);

  // If the title slugifies to the same as existing, keep it
  if (existingHandle && baseHandle === existingHandle) {
    return existingHandle;
  }

  // Check if handle exists
  let handle = baseHandle;
  let counter = 1;

  while (true) {
    const existing = await Product.findOne({ handle });
    if (!existing) {
      break;
    }
    handle = `${baseHandle}-${counter}`;
    counter++;
  }

  return handle;
}

/**
 * Represents a single option value combination
 */
interface OptionCombination {
  name: string;
  value: string;
}

/**
 * Represents a generated variant
 */
export interface GeneratedVariant {
  sku: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  inventoryQuantity: number;
  inventoryPolicy: 'deny' | 'continue';
  options: OptionCombination[];
  barcode: string | null;
}

/**
 * Product option definition
 */
interface ProductOption {
  name: string;
  values: string[];
}

/**
 * Generates all variant combinations from product options
 * @param options - Array of option definitions (e.g., [{ name: "Size", values: ["S", "M"] }])
 * @param basePrice - Default price for all variants
 * @param skuPrefix - Prefix for generated SKUs
 * @returns Array of generated variant objects
 */
export function generateVariantsFromOptions(
  options: ProductOption[],
  basePrice: number = 0,
  skuPrefix: string = 'SKU'
): GeneratedVariant[] {
  if (!options || options.length === 0) {
    // Return a default variant if no options
    return [{
      sku: `${skuPrefix}-DEFAULT`,
      title: 'Default',
      price: basePrice,
      compareAtPrice: null,
      inventoryQuantity: 0,
      inventoryPolicy: 'deny',
      options: [],
      barcode: null,
    }];
  }

  // Get all combinations using cartesian product
  const combinations = cartesianProduct(
    options.map(opt => opt.values.map(val => ({ name: opt.name, value: val })))
  );

  return combinations.map((combo, index) => {
    const optionValues = combo.map(o => o.value);
    const title = optionValues.join(' / ');
    const skuSuffix = optionValues.map(v =>
      v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3)
    ).join('-');

    return {
      sku: `${skuPrefix}-${skuSuffix}-${String(index + 1).padStart(3, '0')}`,
      title,
      price: basePrice,
      compareAtPrice: null,
      inventoryQuantity: 0,
      inventoryPolicy: 'deny' as const,
      options: combo,
      barcode: null,
    };
  });
}

/**
 * Computes the cartesian product of arrays
 * @param arrays - Arrays to compute product of
 * @returns All combinations of array elements
 */
function cartesianProduct<T>(arrays: T[][]): T[][] {
  if (arrays.length === 0) return [[]];

  return arrays.reduce<T[][]>(
    (acc, curr) => {
      const result: T[][] = [];
      acc.forEach(existingCombo => {
        curr.forEach(item => {
          result.push([...existingCombo, item]);
        });
      });
      return result;
    },
    [[]]
  );
}

/**
 * Calculates the price range of a product from its variants
 * @param variants - Product variants
 * @returns Object with min and max prices
 */
export function getPriceRange(
  variants: Array<{ price: number }>
): { min: number; max: number } {
  if (!variants || variants.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = variants.map(v => v.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

/**
 * Calculates total inventory across all variants
 * @param variants - Product variants
 * @returns Total inventory count
 */
export function getTotalInventory(
  variants: Array<{ inventoryQuantity: number }>
): number {
  if (!variants || variants.length === 0) {
    return 0;
  }

  return variants.reduce((sum, v) => sum + (v.inventoryQuantity || 0), 0);
}

/**
 * Checks if a product is in stock (at least one variant has inventory)
 * @param variants - Product variants
 * @returns Boolean indicating if product is in stock
 */
export function isInStock(
  variants: Array<{ inventoryQuantity: number; inventoryPolicy: string }>
): boolean {
  if (!variants || variants.length === 0) {
    return false;
  }

  return variants.some(
    v => v.inventoryQuantity > 0 || v.inventoryPolicy === 'continue'
  );
}

/**
 * Extracts unique color families from options
 * @param options - Product options
 * @returns Array of color values
 */
export function extractColorFamily(options: ProductOption[]): string[] {
  const colorOption = options.find(
    opt => opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour'
  );
  return colorOption?.values || [];
}

/**
 * Validates that all variant SKUs are unique within a product
 * @param variants - Product variants
 * @returns Boolean indicating if all SKUs are unique
 */
export function validateUniqueSKUs(
  variants: Array<{ sku: string }>
): boolean {
  if (!variants || variants.length === 0) {
    return true;
  }

  const skus = variants.map(v => v.sku);
  const uniqueSkus = new Set(skus);
  return skus.length === uniqueSkus.size;
}

/**
 * Strips HTML tags from a string (for generating plain text descriptions)
 * @param html - HTML string
 * @returns Plain text string
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates SEO title from product title if not provided
 * @param title - Product title
 * @param maxLength - Maximum length (default 70)
 * @returns SEO-friendly title
 */
export function generateSeoTitle(title: string, maxLength: number = 70): string {
  if (title.length <= maxLength) {
    return title;
  }
  return title.slice(0, maxLength - 3) + '...';
}

/**
 * Generates SEO description from product description if not provided
 * @param descriptionHtml - HTML description
 * @param maxLength - Maximum length (default 160)
 * @returns SEO-friendly description
 */
export function generateSeoDescription(
  descriptionHtml: string,
  maxLength: number = 160
): string {
  const plainText = stripHtml(descriptionHtml);
  if (plainText.length <= maxLength) {
    return plainText;
  }
  return plainText.slice(0, maxLength - 3) + '...';
}
