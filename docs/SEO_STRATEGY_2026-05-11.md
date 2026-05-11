# SEO Optimization Strategy (Cualquier)

## 1) Code-base analysis
- Router is defined in `client/src/App.tsx` with product detail routes (`/product/:id`, `/products/:handle`), category route (`/category/:category`), and static policy/brand pages (`/about`, `/faq`, `/shipping`, etc.).
- Product entity fields for metadata are available in `client/src/types/index.ts` and `server/src/models/Product.ts`: `title`, `descriptionHtml`, `seoTitle`, `seoDescription`, `images`, `media`, `vendor`, `handle`, `variants`, `tags`, and `metaKeywords`.
- Existing metadata was static in `client/index.html` and partially dynamic via `useSeo` (`title` + description only).

## 2) Metadata generation model
### Dynamic title/description templates
- Product Title: `${product.seoTitle || product.title} | Cualquier`
- Product Description: `${product.seoDescription || product.descriptionHtml}`
- Category Title: `${capitalizeFirst(category)} Collection | Cualquier`
- Category Description: `Shop ${capitalizeFirst(category)} apparel and streetwear from Cualquier.`

### Open Graph/Twitter model
- OG title/description from the same dynamic product/category values.
- OG image from `product.images[0].url || product.media[0].url` for PDP.
- Canonical URL from `product.handle` and route path.

### JSON-LD coverage
- Product schema from product fields (`title`, `descriptionHtml`, `images`, `variants[0].sku`, `variants[0].price`, inventory).
- BreadcrumbList schema on PDP and category pages.
- Organization schema should be emitted globally from `Layout` or root app shell:

```ts
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Cualquier',
  url: window.location.origin,
  logo: `${window.location.origin}/images/Cualquier_logo.png`,
  sameAs: [],
  contactPoint: [{
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@cualquier.com',
  }],
};
```

## 3) Crawler and indexing files
- Added `client/public/sitemap.xml` with Home, Shop/Collections-equivalent category pages, About, FAQ and SEO tags (`lastmod`, `changefreq`, `priority`).
- Added `client/public/robots.txt` allowing major crawlers, blocking sensitive paths, and linking sitemap.

## 4) Integration summary
- `useSeo` now supports canonical, OG, Twitter, and JSON-LD payload injection.
- PDP (`ProductPage`) now emits dynamic product metadata + Product and Breadcrumb JSON-LD.
- PLP (`CategoryPage`) now emits category-level metadata + Breadcrumb JSON-LD.
- Static pages (`InfoPage`) now emit canonicalized metadata via the object API.

## 5) Backend integration snippet for dynamic sitemap (optional enhancement)
Use this in Node if you want sitemap to include all active product handles from MongoDB:

```ts
// server/src/routes/seo.routes.ts
router.get('/sitemap.xml', async (req, res) => {
  const products = await Product.find({ status: 'active' }).select('handle updatedAt').lean();
  const baseUrl = process.env.PUBLIC_SITE_URL || 'https://cualquier.com';
  const urls = products.map((p) => `
    <url>
      <loc>${baseUrl}/products/${p.handle}</loc>
      <lastmod>${new Date(p.updatedAt).toISOString().slice(0, 10)}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>`).join('');

  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`);
});
```
