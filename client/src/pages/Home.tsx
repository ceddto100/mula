import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/product/ProductCard';
import { useFeaturedProducts } from '../hooks/useProducts';
import { useSeo } from '../hooks/useSeo';
import { productsApi } from '../api/products.api';
import { HomePageImages, HomePageContent } from '../types';
import { applyAccentColor } from '../utils/brandTheme';

const defaultHomePageImages: HomePageImages = {
  heroImage: '',
  menImage: '',
  womenImage: '',
  collectionImage: '',
  accessoryImage: '',
  saleImage: '',
};


const isVideoUrl = (url?: string): boolean => {
  if (!url) return false;
  return /\.(mp4|mov|webm|avi)(\?.*)?$/i.test(url) || url.includes('/video/upload/');
};

const CLOUDINARY_IMG_RE = /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)/;

const buildCloudinaryImage = (url: string, width: number): string => {
  const match = url.match(CLOUDINARY_IMG_RE);
  if (!match) return url;
  const versionMatch = match[2].match(/(v\d+\/.+)$/);
  const assetPath = versionMatch ? versionMatch[1] : match[2];
  return `${match[1]}f_auto,q_auto,c_fill,g_auto,w_${width}/${assetPath}`;
};

const HERO_WIDTHS = [640, 960, 1280, 1600, 1920];
const TILE_WIDTHS = [480, 720, 960, 1280];

const buildSrcSet = (url: string, widths: number[]): string | undefined => {
  if (!CLOUDINARY_IMG_RE.test(url)) return undefined;
  return widths.map((w) => `${buildCloudinaryImage(url, w)} ${w}w`).join(', ');
};

type HomeMediaOptions = {
  eager?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  hero?: boolean;
  sizes?: string;
};

const renderHomeMedia = (url: string, alt: string, className: string, options: HomeMediaOptions = {}) => {
  const { eager = false, preload = 'none', hero = false, sizes } = options;
  if (isVideoUrl(url)) {
    return (
      <video
        src={url}
        className={className}
        autoPlay
        muted
        loop
        playsInline
        preload={preload}
      />
    );
  }

  const widths = hero ? HERO_WIDTHS : TILE_WIDTHS;
  const srcSet = url ? buildSrcSet(url, widths) : undefined;
  const fallbackWidth = hero ? 1280 : 720;
  const src = url && CLOUDINARY_IMG_RE.test(url) ? buildCloudinaryImage(url, fallbackWidth) : url;

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes || (hero ? '100vw' : '(min-width: 1024px) 25vw, 50vw')}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'low'}
      decoding="async"
    />
  );
};

/* Gucci-style minimal text link: uppercase, letter-spaced, thin underline. */
const CTA_BASE =
  'group inline-flex items-center gap-2 font-grotesk text-xs sm:text-sm font-medium tracking-[0.22em] uppercase pb-1.5 border-b transition-colors duration-300';
const CTA_LIGHT = 'text-white border-white/60 hover:border-white';
const CTA_DARK = 'text-gray-900 border-gray-900/40 hover:border-gray-900';

const CtaLink: React.FC<{ to: string; light?: boolean; children: React.ReactNode }> = ({
  to,
  light,
  children,
}) => (
  <Link to={to} className={`${CTA_BASE} ${light ? CTA_LIGHT : CTA_DARK}`}>
    {children}
    <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={15} />
  </Link>
);

const EYEBROW = 'font-grotesk text-xs sm:text-sm tracking-[0.3em] uppercase';

