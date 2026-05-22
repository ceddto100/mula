import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/product/ProductGrid';
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
      sizes={sizes || (hero ? '60vw' : '(min-width: 1024px) 40vw, 100vw')}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'low'}
      decoding="async"
    />
  );
};

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
    submitButton: 'SUBSCRIBE →',
  },
  brandTheme: {
    accentColor: '',
    heroOverlayEnabled: true,
    heroOverlayColor: '',
    headingFont: 'Inter',
  },
};

const Home: React.FC = () => {
  const { products: featuredProducts, isLoading } = useFeaturedProducts(8);
  const observerRef = useRef<IntersectionObserver | null>(null);
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
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      cancelled = true;
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    applyAccentColor(content.brandTheme?.accentColor);
  }, [content.brandTheme?.accentColor]);

  return (
    <Layout>
      {/* Hero Section — extends behind the transparent header so the image fills
          the full viewport from top to bottom (Gucci-style full-bleed hero) */}
      <section className="relative min-h-screen overflow-hidden -mt-20 lg:-mt-24">
        <div className="absolute inset-0">
          {/* Full-width hero media — no tint or overlay, image shows at full clarity */}
          {renderHomeMedia(homePageImages.heroImage, 'Fashion', 'absolute inset-0 w-full h-full object-cover', { eager: true, preload: 'metadata', hero: true, sizes: '100vw' })}
        </div>

        {/* Decorative Arrows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-10 text-accent-electric opacity-20 text-9xl">→</div>
          <div className="absolute bottom-40 right-20 text-accent-neon opacity-20 text-9xl rotate-45">→</div>
          <div className="absolute top-1/2 left-1/3 text-white opacity-10 text-9xl -rotate-12">→</div>
        </div>

        {/* Hero Content — pt offsets the transparent header so text never hides behind it */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 min-h-screen flex items-center pt-20 lg:pt-24">
          <div className="lg:w-1/2">
            <div className="mb-6 overflow-hidden">
              <div className="inline-block bg-accent-electric text-brand-900 px-6 py-2 font-grotesk font-bold text-sm tracking-wider animate-slide-up">
                {content.hero.badge}
              </div>
            </div>

            <div className="overflow-hidden mb-4">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-display text-white leading-none animate-slide-up-delayed" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.85)' }}>
                {content.hero.headline1}
              </h1>
            </div>

            <div className="overflow-hidden mb-8">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-display text-accent-electric leading-none animate-slide-up-more-delayed" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.85)' }}>
                {content.hero.headline2}
              </h2>
            </div>

            <div className="overflow-hidden mb-12">
              <p className="text-xl md:text-2xl text-white font-grotesk max-w-lg leading-relaxed animate-fade-in-delayed whitespace-pre-line" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
                {content.hero.subheading}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-more-delayed">
              <Link
                to="/category/new-arrivals"
                className="group relative px-10 py-5 bg-white text-brand-900 font-grotesk font-bold text-lg tracking-wide overflow-hidden rounded-full transform hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {content.hero.ctaPrimary}
                  <FiArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
                </span>
              </Link>

              <Link
                to="/category/collections"
                className="group px-10 py-5 border-2 border-white text-white font-grotesk font-bold text-lg tracking-wide rounded-full hover:bg-white hover:text-brand-900 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  {content.hero.ctaSecondary}
                  <FiArrowUpRight className="group-hover:rotate-45 transition-transform" size={24} />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-grotesk tracking-widest">{content.hero.scrollLabel}</span>
            <div className="w-0.5 h-12 bg-white/50" />
          </div>
        </div>
      </section>

      {/* Shop By Style — full-bleed horizontal strip, no outer padding */}
      <section className="relative bg-transparent animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000 cv-auto">
        {/* Section label — constrained to readable width */}
        <div className="py-14 text-center max-w-7xl mx-auto px-4">
          <h2 className="text-6xl md:text-7xl font-display text-gray-900 mb-4">{content.shopByStyle.sectionTitle}</h2>
          <div className="w-24 h-1 bg-accent-electric mx-auto" />
        </div>

        {/* Mobile: 2:3 portrait cards stacked (grid-cols-1, no lg: override on grid).
            Desktop: each card is a full-viewport-width section with a 16:9 frame,
            content beautifully centred via lg: prefixed utilities only. */}
        <div className="grid grid-cols-1 gap-1">
          {[
            { panel: content.shopByStyle.women,       img: homePageImages.womenImage,      href: '/category/women' },
            { panel: content.shopByStyle.accessories, img: homePageImages.accessoryImage,  href: '/category/accessories' },
            { panel: content.shopByStyle.men,         img: homePageImages.menImage,        href: '/category/men' },
            { panel: content.shopByStyle.sale,        img: homePageImages.saleImage,       href: '/category/sale' },
            { panel: content.shopByStyle.collections, img: homePageImages.collectionImage, href: '/category/collections' },
          ].map(({ panel, img, href }) => (
            <Link
              key={panel.title}
              to={href}
              className="relative group overflow-hidden bg-brand-900 aspect-[2/3] lg:aspect-[16/9] block"
            >
              {img && (
                <div className="absolute inset-0">
                  {renderHomeMedia(img, panel.title, 'w-full h-full object-cover lg:transition-transform lg:duration-700 lg:group-hover:scale-105', { sizes: '100vw' })}
                </div>
              )}

              {/* Mobile content: anchored bottom-left — no lg: classes here */}
              <div className="absolute bottom-0 left-0 p-6 lg:hidden">
                {panel.badge && (
                  <div className="inline-block bg-accent-electric text-brand-900 px-3 py-1 text-xs font-grotesk font-bold mb-3 tracking-wider">
                    {panel.badge}
                  </div>
                )}
                <h3 className="text-3xl font-display text-white mb-1" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>
                  {panel.title}
                </h3>
                {panel.description && (
                  <p className="text-sm text-white/80 font-grotesk mb-3">{panel.description}</p>
                )}
                <span className="inline-flex items-center gap-2 text-accent-electric font-grotesk font-semibold text-sm tracking-wider group-hover:gap-4 transition-all">
                  {panel.linkText} <FiArrowRight size={16} />
                </span>
              </div>

              {/* Desktop content: centred inside the 16:9 frame — all lg: prefixed */}
              <div className="hidden lg:absolute lg:inset-0 lg:flex lg:flex-col lg:items-center lg:justify-center lg:text-center lg:px-16">
                {panel.badge && (
                  <div className="lg:inline-block lg:bg-accent-electric lg:text-brand-900 lg:px-4 lg:py-1 lg:text-sm lg:font-grotesk lg:font-bold lg:mb-6 lg:tracking-widest">
                    {panel.badge}
                  </div>
                )}
                <h3 className="lg:text-7xl lg:font-display lg:text-white lg:mb-4" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.9)' }}>
                  {panel.title}
                </h3>
                {panel.description && (
                  <p className="lg:text-xl lg:text-white/90 lg:font-grotesk lg:mb-8 lg:max-w-lg">{panel.description}</p>
                )}
                <span className="lg:inline-flex lg:items-center lg:gap-3 lg:text-accent-electric lg:font-grotesk lg:font-semibold lg:text-base lg:tracking-widest lg:border-b lg:border-accent-electric lg:pb-1 lg:group-hover:gap-5 lg:transition-all">
                  {panel.linkText} <FiArrowRight size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products with Bold Header */}
      <section className="py-24 bg-transparent animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000 cv-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-block bg-accent-electric text-brand-900 px-4 py-1 text-sm font-grotesk font-bold mb-4">
                {content.freshDrops.badge}
              </div>
              <h2 className="text-6xl md:text-7xl font-display text-gray-900">{content.freshDrops.sectionTitle}</h2>
            </div>
            <Link
              to="/category/new-arrivals"
              className="group inline-flex items-center gap-3 text-gray-900 font-grotesk font-bold text-lg border-b-2 border-gray-900 pb-2 hover:border-accent-electric hover:text-accent-electric transition-all"
            >
              {content.freshDrops.viewAllLink}
              <FiArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
            </Link>
          </div>

          <ProductGrid products={featuredProducts} isLoading={isLoading} />
        </div>
      </section>

      {/* Bold Brand Statement Section */}
      <section className="relative py-32 bg-brand-900 overflow-hidden animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000 cv-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-800/80 to-brand-900" />

        {/* Large Background Text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 overflow-hidden pointer-events-none" aria-hidden="true">
          <span className="font-display text-[20vw] text-white whitespace-nowrap">CUALQUIER</span>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-6xl md:text-8xl font-display text-white mb-8 leading-tight">
            {content.brandStatement.headlineLine1}
            <br />
            <span className="text-accent-electric">{content.brandStatement.headlineLine2}</span>
          </h2>
          <p className="text-xl md:text-2xl text-brand-100 font-grotesk max-w-3xl mx-auto mb-12 leading-relaxed whitespace-pre-line">
            {content.brandStatement.description}
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-3 bg-accent-electric text-brand-900 px-10 py-5 font-grotesk font-bold text-lg tracking-wide rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105"
          >
            {content.brandStatement.ctaButton}
            <FiArrowUpRight size={24} />
          </Link>
        </div>
      </section>

      {/* Newsletter - Bold CTA */}
      <section className="py-20 bg-transparent animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000 cv-auto">
        <div className="max-w-4xl mx-auto px-4">
          <div
            className="p-12 lg:p-16 relative overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--accent-electric, #00E5FF) 44%, #0f1f38 56%), color-mix(in srgb, var(--accent-electric, #00E5FF) 20%, #081121 80%))',
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(255,255,255,0.2),transparent_48%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.14),transparent_42%)] opacity-60" />

            {/* Arrow Pattern */}
            <div className="absolute top-2 right-10 text-white/25 text-8xl orbit-float-slow select-none">→</div>
            <div className="absolute bottom-3 left-8 text-white/20 text-8xl rotate-180 orbit-float-fast select-none">→</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/80 rounded-full shadow-[0_0_18px_rgba(255,255,255,0.8)] orbit-center-glow" />

            <div className="relative z-10 text-center text-white">
              <h2 className="text-5xl md:text-6xl font-display mb-6">{content.newsletter.title}</h2>
              <p className="text-xl font-grotesk mb-8 opacity-90 whitespace-pre-line">
                {content.newsletter.description}
              </p>

              <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <input
                  type="email"
                  placeholder={content.newsletter.emailPlaceholder}
                  className="flex-1 px-6 py-4 bg-white text-brand-900 font-grotesk text-lg focus:outline-none focus:ring-4 focus:ring-accent-electric transition-all"
                />
                <button
                  type="submit"
                  className="px-10 py-4 bg-accent-electric text-brand-900 font-grotesk font-bold text-lg tracking-wide rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105"
                >
                  {content.newsletter.submitButton}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-slide-up-delayed {
          animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
          opacity: 0;
        }

        .animate-slide-up-more-delayed {
          animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
          opacity: 0;
        }

        .animate-fade-in-delayed {
          animation: fade-in 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }

        .animate-fade-in-more-delayed {
          animation: fade-in 0.8s ease-out 0.8s forwards;
          opacity: 0;
        }

        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-700 {
          animation-delay: 700ms;
        }

        @keyframes orbit-float-slow {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); }
          25% { transform: translate3d(-6px, -12px, 0) rotate(-4deg); }
          50% { transform: translate3d(0, -20px, 0) rotate(0deg); }
          75% { transform: translate3d(6px, -10px, 0) rotate(4deg); }
          100% { transform: translate3d(0, 0, 0) rotate(0deg); }
        }

        @keyframes orbit-float-fast {
          0% { transform: rotate(180deg) translate3d(0, 0, 0); }
          25% { transform: rotate(180deg) translate3d(8px, 10px, 0); }
          50% { transform: rotate(180deg) translate3d(0, 18px, 0); }
          75% { transform: rotate(180deg) translate3d(-8px, 10px, 0); }
          100% { transform: rotate(180deg) translate3d(0, 0, 0); }
        }

        @keyframes orbit-center-glow {
          0%, 100% { opacity: 0.65; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.35); }
        }

        .orbit-float-slow {
          animation: orbit-float-slow 6.5s ease-in-out infinite;
        }

        .orbit-float-fast {
          animation: orbit-float-fast 4.8s ease-in-out infinite;
        }

        .orbit-center-glow {
          animation: orbit-center-glow 3s ease-in-out infinite;
        }
      `}</style>
    </Layout>
  );
};

export default Home;
