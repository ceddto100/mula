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
  heroImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070',
  menImage: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=1200',
  womenImage: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=600',
  collectionImage: 'https://images.unsplash.com/photo-1558769132-cb1aea1f8cf5?auto=format&fit=crop&q=80&w=600',
  accessoryImage: 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?auto=format&fit=crop&q=80&w=600',
  saleImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600',
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
    heroOverlayColor: '',
    headingFont: 'Inter',
  },
};

const Home: React.FC = () => {
  const { products: featuredProducts, isLoading } = useFeaturedProducts(8);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [homePageImages, setHomePageImages] = useState<HomePageImages>(defaultHomePageImages);
  const [content, setContent] = useState<HomePageContent>(defaultHomePageContent);
  useSeo('Cualquier — Contemporary Urban Fashion', 'Street-inspired fashion drops and curated collections.');

  useEffect(() => {
    const fetchHomePageImages = async () => {
      try {
        const data = await productsApi.getHomePageImages();
        setHomePageImages(data);
      } catch (error) {
        console.error('Failed to fetch home page images:', error);
      }
    };

    const fetchHomePageContent = async () => {
      try {
        const data = await productsApi.getHomePageContent();
        setContent(data);
      } catch (error) {
        console.error('Failed to fetch home page content:', error);
      }
    };

    fetchHomePageImages();
    fetchHomePageContent();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    applyAccentColor(content.brandTheme?.accentColor);
  }, [content.brandTheme?.accentColor]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute top-0 left-0 h-full w-[55%] bg-black/60"
          />
          <img
            src={homePageImages.heroImage}
            alt="Fashion"
            className="absolute top-0 right-0 w-3/5 h-full object-cover diagonal-bg"
          />
          {content.brandTheme?.heroOverlayColor ? (
            <div
              className="absolute top-0 right-0 w-3/5 h-full diagonal-bg pointer-events-none"
              style={{ backgroundColor: content.brandTheme.heroOverlayColor, opacity: 0.45 }}
            />
          ) : null}
        </div>

        {/* Floating Arrow Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-accent-electric opacity-20 text-9xl animate-pulse">→</div>
          <div className="absolute bottom-40 right-20 text-accent-neon opacity-20 text-9xl rotate-45 animate-pulse delay-300">→</div>
          <div className="absolute top-1/2 left-1/3 text-white opacity-10 text-9xl -rotate-12 animate-pulse delay-700">→</div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-[90vh] flex items-center">
          <div className="lg:w-1/2">
            <div className="mb-6 overflow-hidden">
              <div className="inline-block bg-accent-electric text-brand-900 px-6 py-2 font-grotesk font-bold text-sm tracking-wider animate-slide-up">
                {content.hero.badge}
              </div>
            </div>

            <div className="overflow-hidden mb-4">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-display text-white leading-none animate-slide-up-delayed">
                {content.hero.headline1}
              </h1>
            </div>

            <div className="overflow-hidden mb-8">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-display text-accent-electric leading-none animate-slide-up-more-delayed">
                {content.hero.headline2}
              </h2>
            </div>

            <div className="overflow-hidden mb-12">
              <p className="text-xl md:text-2xl text-brand-100 font-grotesk max-w-lg leading-relaxed animate-fade-in-delayed whitespace-pre-line">
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

      {/* Bold Category Grid - Asymmetric Layout */}
      <section className="relative py-24 bg-transparent animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-6xl md:text-7xl font-display text-white mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">{content.shopByStyle.sectionTitle}</h2>
            <div className="w-24 h-1 bg-accent-electric mx-auto" />
          </div>

          {/* Asymmetric Grid */}
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            {/* Large Featured - Men */}
            <Link
              to="/category/men"
              className="col-span-12 lg:col-span-8 relative group overflow-hidden rounded-3xl bg-brand-900 aspect-[16/9] lg:aspect-[16/10]"
            >
              <img
                src={homePageImages.menImage}
                alt="Men's Collection"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 lg:p-12">
                {content.shopByStyle.men.badge && (
                  <div className="inline-block bg-accent-electric text-brand-900 px-4 py-1 text-sm font-grotesk font-bold mb-4">
                    {content.shopByStyle.men.badge}
                  </div>
                )}
                <h3 className="text-5xl lg:text-7xl font-display text-white mb-2">{content.shopByStyle.men.title}</h3>
                {content.shopByStyle.men.description && (
                  <p className="text-xl text-brand-100 font-grotesk mb-4">{content.shopByStyle.men.description}</p>
                )}
                <span className="inline-flex items-center gap-2 text-accent-electric font-grotesk font-semibold text-lg group-hover:gap-4 transition-all">
                  {content.shopByStyle.men.linkText} <FiArrowRight size={24} />
                </span>
              </div>
            </Link>

            {/* Women - Vertical */}
            <Link
              to="/category/women"
              className="col-span-12 lg:col-span-4 relative group overflow-hidden rounded-3xl bg-accent-purple aspect-[16/9] lg:aspect-[9/16]"
            >
              <img
                src={homePageImages.womenImage}
                alt="Women's Collection"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-5xl lg:text-6xl font-display text-white mb-2">{content.shopByStyle.women.title}</h3>
                {content.shopByStyle.women.description && (
                  <p className="text-lg text-brand-100 font-grotesk mb-4">{content.shopByStyle.women.description}</p>
                )}
                <span className="inline-flex items-center gap-2 text-accent-neon font-grotesk font-semibold group-hover:gap-4 transition-all">
                  {content.shopByStyle.women.linkText} <FiArrowRight size={20} />
                </span>
              </div>
            </Link>

            {/* Accessories */}
            <Link
              to="/category/accessories"
              className="col-span-6 lg:col-span-4 relative group overflow-hidden rounded-3xl bg-accent-sunset aspect-square"
            >
              <img
                src={homePageImages.accessoryImage}
                alt="Accessories"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-brand-900/60 group-hover:bg-brand-900/40 transition-all" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-3xl lg:text-4xl font-display text-white mb-2">{content.shopByStyle.accessories.title}</h3>
                <span className="inline-flex items-center gap-2 text-accent-electric font-grotesk font-semibold group-hover:gap-4 transition-all">
                  {content.shopByStyle.accessories.linkText} <FiArrowRight />
                </span>
              </div>
            </Link>

            {/* Sale - Electric Accent */}
            <Link
              to="/category/sale"
              className="col-span-6 lg:col-span-4 relative group overflow-hidden rounded-3xl bg-accent-electric aspect-square"
            >
              <img
                src={homePageImages.saleImage}
                alt="Sale Collection"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-accent-electric/80 to-brand-500/85" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-brand-900 font-display text-6xl lg:text-7xl mb-2 group-hover:scale-110 transition-transform">
                  {content.shopByStyle.sale.title}
                </div>
                {content.shopByStyle.sale.description && (
                  <p className="text-brand-900 font-grotesk font-bold text-xl mb-4">{content.shopByStyle.sale.description}</p>
                )}
                <span className="inline-flex items-center gap-2 text-brand-900 font-grotesk font-bold text-lg group-hover:gap-4 transition-all">
                  {content.shopByStyle.sale.linkText} <FiArrowRight size={24} />
                </span>
              </div>
            </Link>

            {/* Collections */}
            <Link
              to="/category/collections"
              className="col-span-12 lg:col-span-4 relative group overflow-hidden rounded-3xl bg-brand-700 aspect-[16/9] lg:aspect-square"
            >
              <img
                src={homePageImages.collectionImage}
                alt="Collections"
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-4xl lg:text-5xl font-display text-white mb-4">{content.shopByStyle.collections.title}</h3>
                {content.shopByStyle.collections.description && (
                  <p className="text-brand-100 font-grotesk text-lg mb-4">{content.shopByStyle.collections.description}</p>
                )}
                <span className="inline-flex items-center gap-2 text-accent-electric font-grotesk font-bold group-hover:gap-4 transition-all">
                  {content.shopByStyle.collections.linkText} <FiArrowRight size={20} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products with Bold Header */}
      <section className="py-24 bg-transparent animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-block bg-accent-electric text-brand-900 px-4 py-1 text-sm font-grotesk font-bold mb-4">
                {content.freshDrops.badge}
              </div>
              <h2 className="text-6xl md:text-7xl font-display text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">{content.freshDrops.sectionTitle}</h2>
            </div>
            <Link
              to="/category/new-arrivals"
              className="group inline-flex items-center gap-3 text-white font-grotesk font-bold text-lg border-b-2 border-white pb-2 hover:border-accent-electric hover:text-accent-electric transition-all"
            >
              {content.freshDrops.viewAllLink}
              <FiArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
            </Link>
          </div>

          <ProductGrid products={featuredProducts} isLoading={isLoading} />
        </div>
      </section>

      {/* Bold Brand Statement Section */}
      <section className="relative py-32 bg-transparent overflow-hidden animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/40 via-brand-700/30 to-brand-900/40 animate-gradient" />

        {/* Large Background Text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 overflow-hidden">
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
      <section className="py-20 bg-transparent animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000">
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
