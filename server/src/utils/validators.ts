import { body, param, query } from 'express-validator';

export const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Legacy product validation (kept for backward compatibility)
export const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Product name must be at least 2 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
];

// Shopify-style product validation
export const shopifyProductValidation = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 256 })
    .withMessage('Product title must be between 2 and 256 characters'),
  body('handle')
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Handle must be a valid URL slug (lowercase letters, numbers, and hyphens)'),
  body('status')
    .optional()
    .isIn(['draft', 'active', 'archived'])
    .withMessage('Status must be draft, active, or archived'),
  body('variants')
    .isArray({ min: 1 })
    .withMessage('Product must have at least one variant'),
  body('variants.*.sku')
    .trim()
    .notEmpty()
    .withMessage('Each variant must have a SKU'),
  body('variants.*.price')
    .isFloat({ min: 0 })
    .withMessage('Variant price must be a positive number'),
  body('variants.*.compareAtPrice')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Compare at price must be a positive number'),
  body('variants.*.inventoryQuantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Inventory quantity must be a non-negative integer'),
  body('variants.*.inventoryPolicy')
    .optional()
    .isIn(['deny', 'continue'])
    .withMessage('Inventory policy must be deny or continue'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*.url')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('options')
    .optional()
    .isArray()
    .withMessage('Options must be an array'),
  body('options.*.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Option name is required'),
  body('options.*.values')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Option must have at least one value'),
  body('seoTitle')
    .optional()
    .trim()
    .isLength({ max: 70 })
    .withMessage('SEO title should not exceed 70 characters'),
  body('seoDescription')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('SEO description should not exceed 160 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('collections')
    .optional()
    .isArray()
    .withMessage('Collections must be an array'),
  body('gender')
    .optional({ nullable: true })
    .isIn(['men', 'women', 'unisex', null])
    .withMessage('Gender must be men, women, unisex, or null'),
  body('fit')
    .optional({ nullable: true })
    .isIn(['regular', 'oversized', 'slim', 'relaxed', null])
    .withMessage('Fit must be regular, oversized, slim, relaxed, or null'),
  body('materials')
    .optional()
    .isArray()
    .withMessage('Materials must be an array'),
  body('colorFamily')
    .optional()
    .isArray()
    .withMessage('Color family must be an array'),
  body('weight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Weight must be a positive number'),
  body('weightUnit')
    .optional()
    .isIn(['kg', 'g', 'lb', 'oz'])
    .withMessage('Weight unit must be kg, g, lb, or oz'),
];

// Product update validation (all fields optional)
export const shopifyProductUpdateValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 256 })
    .withMessage('Product title must be between 2 and 256 characters'),
  body('handle')
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Handle must be a valid URL slug'),
  body('status')
    .optional()
    .isIn(['draft', 'active', 'archived'])
    .withMessage('Status must be draft, active, or archived'),
  body('variants')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Product must have at least one variant'),
  body('variants.*.sku')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Each variant must have a SKU'),
  body('variants.*.price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Variant price must be a positive number'),
  body('seoTitle')
    .optional()
    .trim()
    .isLength({ max: 70 })
    .withMessage('SEO title should not exceed 70 characters'),
  body('seoDescription')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('SEO description should not exceed 160 characters'),
];

// Inventory update validation
export const inventoryUpdateValidation = [
  body('variantId')
    .isMongoId()
    .withMessage('Invalid variant ID'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 256 })
    .withMessage('Reason cannot exceed 256 characters'),
];

export const cartItemValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('variantId')
    .optional()
    .isMongoId()
    .withMessage('Invalid variant ID'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('size')
    .trim()
    .notEmpty()
    .withMessage('Size is required'),
  body('color')
    .trim()
    .notEmpty()
    .withMessage('Color is required'),
];

export const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];

export const handleValidation = [
  param('handle')
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Invalid handle format'),
];

export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

// Product list query validation
export const productQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Min price must be a positive number'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Max price must be a positive number'),
  query('gender')
    .optional()
    .isIn(['men', 'women', 'unisex'])
    .withMessage('Gender must be men, women, or unisex'),
  query('fit')
    .optional()
    .isIn(['regular', 'oversized', 'slim', 'relaxed'])
    .withMessage('Fit must be regular, oversized, slim, or relaxed'),
  query('status')
    .optional()
    .isIn(['draft', 'active', 'archived'])
    .withMessage('Status must be draft, active, or archived'),
];

export const addressValidation = [
  body('street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('zipCode')
    .trim()
    .notEmpty()
    .withMessage('ZIP code is required'),
];
