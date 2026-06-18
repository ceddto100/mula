import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
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
  womenPantsImage: '',
  womenShirtsImage: '',
  menPantsImage: '',
  menShirtsImage: '',
  promoLeftImage: '',
  promoRightImage: '',
  serviceImage1: '',
  serviceImage2: '',
  serviceImage3: '',
};

const HERO_TEXT_SHADOW = '0 2px 16px rgba(0,0,0,0.85)';
const TILE_TEXT_SHADOW = '0 1px 12px rgba(0,0,0,0.9)';


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
  announcementBar: {
    enabled: true,
    text: 'COMPLIMENTARY SHIPPING ON ALL ORDERS',
  },
  hero: {
    badge: 'NEW COLLECTION 2025',
    headline1: 'URBAN',
    headline2: 'EVOLUTION',
    subheading:
      'Street-inspired designs meet contemporary fashion. Bold statements for the modern individual.',
    ctaPrimary: 'FOR HER',
    ctaSecondary: 'FOR HIM',
    scrollLabel: 'SCROLL',
  },
  promoSplit: {
    left: { title: 'NEW ARRIVALS', linkText: 'SHOP NOW' },
    right: { title: 'SALE', linkText: 'SHOP NOW' },
  },
  services: {
    sectionTitle: 'OUR SERVICES',
    items: [
      { title: 'BOOK AN APPOINTMENT', linkText: 'Reserve a personal styling session.' },
      { title: 'PERSONALIZATION', linkText: 'Make it uniquely yours.' },
      { title: 'COLLECT IN STORE', linkText: 'Order online, pick up nearby.' },
    ],
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
    womenPants: { badge: '', title: "WOMEN'S PANTS", description: '', linkText: 'SHOP' },
    womenShirts: { badge: '', title: "WOMEN'S SHIRTS", description: '', linkText: 'SHOP' },
    menPants: { badge: '', title: "MEN'S PANTS", description: '', linkText: 'SHOP' },
    menShirts: { badge: '', title: "MEN'S SHIRTS", description: '', linkText: 'SHOP' },
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
  const { products: featuredProducts, isLoading } = useFeaturedProducts(100);
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

  // New sections fall back to defaults so the page renders correctly even if an
  // older content document (saved before these fields existed) is returned.
  const promoSplit = content.promoSplit ?? defaultHomePageContent.promoSplit;
  const services = content.services ?? defaultHomePageContent.services;

  // 4-up category grid — titles come from the editable Shop By Style slots.
  // Optional chaining guards older content documents saved before these fields existed.
  const categoryTiles = [
    { title: content.shopByStyle.womenPants?.title || "WOMEN'S PANTS", img: homePageImages.womenPantsImage, href: '/category/women/pants' },
    { title: content.shopByStyle.womenShirts?.title || "WOMEN'S SHIRTS", img: homePageImages.womenShirtsImage, href: '/category/women/t-shirts' },
    { title: content.shopByStyle.menPants?.title || "MEN'S PANTS", img: homePageImages.menPantsImage, href: '/category/men/pants' },
    { title: content.shopByStyle.menShirts?.title || "MEN'S SHIRTS", img: homePageImages.menShirtsImage, href: '/category/men/t-shirts' },
  ];

  // 2-up promo split — dedicated images fall back to existing slots until uploaded.
  const promoTiles = [
    { ...promoSplit.left, img: homePageImages.promoLeftImage || homePageImages.menImage, href: '/category/new-arrivals' },
    { ...promoSplit.right, img: homePageImages.promoRightImage || homePageImages.saleImage, href: '/category/sale' },
  ];

  // 3-up services row.
  const serviceHrefs = ['/contact', '/contact', '/stores'];
  const serviceImages = [
    homePageImages.serviceImage1 || homePageImages.collectionImage,
    homePageImages.serviceImage2 || homePageImages.accessoryImage,
    homePageImages.serviceImage3 || homePageImages.womenImage,
  ];
  const serviceItems = (services.items && services.items.length ? services.items : defaultHomePageContent.services.items)
    .slice(0, 3);

  return (
    <Layout>
      {/* Hero Section — full-bleed image behind the transparent header. The negative
          margin pulls it up under the header fragment (announcement bar h-9 + nav
          h-20/h-24), so keep these values in sync with Header.tsx. */}
      <section className="relative min-h-screen overflow-hidden -mt-[116px] lg:-mt-[132px]">
        <div className="absolute inset-0">
          {renderHomeMedia(homePageImages.heroImage, 'Fashion', 'absolute inset-0 w-full h-full object-cover', { eager: true, preload: 'metadata', hero: true, sizes: '100vw' })}
          {/* Subtle bottom gradient so the centred title and buttons stay legible */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 via-black/15 to-transparent pointer-events-none" />
        </div>

        {/* Hero Content — anchored to the bottom centre (Gucci-style) */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-end text-center px-4 pt-[116px] lg:pt-[132px] pb-16 lg:pb-24">
          {content.hero.badge && (
            <span className="font-grotesk text-xs sm:text-sm tracking-[0.3em] uppercase text-white mb-4" style={{ textShadow: HERO_TEXT_SHADOW }}>
              {content.hero.badge}
            </span>
          )}

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-none mb-4" style={{ textShadow: HERO_TEXT_SHADOW }}>
            {content.hero.headline1} <span className="text-accent-electric">{content.hero.headline2}</span>
          </h1>

          {content.hero.subheading && (
            <p className="font-grotesk text-sm md:text-base text-white/90 max-w-xl mb-8 leading-relaxed whitespace-pre-line" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
              {content.hero.subheading}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/category/women"
              className="px-10 py-4 bg-white text-brand-900 font-grotesk font-bold text-sm tracking-widest uppercase rounded-full transform hover:scale-105 transition-all duration-300"
            >
              {content.hero.ctaPrimary}
            </Link>
            <Link
              to="/category/men"
              className="px-10 py-4 border-2 border-white text-white font-grotesk font-bold text-sm tracking-widest uppercase rounded-full hover:bg-white hover:text-brand-900 transition-all duration-300 transform hover:scale-105"
            >
              {content.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Category Grid — 4-up tiles with captions underneath (2-up on mobile) */}
      <section className="bg-transparent animate-on-scroll opacity-100 translate-y-0 md:opacity-0 md:translate-y-12 transition-all duration-1000 cv-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {categoryTiles.map((tile) => (
            <Link key={tile.title} to={tile.href} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-brand-900">
                {tile.img &&
                  renderHomeMedia(tile.img, tile.title, 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-105', { sizes: '(min-width: 1024px) 25vw, 50vw' })}
              </div>
              <div className="py-5 text-center">
                <span className="font-grotesk text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-gray-900 group-hover:text-accent-electric transition-colors">
                  {tile.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo Split — two large side-by-side promotional tiles */}
      <section className="grid grid-cols-1 lg:grid-cols-2 animate-on-scroll opacity-100 translate-y-0 md:opacity-0 md:translate-y-12 transition-all duration-1000 cv-auto">
        {promoTiles.map((tile) => (
          <Link
            key={tile.href}
            to={tile.href}
            className="relative group overflow-hidden bg-brand-900 h-[60vh] lg:h-[82vh] block"
          >
            {tile.img &&
              renderHomeMedia(tile.img, tile.title, 'absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105', { sizes: '(min-width: 1024px) 50vw, 100vw' })}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-6 pb-12 lg:pb-16">
              <h3 className="font-display text-4xl md:text-5xl text-white mb-5" style={{ textShadow: TILE_TEXT_SHADOW }}>
                {tile.title}
              </h3>
              {tile.linkText && (
                <span className="inline-block bg-white text-brand-900 px-8 py-3 rounded-full font-grotesk font-bold text-xs tracking-widest uppercase group-hover:bg-accent-electric transition-colors">
                  {tile.linkText}
                </span>
              )}
            </div>
          </Link>
        ))}
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-transparent animate-on-scroll opacity-100 translate-y-0 md:opacity-0 md:translate-y-12 transition-all duration-1000 cv-auto">
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

      {/* Campaign Block — centred editorial statement */}
      <section className="py-24 lg:py-28 bg-transparent animate-on-scroll opacity-100 translate-y-0 md:opacity-0 md:translate-y-12 transition-all duration-1000 cv-auto">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-gray-900 mb-6 leading-tight tracking-wide">
            {content.brandStatement.headlineLine1}{' '}
            <span className="text-accent-electric">{content.brandStatement.headlineLine2}</span>
          </h2>
          <p className="font-grotesk text-base md:text-lg text-gray-700 mb-8 leading-relaxed whitespace-pre-line">
            {content.brandStatement.description}
          </p>
          <Link
            to="/about"
            className="inline-block font-grotesk font-semibold text-sm tracking-widest uppercase text-gray-900 border-b-2 border-gray-900 pb-1 hover:text-accent-electric hover:border-accent-electric transition-all"
          >
            {content.brandStatement.ctaButton}
          </Link>
        </div>
      </section>

      {/* Services — 3-up row */}
      <section className="py-20 bg-transparent animate-on-scroll opacity-100 translate-y-0 md:opacity-0 md:translate-y-12 transition-all duration-1000 cv-auto">
        <div className="max-w-7xl mx-auto px-4">
          {services.sectionTitle && (
            <h2 className="font-display text-3xl md:text-4xl text-gray-900 text-center mb-12 tracking-wide">
              {services.sectionTitle}
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {serviceItems.map((item, index) => (
              <Link key={index} to={serviceHrefs[index] || '/contact'} className="group block text-center">
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-900 mb-5">
                  {serviceImages[index] &&
                    renderHomeMedia(serviceImages[index], item.title, 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-105', { sizes: '(min-width: 768px) 33vw, 100vw' })}
                </div>
                <h3 className="font-grotesk font-bold text-sm tracking-[0.2em] uppercase text-gray-900 mb-2 group-hover:text-accent-electric transition-colors">
                  {item.title}
                </h3>
                {item.linkText && (
                  <p className="font-grotesk text-sm text-gray-600">{item.linkText}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter - Bold CTA */}
      <section className="py-20 bg-transparent animate-on-scroll opacity-100 translate-y-0 md:opacity-0 md:translate-y-12 transition-all duration-1000 cv-auto">
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