export const defaultHomePageContent: HomePageContent = {
  hero: {
    badge: 'NEW COLLECTION 2025',
    headline1: 'URBAN',
    headline2: 'EVOLUTION',
    subheading:
      'Street-inspired designs meet contemporary fashion. Bold statements for the modern individual.',
    ctaPrimary: 'SHOP NOW',
    ctaSecondary: 'EXPLORE',
    scrollLabel: 'SCROLL',
  },
  shopByStyle: {
    sectionTitle: 'SHOP BY STYLE',
    panels: [
      { badge: '', title: "WOMEN'S", description: 'Fierce & Elegant', linkText: 'SHOP' },
      { badge: '', title: 'ACCESSORIES', description: '', linkText: 'VIEW' },
      { badge: 'TRENDING', title: "MEN'S", description: 'Bold. Confident. Urban.', linkText: 'DISCOVER' },
      { badge: '', title: 'SALE', description: 'UP TO 50% OFF', linkText: 'SHOP DEALS' },
      { badge: '', title: 'COLLECTIONS', description: 'Curated Style Sets', linkText: 'EXPLORE' },
    ],
    men: { badge: 'TRENDING', title: "MEN'S", description: 'Bold. Confident. Urban.', linkText: 'DISCOVER' },
    women: { badge: '', title: "WOMEN'S", description: 'Fierce & Elegant', linkText: 'SHOP' },
    accessories: { badge: '', title: 'ACCESSORIES', description: '', linkText: 'VIEW' },
    sale: { badge: '', title: 'SALE', description: 'UP TO 50% OFF', linkText: 'SHOP DEALS' },
    collections: { badge: '', title: 'COLLECTIONS', description: 'Curated Style Sets', linkText: 'EXPLORE' },
  },
  freshDrops: {
    badge: 'NEW ARRIVALS',
    sectionTitle: 'FRESH DROPS',
    viewAllLink: 'VIEW ALL',
  },
  brandStatement: {
    headlineLine1: 'DEFINE YOUR',
    headlineLine2: 'STYLE',
    description:
      "Cualquier isn't just fashion—it's a statement. We create pieces that blend urban edge with contemporary design, giving you the confidence to stand out.",
    ctaButton: 'OUR STORY',
  },
  newsletter: {
    title: 'STAY CONNECTED',
    description: 'Get exclusive access to new drops, special offers, and style inspiration.',
    emailPlaceholder: 'Enter your email',
    submitButton: 'SUBSCRIBE',
  },
  brandTheme: {
    accentColor: '',
    heroOverlayEnabled: true,
    heroOverlayColor: '',
    headingFont: 'Inter',
  },
};

