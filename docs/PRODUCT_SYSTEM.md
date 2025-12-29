# Shopify-Style Product System

This document describes the Shopify-style product system implementation for the Mula eCommerce app.

## Overview

The product system follows Shopify's data model with support for:
- Variants with individual pricing and inventory
- Product options (Size, Color, etc.) for variant generation
- SEO metadata
- Collections and tags for organization
- Filtering by gender, fit, color family, etc.

## Environment Variables

No new environment variables are required. The system uses existing:
- `MONGODB_URI` - MongoDB connection string
- `CLOUDINARY_*` - Image upload configuration
- `CLIENT_URL` / `VITE_API_URL` - API base URLs

## API Endpoints

### Public Routes (`/api/products`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List active products with filtering |
| GET | `/featured` | Get featured products |
| GET | `/search?q=term` | Search products |
| GET | `/filters` | Get filter options (types, vendors, price range) |
| GET | `/handle/:handle` | Get product by SEO-friendly handle |
| GET | `/:id` | Get product by ID |
| GET | `/type/:type` | Products by type |
| GET | `/collection/:collection` | Products by collection |
| GET | `/vendor/:vendor` | Products by vendor |
| GET | `/categories` | List product types (legacy) |

**Query Parameters for listing:**
- `page`, `limit` - Pagination
- `search` - Text search
- `productType`, `vendor` - Taxonomy filters
- `minPrice`, `maxPrice` - Price range
- `tags`, `colorFamily`, `gender`, `fit` - Attribute filters
- `collection` - Collection filter
- `sort` - Sort field (default: `-publishedAt`)

### Admin Routes (`/api/admin/products`) - Protected

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all products (any status) |
| GET | `/:id` | Get single product |
| POST | `/` | Create product |
| PUT | `/:id` | Update product |
| DELETE | `/:id` | Archive product (soft delete) |
| DELETE | `/:id/permanent` | Permanently delete |
| PUT | `/:id/inventory` | Update variant inventory |
| POST | `/bulk/status` | Bulk update status |
| GET | `/filters` | Get filter options for admin |

## Example JSON Payloads

### Create Product (Minimal)

```json
{
  "title": "Classic Cotton T-Shirt",
  "variants": [
    {
      "sku": "TSHIRT-001",
      "price": 29.99,
      "inventoryQuantity": 100
    }
  ]
}
```

### Create Product (Full)

```json
{
  "title": "Premium Oversized Hoodie",
  "handle": "premium-oversized-hoodie",
  "status": "active",
  "vendor": "Mula Essentials",
  "productType": "Hoodies",
  "descriptionHtml": "<p>Ultra-soft premium cotton hoodie with a relaxed, oversized fit.</p><ul><li>80% Cotton, 20% Polyester</li><li>Pre-shrunk fabric</li><li>Kangaroo pocket</li></ul>",
  "images": [
    {
      "url": "https://res.cloudinary.com/xxx/image/upload/hoodie-front.jpg",
      "alt": "Premium Oversized Hoodie - Front View",
      "position": 0
    },
    {
      "url": "https://res.cloudinary.com/xxx/image/upload/hoodie-back.jpg",
      "alt": "Premium Oversized Hoodie - Back View",
      "position": 1
    }
  ],
  "options": [
    { "name": "Size", "values": ["S", "M", "L", "XL"] },
    { "name": "Color", "values": ["Black", "Gray", "Navy"] }
  ],
  "variants": [
    {
      "sku": "HOODIE-BLK-S",
      "title": "S / Black",
      "price": 79.99,
      "compareAtPrice": 99.99,
      "inventoryQuantity": 25,
      "inventoryPolicy": "deny",
      "options": [
        { "name": "Size", "value": "S" },
        { "name": "Color", "value": "Black" }
      ],
      "weight": 0.5,
      "weightUnit": "kg"
    },
    {
      "sku": "HOODIE-BLK-M",
      "title": "M / Black",
      "price": 79.99,
      "compareAtPrice": 99.99,
      "inventoryQuantity": 50,
      "inventoryPolicy": "deny",
      "options": [
        { "name": "Size", "value": "M" },
        { "name": "Color", "value": "Black" }
      ]
    }
  ],
  "seoTitle": "Premium Oversized Hoodie | Mula Essentials",
  "seoDescription": "Ultra-soft premium cotton hoodie with relaxed oversized fit. Available in S-XL.",
  "tags": ["hoodie", "oversized", "cotton", "streetwear", "bestseller"],
  "collections": ["Fall 2024", "Bestsellers", "Essentials"],
  "metaKeywords": ["oversized hoodie", "cotton hoodie", "streetwear"],
  "gender": "unisex",
  "fit": "oversized",
  "materials": ["80% Cotton", "20% Polyester"],
  "colorFamily": ["Black", "Gray", "Navy"],
  "weight": 0.5,
  "weightUnit": "kg",
  "requiresShipping": true
}
```

### Update Inventory

```json
{
  "variantId": "507f1f77bcf86cd799439011",
  "quantity": 75
}
```

Or with adjustment:

```json
{
  "variantId": "507f1f77bcf86cd799439011",
  "adjustment": -5
}
```

### Bulk Update Status

```json
{
  "productIds": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012"
  ],
  "status": "active"
}
```

## Product Model Schema

```typescript
interface Product {
  // Core
  title: string;           // Required
  handle: string;          // URL slug, auto-generated if not provided
  status: 'draft' | 'active' | 'archived';
  vendor: string;          // Brand name
  productType: string;     // Category
  descriptionHtml: string; // Rich text description

  // Images
  images: Array<{
    url: string;
    alt?: string;
    position?: number;
  }>;

  // Variants (at least 1 required)
  variants: Array<{
    sku: string;           // Required, unique
    title?: string;
    price: number;         // Required
    compareAtPrice?: number;
    inventoryQuantity: number;
    inventoryPolicy: 'deny' | 'continue';
    options: Array<{ name: string; value: string }>;
    barcode?: string;
    weight?: number;
    weightUnit?: 'kg' | 'g' | 'lb' | 'oz';
    requiresShipping?: boolean;
    imageUrl?: string;
  }>;

  // Options (for variant generation)
  options: Array<{
    name: string;
    values: string[];
  }>;

  // SEO
  seoTitle: string;        // Max 70 chars
  seoDescription: string;  // Max 160 chars
  tags: string[];
  collections: string[];
  metaKeywords: string[];

  // Filtering
  gender: 'men' | 'women' | 'unisex' | null;
  fit: 'regular' | 'oversized' | 'slim' | 'relaxed' | null;
  materials: string[];
  colorFamily: string[];

  // Shipping
  weight: number;
  weightUnit: 'kg' | 'g' | 'lb' | 'oz';
  requiresShipping: boolean;

  // Publishing
  publishedAt: Date | null;  // Auto-set when status becomes 'active'

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

## Database Indexes

The following indexes are created for optimal query performance:

- `handle` - Unique index for SEO-friendly URLs
- `variants.sku` - Unique sparse index for SKU lookups
- Text index on: `title`, `descriptionHtml`, `tags`, `seoTitle`, `seoDescription`, `vendor`
- Single field indexes: `status`, `productType`, `vendor`, `gender`, `fit`, `colorFamily`, `collections`, `tags`, `publishedAt`, `createdAt`, `variants.price`

## SEO Features

### Product Detail Page

The API returns SEO metadata for each product:

```json
{
  "seo": {
    "title": "Product Title | Brand",
    "description": "Meta description...",
    "canonicalUrl": "/products/product-handle",
    "keywords": ["keyword1", "keyword2"],
    "image": "https://...",
    "imageAlt": "Product image description"
  }
}
```

### Usage in Frontend

```jsx
// React Helmet or similar
<Helmet>
  <title>{product.seo.title}</title>
  <meta name="description" content={product.seo.description} />
  <link rel="canonical" href={`${BASE_URL}${product.seo.canonicalUrl}`} />
  <meta property="og:image" content={product.seo.image} />
  <meta property="og:image:alt" content={product.seo.imageAlt} />
</Helmet>
```

## Migration Notes

### From Old Product Schema

The old schema used:
- `name` → now `title`
- `description` → now `descriptionHtml`
- `price` → now in `variants[].price`
- `stock` → now in `variants[].inventoryQuantity`
- `category` → now `productType`
- `isActive` → now `status === 'active'` (virtual field available)
- `sizes[]`, `colors[]` → now in `options[]`
- `images[]` (strings) → now `images[].url` with alt text

### Data Migration Script

If you have existing products, you may need to migrate:

```javascript
// Example migration (run once)
db.products.find({}).forEach(function(doc) {
  if (doc.name && !doc.title) {
    db.products.updateOne(
      { _id: doc._id },
      {
        $set: {
          title: doc.name,
          handle: doc.name.toLowerCase().replace(/\s+/g, '-'),
          status: doc.isActive ? 'active' : 'archived',
          productType: doc.category || '',
          descriptionHtml: doc.description || '',
          variants: [{
            sku: `LEGACY-${doc._id}`,
            price: doc.price || 0,
            inventoryQuantity: doc.stock || 0,
            inventoryPolicy: 'deny',
            options: []
          }],
          options: [],
          images: (doc.images || []).map((url, i) => ({ url, alt: '', position: i }))
        },
        $unset: { name: 1, description: 1, price: 1, stock: 1, category: 1, isActive: 1, sizes: 1, colors: 1 }
      }
    );
  }
});
```

## Admin Dashboard Features

The admin product form includes:

1. **Title & Handle** - Auto-generates URL slug from title
2. **Description** - HTML-supported textarea
3. **Media** - Multiple image upload with alt text per image
4. **Pricing & Inventory** - Per-variant pricing, compare-at price, inventory
5. **Options** - Define Size/Color options and auto-generate variants
6. **Organization** - Product type, vendor, tags, collections, gender, fit
7. **SEO** - SEO title, meta description with character counters and preview
8. **Status** - Draft/Active/Archived with publish button

### Unsaved Changes Warning

The form tracks unsaved changes and warns before:
- Closing the modal
- Navigating away from the page
