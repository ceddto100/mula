import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/product/ProductGrid';
import { useFeaturedProducts } from '../hooks/useProducts';

const Home: React.FC = () => {
  const { products: featuredProducts, isLoading } = useFeaturedProducts(8);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
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

  return (
    <Layout>
      {/* Bold Diagonal Hero Section */}
      <section className="relative min-h-[90vh] bg-brand-900 overflow-hidden">
        {/* Diagonal Background Split */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950" />
          <div className="absolute top-0 right-0 w-3/5 h-full bg-brand-500 diagonal-bg" />
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070"
            alt="Fashion"
            className="absolute top-0 right-0 w-3/5 h-full object-cover diagonal-bg opacity-90 mix-blend-multiply"
          />
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
                NEW COLLECTION 2025
              </div>
            </div>

            <div className="overflow-hidden mb-4">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-display text-white leading-none animate-slide-up-delayed">
                URBAN
              </h1>
            </div>

            <div className="overflow-hidden mb-8">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-display text-accent-electric leading-none animate-slide-up-more-delayed">
                EVOLUTION
              </h2>
            </div>

            <div className="overflow-hidden mb-12">
              <p className="text-xl md:text-2xl text-brand-100 font-grotesk max-w-lg leading-relaxed animate-fade-in-delayed">
                Street-inspired designs meet contemporary fashion.
                Bold statements for the modern individual.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-more-delayed">
              <Link
                to="/category/new-arrivals"
                className="group relative px-10 py-5 bg-white text-brand-900 font-grotesk font-bold text-lg tracking-wide overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  SHOP NOW
                  <FiArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
                </span>
              </Link>

              <Link
                to="/category/collections"
                className="group px-10 py-5 border-2 border-white text-white font-grotesk font-bold text-lg tracking-wide hover:bg-white hover:text-brand-900 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  EXPLORE
                  <FiArrowUpRight className="group-hover:rotate-45 transition-transform" size={24} />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-grotesk tracking-widest">SCROLL</span>
            <div className="w-0.5 h-12 bg-white/50" />
          </div>
        </div>
      </section>

      {/* Bold Category Grid - Asymmetric Layout */}
      <section className="relative py-24 bg-white animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-6xl md:text-7xl font-display text-brand-900 mb-4">SHOP BY STYLE</h2>
            <div className="w-24 h-1 bg-accent-electric mx-auto" />
          </div>

          {/* Asymmetric Grid */}
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            {/* Large Featured - Men */}
            <Link
              to="/category/men"
              className="col-span-12 lg:col-span-8 relative group overflow-hidden bg-brand-900 aspect-[16/9] lg:aspect-[16/10]"
            >
              <img
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=1200"
                alt="Men's Collection"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 lg:p-12">
                <div className="inline-block bg-accent-electric text-brand-900 px-4 py-1 text-sm font-grotesk font-bold mb-4">
                  TRENDING
                </div>
                <h3 className="text-5xl lg:text-7xl font-display text-white mb-2">MEN'S</h3>
                <p className="text-xl text-brand-100 font-grotesk mb-4">Bold. Confident. Urban.</p>
                <span className="inline-flex items-center gap-2 text-accent-electric font-grotesk font-semibold text-lg group-hover:gap-4 transition-all">
                  DISCOVER <FiArrowRight size={24} />
                </span>
              </div>
            </Link>

            {/* Women - Vertical */}
            <Link
              to="/category/women"
              className="col-span-12 lg:col-span-4 relative group overflow-hidden bg-accent-purple aspect-[16/9] lg:aspect-[9/16]"
            >
              <img
                src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=600"
                alt="Women's Collection"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-5xl lg:text-6xl font-display text-white mb-2">WOMEN'S</h3>
                <p className="text-lg text-brand-100 font-grotesk mb-4">Fierce & Elegant</p>
                <span className="inline-flex items-center gap-2 text-accent-neon font-grotesk font-semibold group-hover:gap-4 transition-all">
                  SHOP <FiArrowRight size={20} />
                </span>
              </div>
            </Link>

            {/* Accessories */}
            <Link
              to="/category/accessories"
              className="col-span-6 lg:col-span-4 relative group overflow-hidden bg-accent-sunset aspect-square"
            >
              <img
                src="https://images.unsplash.com/photo-1523359346063-d879354c0ea5?auto=format&fit=crop&q=80&w=600"
                alt="Accessories"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-brand-900/60 group-hover:bg-brand-900/40 transition-all" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-3xl lg:text-4xl font-display text-white mb-2">ACCESSORIES</h3>
                <span className="inline-flex items-center gap-2 text-accent-electric font-grotesk font-semibold group-hover:gap-4 transition-all">
                  VIEW <FiArrowRight />
                </span>
              </div>
            </Link>

            {/* Sale - Electric Accent */}
            <Link
              to="/category/sale"
              className="col-span-6 lg:col-span-4 relative group overflow-hidden bg-accent-electric aspect-square"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-electric to-brand-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-brand-900 font-display text-6xl lg:text-7xl mb-2 group-hover:scale-110 transition-transform">
                  SALE
                </div>
                <p className="text-brand-900 font-grotesk font-bold text-xl mb-4">UP TO 50% OFF</p>
                <span className="inline-flex items-center gap-2 text-brand-900 font-grotesk font-bold text-lg group-hover:gap-4 transition-all">
                  SHOP DEALS <FiArrowRight size={24} />
                </span>
              </div>
            </Link>

            {/* Collections */}
            <Link
              to="/category/collections"
              className="col-span-12 lg:col-span-4 relative group overflow-hidden bg-brand-700 aspect-[16/9] lg:aspect-square"
            >
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea1f8cf5?auto=format&fit=crop&q=80&w=600"
                alt="Collections"
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-4xl lg:text-5xl font-display text-white mb-4">COLLECTIONS</h3>
                <p className="text-brand-100 font-grotesk text-lg mb-4">Curated Style Sets</p>
                <span className="inline-flex items-center gap-2 text-accent-electric font-grotesk font-bold group-hover:gap-4 transition-all">
                  EXPLORE <FiArrowRight size={20} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products with Bold Header */}
      <section className="py-24 bg-brand-50 animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-block bg-accent-electric text-brand-900 px-4 py-1 text-sm font-grotesk font-bold mb-4">
                NEW ARRIVALS
              </div>
              <h2 className="text-6xl md:text-7xl font-display text-brand-900">FRESH DROPS</h2>
            </div>
            <Link
              to="/category/new-arrivals"
              className="group inline-flex items-center gap-3 text-brand-900 font-grotesk font-bold text-lg border-b-2 border-brand-900 pb-2 hover:border-accent-electric hover:text-accent-electric transition-all"
            >
              VIEW ALL
              <FiArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
            </Link>
          </div>

          <ProductGrid products={featuredProducts} isLoading={isLoading} />
        </div>
      </section>

      {/* Bold Brand Statement Section */}
      <section className="relative py-32 bg-brand-900 overflow-hidden animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-700 to-brand-900 animate-gradient" />

        {/* Large Background Text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 overflow-hidden">
          <span className="font-display text-[20vw] text-white whitespace-nowrap">CUALQUIER</span>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-6xl md:text-8xl font-display text-white mb-8 leading-tight">
            DEFINE YOUR
            <br />
            <span className="text-accent-electric">STYLE</span>
          </h2>
          <p className="text-xl md:text-2xl text-brand-100 font-grotesk max-w-3xl mx-auto mb-12 leading-relaxed">
            Cualquier isn't just fashion—it's a statement. We create pieces that blend
            urban edge with contemporary design, giving you the confidence to stand out.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-3 bg-accent-electric text-brand-900 px-10 py-5 font-grotesk font-bold text-lg tracking-wide hover:bg-white transition-all duration-300 transform hover:scale-105"
          >
            OUR STORY
            <FiArrowUpRight size={24} />
          </Link>
        </div>
      </section>

      {/* Newsletter - Bold CTA */}
      <section className="py-20 bg-white animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-12 lg:p-16 relative overflow-hidden">
            {/* Arrow Pattern */}
            <div className="absolute top-0 right-0 text-white opacity-10 text-9xl">→</div>
            <div className="absolute bottom-0 left-0 text-white opacity-10 text-9xl rotate-180">→</div>

            <div className="relative z-10 text-center text-white">
              <h2 className="text-5xl md:text-6xl font-display mb-6">STAY CONNECTED</h2>
              <p className="text-xl font-grotesk mb-8 opacity-90">
                Get exclusive access to new drops, special offers, and style inspiration.
              </p>

              <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-white text-brand-900 font-grotesk text-lg focus:outline-none focus:ring-4 focus:ring-accent-electric transition-all"
                />
                <button
                  type="submit"
                  className="px-10 py-4 bg-accent-electric text-brand-900 font-grotesk font-bold text-lg tracking-wide hover:bg-white transition-all duration-300 transform hover:scale-105"
                >
                  SUBSCRIBE →
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
      `}</style>
    </Layout>
  );
};

export default Home;
