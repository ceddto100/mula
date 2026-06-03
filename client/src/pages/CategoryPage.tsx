import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { FiFilter, FiChevronRight } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import { useProducts } from '../hooks/useProducts';
import { productsApi } from '../api/products.api';
import { capitalizeFirst } from '../utils/formatters';
import { slugify } from '../utils/constants';
import { CategoryHeroConfig, CategoryHeroMedia } from '../types';
import { useSeo } from '../hooks/useSeo';

// ─── Text-only fallbacks (media URL comes from backend) ─
const HERO_FALLBACKS: Record<string, CategoryHeroMedia> = {
  men: {
    mediaUrl: '',
    mediaType: 'image',
    title: "THE MEN'S EDIT",
    subtitle: 'Fresh drops. Bold moves. No excuses.',
  },
  women: {
    mediaUrl: '',
    mediaType: 'image',
    title: "THE WOMEN'S SHOP",
    subtitle: 'Trending fits for your soft-life era.',
  },
  denim: {
    mediaUrl: '',
    mediaType: 'image',
    title: 'THE DENIM SHOP',
    subtitle: 'Lived-in. Broken-in. Built different.',
  },
  sale: {
    mediaUrl: '',
    mediaType: 'image',
    title: 'THE SALE',
    subtitle: "Last call. Major steals. Shop before it's gone.",
  },
  collections: {
    mediaUrl: '',
    mediaType: 'image',
    title: 'THE COLLECTIONS',
    subtitle: 'Curated drops. Shop the full edits.',
  },
  hoodies: {
    mediaUrl: '',
    mediaType: 'image',
    title: 'THE HOODIE DROP',
    subtitle: 'Layer up. Stand out.',
  },
  all: {
    mediaUrl: '',
    mediaType: 'image',
    title: 'ALL PRODUCTS',
    subtitle: 'The full collection. Nothing held back.',
  },
  'new-arrivals': {
    mediaUrl: '',
    mediaType: 'image',
    title: 'JUST DROPPED',
    subtitle: 'The freshest pieces. Just landed.',
  },
  'new-out': {
    mediaUrl: '',
    mediaType: 'image',
    title: 'NEW OUT',
    subtitle: 'All the new clothes. Just dropped.',
  },
};

const DEFAULT_FALLBACK: Omit<CategoryHeroMedia, 'title'> = {
  mediaUrl: '',
  mediaType: 'image',
  subtitle: 'Drop season is now.',
};

const PARENT_CATEGORY_PATHS: Record<string, string> = {
  all: '/category/all',
  men: '/men',
  women: '/women',
  sale: '/sale',
  'new-arrivals': '/new-arrivals',
  'new-out': '/new-out',
  collections: '/collections',
};

const getCategoryPath = (category: string): string => PARENT_CATEGORY_PATHS[category] || `/category/${category}`;

const formatRouteLabel = (value: string): string => value
  .split('-')
  .filter(Boolean)
  .map(capitalizeFirst)
  .join(' ');

const getProductTypePath = (category: string, productType: string): string => {
  const productTypeSlug = slugify(productType);
  const parentPath = getCategoryPath(category);
  return parentPath.startsWith('/category/')
    ? `/category/${category}/${productTypeSlug}`
    : `${parentPath}/${productTypeSlug}`;
};

// Parent-category slugs that use gender/tag filtering on the backend.
// Any slug NOT in this set and not paired with a nested :productType param
// is treated as a flat product-type URL (e.g. /category/pants).
const KNOWN_PARENT_CATEGORIES = new Set([
  'all', 'men', 'women', 'sale', 'new-arrivals', 'new-out', 'collections', 'denim', 'hoodies',
]);

const HERO_TRANSFORMS = 'w_2400,h_1200,c_fill,g_auto,f_auto,q_auto';

function getOptimizedHeroUrl(url: string): string {
  if (!url) return url;
  const match = url.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)/);
  if (!match) return url;
  // Strip any transforms that precede the version segment to avoid conflicting chained transforms.
  const versionMatch = match[2].match(/(v\d+\/.+)$/);
  const assetPath = versionMatch ? versionMatch[1] : match[2];
  return `${match[1]}${HERO_TRANSFORMS}/${assetPath}`;
}

// ─── CategoryHero ─────────────────────────────────────────────────────────────
interface CategoryHeroProps {
  category: string;
  categoryLabel: string;
  productTypeLabel?: string;
  heroConfig: CategoryHeroConfig | null;
  /** Homepage hero image/video URL — used as the background on every category page. */
  homeHeroUrl: string;
}

const isVideoUrl = (url: string): boolean =>
  /\.(mp4|mov|webm|avi)(\?.*)?$/i.test(url) || url.includes('/video/upload/');

