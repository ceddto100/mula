import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-brand-800">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070"
          alt="Elevate Your Style"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Warm overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/70 via-brand-900/30 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-20 max-w-3xl">
          <p className="text-brand-200 font-grotesk text-xs tracking-[0.3em] uppercase mb-4 animate-hero-in">
            Luxury Streetwear Redefined
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] mb-8 animate-hero-in-delayed">
            Elevate<br />Your Style
          </h1>
          <Link
            to="/category/new-arrivals"
            className="inline-block bg-white text-brand-900 font-grotesk font-semibold text-sm tracking-widest uppercase px-8 py-3 w-fit hover:bg-brand-100 transition-colors duration-300 animate-hero-in-more-delayed"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Two Column Section: New Collection + Bestsellers */}
      <section className="grid grid-cols-1 md:grid-cols-2 scroll-reveal opacity-0 translate-y-8 transition-all duration-700">
        {/* New Collection */}
        <Link to="/category/new-arrivals" className="relative group overflow-hidden aspect-[4/5] bg-brand-900">
          <img
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800"
            alt="New Collection"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-brand-900/50 group-hover:bg-brand-900/40 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <h2 className="font-display text-4xl lg:text-5xl text-white mb-3 leading-tight">
              New Collection
            </h2>
            <span className="inline-block border border-white text-white font-grotesk text-xs tracking-widest uppercase px-5 py-2 w-fit hover:bg-white hover:text-brand-900 transition-colors duration-300">
              Explore Now
            </span>
          </div>
        </Link>

        {/* Bestsellers */}
        <Link to="/category/collections" className="relative group overflow-hidden aspect-[4/5] bg-brand-200">
          <img
            src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=800"
            alt="Bestsellers"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-brand-900/30 group-hover:bg-brand-900/20 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <h2 className="font-display text-4xl lg:text-5xl text-white mb-3 leading-tight">
              Bestsellers
            </h2>
            <span className="inline-block border border-white text-white font-grotesk text-xs tracking-widest uppercase px-5 py-2 w-fit hover:bg-white hover:text-brand-900 transition-colors duration-300">
              Shop Favorites
            </span>
          </div>
        </Link>
      </section>

      {/* Marquee Ticker */}
      <div className="bg-brand-900 py-4 overflow-hidden">
        <div className="marquee-track flex whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="font-grotesk text-xs tracking-[0.3em] text-brand-200 uppercase mx-8 flex-shrink-0">
              CUALQUIER &nbsp;•&nbsp; STYLE WITH PURPOSE &nbsp;•&nbsp; LUXURY STREETWEAR &nbsp;•&nbsp; NEW ARRIVALS &nbsp;•
            </span>
          ))}
        </div>
      </div>

      {/* Discover the Latest Trends */}
      <section className="py-16 lg:py-24 bg-white scroll-reveal opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl lg:text-5xl text-brand-900 mb-2">
              Discover the Latest Trends
            </h2>
            <p className="font-grotesk text-xs tracking-[0.25em] text-brand-500 uppercase">
              Fresh Drops &amp; Exclusive Designs
            </p>
          </div>

          {/* 3 Category Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Link to="/category/men" className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-brand-200 mb-3">
                <img
                  src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=600"
                  alt="Men"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="font-grotesk text-xs tracking-widest text-brand-700 uppercase text-center">Men</p>
            </Link>

            <Link to="/category/women" className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-brand-200 mb-3">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600"
                  alt="Women"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="font-grotesk text-xs tracking-widest text-brand-700 uppercase text-center">Women</p>
            </Link>

            <Link to="/category/accessories" className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-brand-200 mb-3">
                <img
                  src="https://images.unsplash.com/photo-1523359346063-d879354c0ea5?auto=format&fit=crop&q=80&w=600"
                  alt="Accessories"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="font-grotesk text-xs tracking-widest text-brand-700 uppercase text-center">Accessories</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-brand-50 scroll-reveal opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-grotesk text-xs tracking-[0.25em] text-brand-500 uppercase mb-2">New Arrivals</p>
              <h2 className="font-display text-4xl lg:text-5xl text-brand-900">Fresh Drops</h2>
            </div>
            <Link
              to="/category/new-arrivals"
              className="font-grotesk text-xs tracking-widest uppercase text-brand-900 border-b border-brand-900 pb-0.5 hover:text-brand-600 hover:border-brand-600 transition-colors"
            >
              View All
            </Link>
          </div>

          <ProductGrid products={featuredProducts} isLoading={isLoading} />
        </div>
      </section>

      {/* Join the Club Banner */}
      <section className="bg-brand-900 py-16 px-6 text-center scroll-reveal opacity-0 translate-y-8 transition-all duration-700">
        <p className="font-grotesk text-brand-400 text-xs tracking-[0.3em] uppercase mb-3">Exclusive Members Only</p>
        <h2 className="font-script text-5xl lg:text-6xl text-white mb-3">
          Join the Cualquier Club
        </h2>
        <p className="font-grotesk text-brand-300 text-sm tracking-widest uppercase mb-8">
          Get 15% Off Your First Order
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-5 py-3 bg-transparent border border-brand-600 text-white font-grotesk text-sm placeholder:text-brand-500 focus:outline-none focus:border-brand-300 transition-colors"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-white text-brand-900 font-grotesk font-semibold text-sm tracking-widest uppercase hover:bg-brand-100 transition-colors"
          >
            Join Now
          </button>
        </form>
      </section>

      <style>{`
        @keyframes hero-in {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-hero-in {
          animation: hero-in 0.8s ease-out 0.2s both;
        }

        .animate-hero-in-delayed {
          animation: hero-in 0.9s ease-out 0.45s both;
        }

        .animate-hero-in-more-delayed {
          animation: hero-in 0.9s ease-out 0.7s both;
        }

        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee-track {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </Layout>
  );
};

export default Home;
