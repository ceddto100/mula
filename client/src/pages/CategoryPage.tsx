import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { FiFilter, FiChevronRight } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import { useProducts } from '../hooks/useProducts';
import { productsApi } from '../api/products.api';
import { capitalizeFirst } from '../utils/formatters';
import { CategoryHeroConfig, CategoryHeroMedia } from '../types';

// ─── Hardcoded fallbacks (used until API data loads or for unlisted categories) ─
const HERO_FALLBACKS: Record<string, CategoryHeroMedia> = {
  men: {
    mediaUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80',
    mediaType: 'image',
    title: "THE MEN'S EDIT",
    subtitle: 'Fresh drops. Bold moves. No excuses.',
  },
  women: {
    mediaUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80',
    mediaType: 'image',
    title: "THE WOMEN'S SHOP",
    subtitle: 'Trending fits for your soft-life era.',
  },
  denim: {
    mediaUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1920&q=80',
    mediaType: 'image',
    title: 'THE DENIM SHOP',
    subtitle: 'Lived-in. Broken-in. Built different.',
  },
  sale: {
    mediaUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1920&q=80',
    mediaType: 'image',
    title: 'THE SALE',
    subtitle: "Last call. Major steals. Shop before it's gone.",
  },
  hoodies: {
    mediaUrl: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=1920&q=80',
    mediaType: 'image',
    title: 'THE HOODIE DROP',
    subtitle: 'Layer up. Stand out.',
  },
  all: {
    mediaUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1920&q=80',
    mediaType: 'image',
    title: 'ALL PRODUCTS',
    subtitle: 'The full collection. Nothing held back.',
  },
};

const DEFAULT_FALLBACK: Omit<CategoryHeroMedia, 'title'> = {
  mediaUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1920&q=80',
  mediaType: 'image',
  subtitle: 'Drop season is now.',
};

// ─── SubCategory Config ───────────────────────────────────────────────────────
type SubPill = { label: string; href: string };

const SUBCATEGORIES: Record<string, SubPill[]> = {
  men: [
    { label: 'Graphic Tees', href: '/category/graphic-tees' },
    { label: 'Cargos', href: '/category/cargos' },
    { label: 'Denim', href: '/category/denim' },
    { label: 'Hoodies', href: '/category/hoodies' },
  ],
  women: [
    { label: 'Dresses', href: '/category/dresses' },
    { label: 'Matching Sets', href: '/category/matching-sets' },
    { label: 'Basics', href: '/category/basics' },
    { label: 'Swim', href: '/category/swim' },
  ],
  sale: [
    { label: 'Under $20', href: '/category/sale?maxPrice=20' },
    { label: 'Last Chance', href: '/category/sale?sort=-createdAt' },
    { label: '50% Off', href: '/category/sale' },
  ],
};

const HERO_TRANSFORMS = 'w_2400,h_1200,c_fill,g_auto,f_auto,q_auto';

function getOptimizedHeroUrl(url: string): string {
  if (!url) return url;
  const match = url.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)/);
  if (!match) return url;
  return `${match[1]}${HERO_TRANSFORMS}/${match[2]}`;
}

// ─── CategoryHero ─────────────────────────────────────────────────────────────
interface CategoryHeroProps {
  category: string;
  breadcrumbLabel: string;
  heroConfig: CategoryHeroConfig | null;
}

const CategoryHero: React.FC<CategoryHeroProps> = ({ category, breadcrumbLabel, heroConfig }) => {
  // Use API data if available, then hardcoded fallback, then generic default
  const config: CategoryHeroMedia =
    (heroConfig?.[category as keyof CategoryHeroConfig] as CategoryHeroMedia | undefined) ??
    HERO_FALLBACKS[category] ?? {
      ...DEFAULT_FALLBACK,
      title: `THE ${(category || 'SHOP').toUpperCase()} SHOP`,
    };

  return (
    <div className="relative h-[50vh] min-h-[380px] overflow-hidden">
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
      ) : (
        <img
          src={getOptimizedHeroUrl(config.mediaUrl)}
          alt={config.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}

      {/* Cinematic gradient: transparent top → solid brand-900 bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/55 to-brand-900/10" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between max-w-7xl mx-auto px-6 py-6">
        {/* Breadcrumb — small, muted, top-left */}
        <nav className="flex items-center gap-1.5 text-xs text-brand-400 font-grotesk tracking-widest">
          <Link to="/" className="hover:text-accent-electric transition-colors uppercase">
            Home
          </Link>
          <FiChevronRight size={11} className="opacity-50" />
          <span className="text-brand-300 uppercase">{breadcrumbLabel}</span>
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

// ─── SubCategoryBar ───────────────────────────────────────────────────────────
interface SubCategoryBarProps {
  category: string;
}

const SubCategoryBar: React.FC<SubCategoryBarProps> = ({ category }) => {
  const pills = SUBCATEGORIES[category];
  if (!pills) return null;

  return (
    <div className="bg-brand-900/70 backdrop-blur-sm border-b border-brand-700/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 overflow-x-auto py-4 scrollbar-hide">
          {pills.map((pill) => (
            <Link
              key={pill.label}
              to={pill.href}
              className="flex-shrink-0 px-5 py-2 rounded-full border border-brand-600 text-brand-300 font-grotesk text-sm tracking-wide whitespace-nowrap transition-all duration-200 hover:border-accent-electric hover:text-accent-electric hover:shadow-[0_0_10px_rgba(0,229,255,0.25)]"
            >
              {pill.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── CategoryPage ─────────────────────────────────────────────────────────────
const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [heroConfig, setHeroConfig] = useState<CategoryHeroConfig | null>(null);

  const [filters, setFilters] = useState({
    sizes: searchParams.get('sizes')?.split(',').filter(Boolean),
    colors: searchParams.get('colors')?.split(',').filter(Boolean),
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
  });

  const page = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || '-createdAt';
  const normalizedCategory = category?.toLowerCase().trim() || 'all';

  // Fetch dynamic hero config — silently falls back to hardcoded if unavailable
  useEffect(() => {
    productsApi.getCategoryHeroes().then(setHeroConfig).catch(() => {});
  }, []);

  const { products, isLoading, pagination } = useProducts({
    category: normalizedCategory !== 'all' ? normalizedCategory : undefined,
    page,
    limit: 12,
    sort,
    ...filters,
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
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

  const categoryTitle =
    normalizedCategory === 'all' ? 'All Products' : capitalizeFirst(normalizedCategory);

  return (
    <Layout>
      {/* Full-width cinematic hero */}
      <CategoryHero
        category={normalizedCategory}
        breadcrumbLabel={categoryTitle}
        heroConfig={heroConfig}
      />

      {/* Horizontal subcategory pills */}
      <SubCategoryBar category={normalizedCategory} />

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