const CategoryHero: React.FC<CategoryHeroProps> = ({ category, categoryLabel, productTypeLabel, heroConfig, homeHeroUrl }) => {
  // Text (title + subtitle) comes from the category config/fallback.
  // Background always uses the homepage hero media so every page shares
  // the same strong visual without hardcoding per-category images.
  const config: CategoryHeroMedia =
    (heroConfig?.[category as keyof CategoryHeroConfig] as CategoryHeroMedia | undefined) ??
    HERO_FALLBACKS[category] ?? {
      ...DEFAULT_FALLBACK,
      title: `THE ${(category || 'SHOP').toUpperCase()} SHOP`,
    };

  // Background prefers the admin-managed per-category hero media (saved in the
  // Category Hero Manager). It falls back to the homepage hero only when this
  // category has no saved media, so every page still has a strong visual.
  const usingConfigMedia = Boolean(config.mediaUrl);
  const bgUrl = config.mediaUrl || homeHeroUrl;
  const bgIsVideo = usingConfigMedia ? config.mediaType === 'video' : bgUrl ? isVideoUrl(bgUrl) : false;

  return (
    <div className="relative -mt-20 lg:-mt-24 h-[calc(50vh+5rem)] min-h-[calc(380px+5rem)] lg:h-[calc(50vh+6rem)] lg:min-h-[calc(380px+6rem)] overflow-hidden">
      {/* Background — video or image */}
      {bgIsVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src={bgUrl} />
        </video>
      ) : bgUrl ? (
        <img
          src={getOptimizedHeroUrl(bgUrl)}
          alt={config.title || 'Category hero'}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      ) : null}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between max-w-7xl mx-auto px-6 pt-20 pb-6 lg:pt-24">
        {/* Breadcrumb — small, muted, top-left */}
        <nav className="flex items-center gap-1.5 text-xs text-brand-400 font-grotesk tracking-widest">
          <Link to="/" className="hover:text-accent-electric transition-colors uppercase">
            Home
          </Link>
          <FiChevronRight size={11} className="opacity-50" />
          <Link to={getCategoryPath(category)} className="hover:text-accent-electric transition-colors uppercase">
            {categoryLabel}
          </Link>
          {productTypeLabel && (
            <>
              <FiChevronRight size={11} className="opacity-50" />
              <span className="text-brand-300 uppercase">{productTypeLabel}</span>
            </>
          )}
        </nav>

        {/* Hero text — bottom-anchored */}
        <div className="pb-2">
          <h1 className="font-display text-[clamp(3rem,10vw,7rem)] text-white tracking-widest leading-none mb-3">
            {config.title}
          </h1>
          <p className="font-grotesk text-brand-300 text-base md:text-lg tracking-wide max-w-md">
            {config.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── ProductTypeBar ───────────────────────────────────────────────────────────
interface ProductTypeBarProps {
  category: string;
  productTypes: string[];
  activeProductType?: string;
}

const ProductTypeBar: React.FC<ProductTypeBarProps> = ({ category, productTypes, activeProductType }) => {
  if (!productTypes.length) return null;

  return (
    <div className="bg-brand-900 border-b border-brand-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 overflow-x-auto py-4 scrollbar-hide">
          {productTypes.map((productType) => {
            const productTypeSlug = slugify(productType);
            const isActive = activeProductType === productTypeSlug;

            return (
              <Link
                key={productType}
                to={getProductTypePath(category, productType)}
                className={`flex-shrink-0 px-5 py-2 rounded-full font-grotesk font-semibold text-sm tracking-wide whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-accent-electric text-brand-900 shadow-[0_0_16px_rgba(0,229,255,0.5)]'
                    : 'bg-white text-brand-900 shadow-sm hover:bg-accent-electric hover:shadow-[0_0_16px_rgba(0,229,255,0.45)]'
                }`}
              >
                {productType}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const NotFoundCategoryPage: React.FC = () => (
  <Layout>
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-4xl font-bold mb-4 text-white">404</h1>
        <p className="text-brand-300 mb-6">This category could not be found.</p>
        <Link to="/" className="text-accent-electric hover:underline">
          Return home
        </Link>
      </div>
    </div>
  </Layout>
);

// ─── CategoryPage ─────────────────────────────────────────────────────────────
const CategoryPage: React.FC = () => {
  const { category, productType } = useParams<{ category: string; productType?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [heroConfig, setHeroConfig] = useState<CategoryHeroConfig | null>(null);
  const [homeHeroUrl, setHomeHeroUrl] = useState('');
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [productTypesLoaded, setProductTypesLoaded] = useState(false);

  // Filters are derived directly from the URL so back/forward navigation and
  // programmatic URL changes always stay in sync — no separate state to drift.
  const filters = useMemo(() => ({
    sizes: searchParams.get('sizes')?.split(',').filter(Boolean),
    colors: searchParams.get('colors')?.split(',').filter(Boolean),
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
  }), [searchParams]);

  const page = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || '-createdAt';
  const normalizedCategory = category ? slugify(category) : 'all';
  const normalizedProductType = productType ? slugify(productType) : undefined;
  const parentCategory = normalizedCategory;

  // Flat product-type mode: /category/pants has no known parent category in the URL.
  // Treat the category slug itself as a productType filter so the backend uses
  // productType matching instead of tag filtering.
  const isKnownParent = KNOWN_PARENT_CATEGORIES.has(normalizedCategory);
  const flatProductTypeSlug = !isKnownParent && !normalizedProductType ? normalizedCategory : undefined;
  // The slug used for backend filtering — prefers the explicit :productType param,
  // then the flat slug, then nothing (parent-category page).
  const effectiveProductType = normalizedProductType || flatProductTypeSlug;

  // Find the canonical casing (e.g. "Pants") from the loaded list for display purposes.
  const selectedProductType = productTypes.find(
    (type) => slugify(type) === effectiveProductType
  );
  const productTypeTitle = selectedProductType || (effectiveProductType ? formatRouteLabel(effectiveProductType) : undefined);

  const categoryTitle =
    normalizedCategory === 'all' ? 'All Products'
    : normalizedCategory === 'new-arrivals' ? 'Just Dropped'
    : normalizedCategory === 'new-out' ? 'New Out'
    : formatRouteLabel(normalizedCategory);
  const pageTitle = productTypeTitle || categoryTitle;
  const canonicalPath = normalizedProductType
    ? `${getCategoryPath(parentCategory)}/${normalizedProductType}`
    : getCategoryPath(parentCategory);
  const heroImage = ((heroConfig?.[parentCategory as keyof CategoryHeroConfig] as CategoryHeroMedia | undefined)?.mediaUrl) || '/images/Cualquier_logo.png';

  // Fetch dynamic hero config and the homepage hero image. Both endpoints are
  // cached in productsApi so these are free re-uses of already-warm data.
  useEffect(() => {
    productsApi.getCategoryHeroes().then(setHeroConfig).catch(() => {});
    productsApi.getHomePageImages().then((imgs) => setHomeHeroUrl(imgs.heroImage || '')).catch(() => {});
  }, []);

  useEffect(() => {
    let isMounted = true;
    setProductTypesLoaded(false);
    // Scope product types to the parent category so the nav bar shows only
    // relevant types (e.g. only men's types on /men). In flat product-type
    // mode there is no meaningful parent, so fetch without a category filter
    // (the bar is hidden in that mode anyway).
    productsApi
      .getProductTypes(isKnownParent ? normalizedCategory : undefined)
      .then((types) => {
        if (isMounted) setProductTypes(types);
      })
      .catch(() => {
        if (isMounted) setProductTypes([]);
      })
      .finally(() => {
        if (isMounted) setProductTypesLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, [normalizedCategory]);

  useSeo({
    title: `${pageTitle} | Cualquier`,
    description: effectiveProductType
      ? `Shop ${productTypeTitle} from Cualquier.`
      : normalizedCategory === 'new-arrivals' || normalizedCategory === 'new-out'
        ? 'The freshest drops. All new clothes, just landed at Cualquier.'
        : `Shop ${categoryTitle} apparel and streetwear from Cualquier.`,
    canonicalPath,
    ogType: 'website',
    image: heroImage,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${window.location.origin}/` },
        // Flat product-type mode (/category/pants) has no parent category level.
        ...(isKnownParent ? [
          { '@type': 'ListItem', position: 2, name: categoryTitle, item: `${window.location.origin}${getCategoryPath(parentCategory)}` },
        ] : []),
        ...(effectiveProductType ? [
          { '@type': 'ListItem', position: isKnownParent ? 3 : 2, name: productTypeTitle, item: `${window.location.origin}${canonicalPath}` },
        ] : []),
      ],
    },
  });

  const { products, isLoading, pagination } = useProducts({
    // Send the header category whenever there is a real parent in the URL so a
    // product-type page nested under a category (e.g. /men/pants) is scoped to
    // BOTH the category and the product type. Flat mode (/category/pants) has no
    // known parent, so only the product type is sent.
    category: isKnownParent && normalizedCategory !== 'all'
      ? normalizedCategory
      : undefined,
    // Backend resolves slugs (e.g. "pants" → "Pants") via findProductTypeForSlug,
    // so the raw slug is sufficient — no second fetch needed.
    productType: effectiveProductType,
    page,
    limit: 12,
    sort,
    ...filters,
  });

  const isInvalidProductType = Boolean(
    effectiveProductType &&
    productTypesLoaded &&
    !isLoading &&
    !selectedProductType &&
    pagination.total === 0
  );

  if (isInvalidProductType) {
    return <NotFoundCategoryPage />;
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    const params = new URLSearchParams(searchParams);
    params.delete('sizes');
    params.delete('colors');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('page');
    if (newFilters.sizes?.length) params.set('sizes', newFilters.sizes.join(','));
    if (newFilters.colors?.length) params.set('colors', newFilters.colors.join(','));
    if (newFilters.minPrice) params.set('minPrice', String(newFilters.minPrice));
    if (newFilters.maxPrice) params.set('maxPrice', String(newFilters.maxPrice));
    if (sort !== '-createdAt') params.set('sort', sort);
    setSearchParams(params);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount =
    (filters.sizes?.length || 0) +
    (filters.colors?.length || 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0);

  // Truncated page list (first, last, and a window around current) so large
  // catalogs don't render hundreds of buttons. `'…'` marks a gap.
  const pageItems = useMemo<(number | '…')[]>(() => {
    const total = pagination.pages;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const items: (number | '…')[] = [1];
    const start = Math.max(2, page - 1);
    const end = Math.min(total - 1, page + 1);
    if (start > 2) items.push('…');
    for (let p = start; p <= end; p++) items.push(p);
    if (end < total - 1) items.push('…');
    items.push(total);
    return items;
  }, [pagination.pages, page]);

  return (
    <Layout>
      {/* Full-width cinematic hero.
          Flat mode (/category/pants): passes the product-type slug as `category`
          so the fallback chain generates "THE PANTS SHOP" when no heroConfig key exists.
          Parent-scoped mode (/men/pants): passes the parent slug so the men/women/etc.
          hero config/fallback is used. */}
      <CategoryHero
        category={flatProductTypeSlug ? normalizedCategory : parentCategory}
        categoryLabel={flatProductTypeSlug ? (productTypeTitle ?? categoryTitle) : categoryTitle}
        productTypeLabel={normalizedProductType ? productTypeTitle : undefined}
        heroConfig={heroConfig}
        homeHeroUrl={homeHeroUrl}
      />

      {/* Product-type navigation — hidden in flat mode because there is no parent
          category context to anchor the links to. */}
      {isKnownParent && (
        <ProductTypeBar
          category={parentCategory}
          productTypes={productTypes}
          activeProductType={normalizedProductType}
        />
      )}

      {/* Product section — transparent so space background shows through */}
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Grid header: count left, controls right */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-brand-400 font-grotesk text-xs tracking-widest uppercase">
              {isLoading ? 'Loading…' : `${pagination.total} Products`}
            </p>

            <div className="flex items-center gap-3">
              {/* Unified Filter & Sort button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className={`flex items-center gap-2 px-5 py-2.5 border font-grotesk text-xs tracking-widest uppercase transition-all duration-200 ${
                  activeFilterCount > 0
                    ? 'border-accent-electric text-accent-electric shadow-[0_0_14px_rgba(0,229,255,0.3)]'
                    : 'border-brand-600 text-brand-300 hover:border-brand-400 hover:text-white'
                }`}
              >
                <FiFilter size={14} />
                {activeFilterCount > 0
                  ? `Filters (${activeFilterCount})`
                  : 'Filter & Sort'}
              </button>

              {/* Sort select */}
              <select
                value={sort}
                onChange={handleSortChange}
                className="px-4 py-2.5 bg-brand-800 border border-brand-600 text-brand-300 font-grotesk text-xs tracking-widest focus:outline-none focus:border-accent-electric transition-colors cursor-pointer"
              >
                <option value="-createdAt">Newest</option>
                <option value="price">Price: Low → High</option>
                <option value="-price">Price: High → Low</option>
                <option value="name">Name: A–Z</option>
              </select>
            </div>
          </div>

          {/* Full-width product grid */}
          <ProductGrid products={products} isLoading={isLoading} />

          {/* Pagination — neon accent for active state */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-brand-600 text-brand-400 font-grotesk text-xs tracking-widest uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:border-accent-electric hover:text-accent-electric transition-all"
              >
                Prev
              </button>

              {pageItems.map((item, i) =>
                item === '…' ? (
                  <span key={`gap-${i}`} className="w-9 h-9 flex items-center justify-center text-brand-500 font-grotesk text-sm">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => handlePageChange(item)}
                    className={`w-9 h-9 font-grotesk text-sm tracking-wider transition-all ${
                      page === item
                        ? 'bg-accent-electric text-brand-900 font-bold shadow-[0_0_18px_rgba(0,229,255,0.5)]'
                        : 'border border-brand-600 text-brand-400 hover:border-accent-electric hover:text-accent-electric'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pagination.pages}
                className="px-4 py-2 border border-brand-600 text-brand-400 font-grotesk text-xs tracking-widest uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:border-accent-electric hover:text-accent-electric transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Controlled filter drawer — works on all screen sizes */}
      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </Layout>
  );
};

export default CategoryPage;
