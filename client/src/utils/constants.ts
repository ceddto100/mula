export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';

// Product Types (categories)
export const PRODUCT_TYPES = [
  'T-Shirts',
  'Hoodies',
  'Pants',
  'Shorts',
  'Jackets',
  'Accessories',
  'Footwear',
];

// Legacy categories (for backward compatibility)
export const CATEGORIES = [
  'Men',
  'Women',
  'Accessories',
  'Footwear',
  'New Arrivals',
  'Sale',
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Navy', value: '#1E3A5F' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Red', value: '#DC2626' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'Green', value: '#16A34A' },
  { name: 'Brown', value: '#92400E' },
  { name: 'Beige', value: '#D4C4B0' },
  { name: 'Pink', value: '#EC4899' },
];

// Color families for filtering
export const COLOR_FAMILIES = [
  'Black',
  'White',
  'Gray',
  'Navy',
  'Blue',
  'Red',
  'Green',
  'Brown',
  'Beige',
  'Pink',
  'Multi',
];

// Gender options
export const GENDERS = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
];

// Fit options
export const FITS = [
  { value: 'regular', label: 'Regular' },
  { value: 'oversized', label: 'Oversized' },
  { value: 'slim', label: 'Slim' },
  { value: 'relaxed', label: 'Relaxed' },
];

// Product status options
export const PRODUCT_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'archived', label: 'Archived', color: 'red' },
];

// Inventory policies
export const INVENTORY_POLICIES = [
  { value: 'deny', label: 'Stop selling when out of stock' },
  { value: 'continue', label: 'Continue selling when out of stock' },
];

// Weight units
export const WEIGHT_UNITS = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'oz', label: 'Ounces (oz)' },
];

// Common materials
export const MATERIALS = [
  '100% Cotton',
  'Cotton Blend',
  'Polyester',
  'Nylon',
  'Wool',
  'Linen',
  'Silk',
  'Denim',
  'Leather',
  'Synthetic',
];

// Order statuses
export const ORDER_STATUSES = [
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const PAYMENT_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
];

// SEO constraints
export const SEO_CONSTRAINTS = {
  titleMaxLength: 70,
  descriptionMaxLength: 160,
};

// Utility function to generate SKU from options
export const generateSKU = (prefix: string, options: Array<{ value: string }>, index: number): string => {
  const optionSuffix = options
    .map(o => o.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3))
    .join('-');
  return `${prefix}-${optionSuffix}-${String(index + 1).padStart(3, '0')}`;
};

// Utility function to create URL slug
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Utility to generate variant title from options
export const generateVariantTitle = (options: Array<{ value: string }>): string => {
  return options.map(o => o.value).join(' / ');
};

// Generate all variant combinations from options
export const generateVariantCombinations = (
  options: Array<{ name: string; values: string[] }>
): Array<Array<{ name: string; value: string }>> => {
  if (options.length === 0) return [[]];

  const cartesian = (arrays: string[][]): string[][] => {
    return arrays.reduce<string[][]>(
      (acc, curr) => {
        const result: string[][] = [];
        acc.forEach(existingCombo => {
          curr.forEach(item => {
            result.push([...existingCombo, item]);
          });
        });
        return result;
      },
      [[]]
    );
  };

  const valueArrays = options.map(opt => opt.values);
  const combinations = cartesian(valueArrays);

  return combinations.map(combo =>
    combo.map((value, idx) => ({
      name: options[idx].name,
      value,
    }))
  );
};