const Home: React.FC = () => {
  const { products: featuredProducts, isLoading } = useFeaturedProducts(100);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [homePageImages, setHomePageImages] = useState<HomePageImages>(defaultHomePageImages);
  const [content, setContent] = useState<HomePageContent>(defaultHomePageContent);
  useSeo({ title: 'Cualquier — Contemporary Urban Fashion', description: 'Street-inspired fashion drops and curated collections.', canonicalPath: '/', ogType: 'website', image: '/images/Cualquier_logo.png' });

  useEffect(() => {
    let cancelled = false;

    // Both endpoints are deduped/cached in productsApi, so calling them
    // here in parallel doesn't refetch when App.tsx already warmed the cache.
    Promise.all([
      productsApi.getHomePageImages().catch((err) => {
        console.error('Failed to fetch home page images:', err);
        return null;
      }),
      productsApi.getHomePageContent().catch((err) => {
        console.error('Failed to fetch home page content:', err);
        return null;
      }),
    ]).then(([images, contentData]) => {
      if (cancelled) return;
      if (images) setHomePageImages(images);
      if (contentData) setContent(contentData);
    });

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            // Animations are one-shot; stop observing to free CPU.
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      // threshold 0 fires as soon as ANY part of the section crosses into view.
      // A non-zero threshold can never be met by sections taller than the
      // viewport (e.g. the Fresh Drops grid with many products), which would
      // leave them stuck at opacity-0 — visible space, no content.
      { threshold: 0, rootMargin: '0px 0px -100px 0px' }
    );

    const animatedSections = Array.from(
      document.querySelectorAll<HTMLElement>('.animate-on-scroll')
    );
    animatedSections.forEach((el) => observerRef.current?.observe(el));

    // Safety net: if a section is already in (or scrolled past) the viewport on
    // load — or the observer otherwise misses it — reveal it directly so content
    // is never left permanently hidden behind the entrance animation.
    const revealVisibleSections = () => {
      animatedSections.forEach((el) => {
        if (el.classList.contains('animate-in')) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('animate-in');
          observerRef.current?.unobserve(el);
        }
      });
    };
    revealVisibleSections();
    const revealFallback = window.setTimeout(revealVisibleSections, 1200);

    return () => {
      cancelled = true;
      window.clearTimeout(revealFallback);
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    applyAccentColor(content.brandTheme?.accentColor);
  }, [content.brandTheme?.accentColor]);

  const scrollCarousel = (direction: -1 | 1) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  // Category tiles for the "Shop by Category" grid (Gucci-style labeled tiles).
  const categoryTiles = [
    { panel: content.shopByStyle.women, img: homePageImages.womenImage, href: '/category/women' },
    { panel: content.shopByStyle.men, img: homePageImages.menImage, href: '/category/men' },
    { panel: content.shopByStyle.accessories, img: homePageImages.accessoryImage, href: '/category/accessories' },
    { panel: content.shopByStyle.sale, img: homePageImages.saleImage, href: '/category/sale' },
  ];

  return (
    <Layout>
      {/* ───────────────────────── HERO ─────────────────────────
          Full-bleed campaign media that extends behind the transparent
          header. Minimal centered caption anchored toward the bottom with
          understated underlined text links (Gucci editorial style). */}
      <section className="relative min-h-screen overflow-hidden -mt-20 lg:-mt-24">
        <div className="absolute inset-0">
          {renderHomeMedia(homePageImages.heroImage, 'Fashion', 'absolute inset-0 w-full h-full object-cover', { eager: true, preload: 'metadata', hero: true, sizes: '100vw' })}
        </div>

        {/* Soft gradient purely for caption legibility — keeps the image clean */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/15 pointer-events-none" aria-hidden="true" />

        {/* Hero caption — centered, anchored toward the bottom */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-end text-center px-4 pb-24 pt-28 lg:pb-28">
          <div className="max-w-3xl">
            {content.hero.badge && (
              <p className={`${EYEBROW} text-white/90 mb-5 animate-fade-in-delayed`}>
                {content.hero.badge}
              </p>
            )}

            <h1 className="font-display text-white leading-[0.95] text-6xl md:text-7xl lg:text-8xl animate-slide-up" style={{ textShadow: '0 2px 18px rgba(0,0,0,0.55)' }}>
              {content.hero.headline1}{' '}
              <span className="text-accent-electric">{content.hero.headline2}</span>
            </h1>

            {content.hero.subheading && (
              <p className="mt-6 text-base md:text-lg text-white/90 font-grotesk max-w-xl mx-auto leading-relaxed whitespace-pre-line animate-fade-in-delayed" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
                {content.hero.subheading}
              </p>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 animate-fade-in-more-delayed">
              <CtaLink to="/category/new-arrivals" light>
                {content.hero.ctaPrimary}
              </CtaLink>
              <CtaLink to="/category/collections" light>
                {content.hero.ctaSecondary}
              </CtaLink>
            </div>
          </div>

          {/* Minimal scroll cue */}
          {content.hero.scrollLabel && (
            <div className="mt-14 flex flex-col items-center gap-2 text-white/80">
              <span className="text-[10px] font-grotesk tracking-[0.3em] uppercase">{content.hero.scrollLabel}</span>
              <span className="w-px h-10 bg-white/40" />
            </div>
          )}
        </div>
      </section>

      {/* ──────────────── EDITORIAL CAMPAIGN BLOCK ────────────────
          One large full-bleed image with a centered overlay caption —
          the recurring editorial unit on luxury homepages. */}
      <section className="relative animate-on-scroll opacity-100 translate-y-0 md:opacity-0 md:translate-y-12 transition-all duration-1000 cv-auto">
        <Link
          to="/category/collections"
          className="group relative block overflow-hidden bg-brand-900"
        >
          <div className="aspect-[3/4] sm:aspect-[16/10] lg:aspect-[16/8]">
            {homePageImages.collectionImage &&
              renderHomeMedia(
                homePageImages.collectionImage,
                content.shopByStyle.collections.title,
                'w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105',
                { sizes: '100vw' }
              )}
          </div>

          <div className="absolute inset-0 bg-black/25" aria-hidden="true" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
            {content.shopByStyle.collections.badge && (
              <p className={`${EYEBROW} text-white/90 mb-4`}>{content.shopByStyle.collections.badge}</p>
            )}
            <h2 className="font-display text-5xl md:text-7xl mb-4" style={{ textShadow: '0 2px 18px rgba(0,0,0,0.5)' }}>
              {content.shopByStyle.collections.title}
            </h2>
            {content.shopByStyle.collections.description && (
              <p className="text-base md:text-lg text-white/90 font-grotesk max-w-md mb-8">
                {content.shopByStyle.collections.description}
              </p>
            )}
            <span className={`${CTA_BASE} ${CTA_LIGHT}`}>
              {content.shopByStyle.collections.linkText}
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={15} />
            </span>
          </div>
        </Link>
      </section>

      {/* ──────────────── SHOP BY CATEGORY ────────────────
          Clean grid of labeled tiles with the caption beneath the image. */}
      <section className="py-20 lg:py-24 bg-transparent animate-on-scroll opacity-100 translate-y-0 md:opacity-0 md:translate-y-12 transition-all duration-1000 cv-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-display text-4xl md:text-6xl text-gray-900">{content.shopByStyle.sectionTitle}</h2>
            <div className="w-16 h-px bg-gray-900/60 mx-auto mt-5" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
            {categoryTiles.map(({ panel, img, href }) => (
              <Link key={panel.title} to={href} className="group block text-center">
                <div className="relative aspect-[3/4] overflow-hidden bg-brand-900 mb-5">
                  {img &&
                    renderHomeMedia(
                      img,
                      panel.title,
                      'w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105'
                    )}
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-gray-900 tracking-wide">{panel.title}</h3>
                {panel.description && (
                  <p className="mt-1 text-sm text-gray-600 font-grotesk">{panel.description}</p>
                )}
                <span className="inline-block mt-3 text-[11px] font-grotesk font-medium tracking-[0.22em] uppercase text-gray-900 border-b border-gray-900/40 pb-1 transition-colors group-hover:border-gray-900">
                  {panel.linkText}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── NEW IN — PRODUCT CAROUSEL ────────────────
          Horizontal scroll-snap rail of featured products with arrow controls. */}
      <section className="py-20 lg:py-24 bg-transparent animate-on-scroll opacity-100 translate-y-0 md:opacity-0 md:translate-y-12 transition-all duration-1000 cv-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10 lg:mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {content.freshDrops.badge && (
                <p className={`${EYEBROW} text-gray-500 mb-3`}>{content.freshDrops.badge}</p>
              )}
              <h2 className="font-display text-4xl md:text-6xl text-gray-900">{content.freshDrops.sectionTitle}</h2>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollCarousel(-1)}
                  aria-label="Previous products"
                  className="w-11 h-11 flex items-center justify-center border border-gray-900/30 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                >
                  <FiChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel(1)}
                  aria-label="Next products"
                  className="w-11 h-11 flex items-center justify-center border border-gray-900/30 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
              <div className="hidden sm:block">
                <CtaLink to="/category/new-arrivals">{content.freshDrops.viewAllLink}</CtaLink>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex gap-6 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="shrink-0 w-[70%] sm:w-[44%] md:w-[30%] lg:w-[23%] animate-pulse">
                  <div className="aspect-[3/4] bg-brand-700/40 rounded-2xl mb-3" />
                  <div className="h-3.5 bg-brand-700/40 rounded mb-2 w-3/4" />
                  <div className="h-3.5 bg-brand-700/40 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 font-grotesk tracking-wide">No products found</p>
            </div>
          ) : (
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-4 px-4"
            >
              {featuredProducts.map((product) => (
                <div
                  key={product._id}
                  className="snap-start shrink-0 w-[70%] sm:w-[44%] md:w-[30%] lg:w-[23%]"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* Mobile view-all */}
          <div className="mt-10 text-center sm:hidden">
            <CtaLink to="/category/new-arrivals">{content.freshDrops.viewAllLink}</CtaLink>
          </div>
        </div>
      </section>

      {/* ──────────────── BRAND STATEMENT (EDITORIAL) ──────────────── */}
      <section className="relative py-28 lg:py-36 bg-brand-900 overflow-hidden animate-on-scroll opacity-100 translate-y-0 md:opacity-0 md:translate-y-12 transition-all duration-1000 cv-auto">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] overflow-hidden pointer-events-none" aria-hidden="true">
          <span className="font-display text-[20vw] text-white whitespace-nowrap">CUALQUIER</span>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-5xl md:text-7xl text-white mb-8 leading-tight">
            {content.brandStatement.headlineLine1}
            <br />
            <span className="text-accent-electric">{content.brandStatement.headlineLine2}</span>
          </h2>
          <p className="text-lg md:text-xl text-brand-100 font-grotesk max-w-2xl mx-auto mb-12 leading-relaxed whitespace-pre-line">
            {content.brandStatement.description}
          </p>
          <div className="flex justify-center">
            <CtaLink to="/about" light>
              {content.brandStatement.ctaButton}
            </CtaLink>
          </div>
        </div>
      </section>

      {/* ──────────────── NEWSLETTER ──────────────── */}
      <section className="py-20 lg:py-24 bg-transparent animate-on-scroll opacity-100 translate-y-0 md:opacity-0 md:translate-y-12 transition-all duration-1000 cv-auto">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-gray-900 mb-4">{content.newsletter.title}</h2>
          <p className="text-base md:text-lg text-gray-600 font-grotesk mb-10 whitespace-pre-line">
            {content.newsletter.description}
          </p>

          <form
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder={content.newsletter.emailPlaceholder}
              className="flex-1 px-5 py-3.5 bg-white border border-gray-300 text-gray-900 font-grotesk focus:outline-none focus:border-gray-900 transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-gray-900 text-white font-grotesk text-sm font-medium tracking-[0.18em] uppercase hover:bg-gray-700 transition-colors"
            >
              {content.newsletter.submitButton}
            </button>
          </form>
        </div>
      </section>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-slide-up {
          animation: slide-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-fade-in-delayed {
          animation: fade-in 0.8s ease-out 0.35s forwards;
          opacity: 0;
        }

        .animate-fade-in-more-delayed {
          animation: fade-in 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }

        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </Layout>
  );
};

export default Home;
