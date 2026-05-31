import React, { useState, useEffect } from 'react';
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
}

const CategoryHero: React.FC<CategoryHeroProps> = ({ category, categoryLabel, productTypeLabel, heroConfig }) => {
  // Use API data if available; otherwise fall back to text-only defaults with no media URL
  const config: CategoryHeroMedia =
    (heroConfig?.[category as keyof CategoryHeroConfig] as CategoryHeroMedia | undefined) ??
    HERO_FALLBACKS[category] ?? {
      ...DEFAULT_FALLBACK,
      title: `THE ${(category || 'SHOP').toUpperCase()} SHOP`,
    };

  return (
    <div className="relative -mt-20 lg:-mt-24 h-[calc(50vh+5rem)] min-h-[calc(380px+5rem)] lg:h-[calc(50vh+6rem)] lg:min-h-[calc(380px+6rem)] overflow-hidden">
      {/* Background — video or image */}
      {config.mediaType === 'video' ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src={config.mediaUrl} />
        </video>
      ) : config.mediaUrl ? (
        <img
          src={getOptimizedHeroUrl(config.mediaUrl)}
          alt={config.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
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
    <div className="bg-brand-900/70 backdrop-blur-sm border-b border-brand-700/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 overflow-x-auto py-4 scrollbar-hide">
          {productTypes.map((productType) => {
            const productTypeSlug = slugify(productType);
            const isActive = activeProductType === productTypeSlug;

            return (
              <Link
                key={productType}
                to={getProductTypePath(category, productType)}
                className={`flex-shrink-0 px-5 py-2 rounded-full border font-grotesk text-sm tracking-wide whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'border-accent-electric text-accent-electric shadow-[0_0_10px_rgba(0,229,255,0.25)]'
                    : 'border-brand-600 text-brand-300 hover:border-accent-electric hover:text-accent-electric hover:shadow-[0_0_10px_rgba(0,229,255,0.25)]'
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
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [productTypesLoaded, setProductTypesLoaded] = useState(false);

  const [filters, setFilters] = useState({
    sizes: searchParams.get('sizes')?.split(',').filter(Boolean),
    colors: searchParams.get('colors')?.split(',').filter(Boolean),
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
  });

  const page = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || '-createdAt';
  const normalizedCategory = category ? slugify(category) : 'all';
  const normalizedProductType = productType ? slugify(productType) : undefined;
  const parentCategory = normalizedCategory;
  const selectedProductType = productTypes.find((type) => slugify(type) === normalizedProductType);
  const productTypeTitle = selectedProductType || (normalizedProductType ? formatRouteLabel(normalizedProductType) : undefined);

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

  // Fetch dynamic hero config — silently falls back to hardcoded if unavailable
  useEffect(() => {
    productsApi.getCategoryHeroes().then(setHeroConfig).catch(() => {});
  }, []);

  useEffect(() => {
    let isMounted = true;
    setProductTypesLoaded(false);
    // Scope product types to the parent category so the nav bar shows only
    // relevant types (e.g. only men's types on /men).
    productsApi
      .getProductTypes(normalizedCategory)
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
    description: normalizedProductType
      ? `Shop ${productTypeTitle} for ${categoryTitle} from Cualquier.`
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
        { '@type': 'ListItem', position: 2, name: categoryTitle, item: `${window.location.origin}${getCategoryPath(parentCategory)}` },
        ...(normalizedProductType ? [
          { '@type': 'ListItem', position: 3, name: productTypeTitle, item: `${window.location.origin}${canonicalPath}` },
        ] : []),
      ],
    },
  });

  const { products, isLoading, pagination } = useProducts({
    // When a productType is present the backend filters by productType alone;
    // sending category too would be redundant and the backend ignores it.
    // For parent-category pages pass the category; skip it for "all" / new-arrivals / new-out.
    category: normalizedProductType
      ? undefined
      : parentCategory === 'all' ? undefined : parentCategory,
    // Use the raw slug — the backend resolves it to the canonical productType
    // via findProductTypeForSlug so we never need a separate round-trip to get
    // the canonical casing before the product fetch can start.
    productType: normalizedProductType,
    page,
    limit: 12,
    sort,
    ...filters,
  });

  const isInvalidProductType = Boolean(
    normalizedProductType &&
    productTypesLoaded &&
    !isLoading &&
    !selectedProductType &&
    pagination.total === 0
  );

  if (isInvalidProductType) {
    return <NotFoundCategoryPage />;
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
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

  return (
    <Layout>
      {/* Full-width cinematic hero */}
      <CategoryHero
        category={parentCategory}
        categoryLabel={categoryTitle}
        productTypeLabel={normalizedProductType ? productTypeTitle : undefined}
        heroConfig={heroConfig}
      />

      {/* Product-type navigation is generated from active product data for this parent category. */}
      <ProductTypeBar
        category={parentCategory}
        productTypes={productTypes}
        activeProductType={normalizedProductType}
      />

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

              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-9 h-9 font-grotesk text-sm tracking-wider transition-all ${
                    page === i + 1
                      ? 'bg-accent-electric text-brand-900 font-bold shadow-[0_0_18px_rgba(0,229,255,0.5)]'
                      : 'border border-brand-600 text-brand-400 hover:border-accent-electric hover:text-accent-electric'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

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
