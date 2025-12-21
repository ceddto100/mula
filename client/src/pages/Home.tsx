import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
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
      {/* New Hero Section - Modern & Bold */}
      <section className="relative h-screen overflow-hidden bg-black">
        {/* Background Video Effect */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 animate-gradient" />
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=2070"
            alt="Hero"
            className="w-full h-full object-cover opacity-50 animate-ken-burns"
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-5xl">
            <div className="overflow-hidden mb-6">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight animate-slide-up">
                ELEVATE
              </h1>
            </div>
            <div className="overflow-hidden mb-6">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-light text-white/90 italic animate-slide-up-delayed">
                Your Style
              </h2>
            </div>
            <div className="overflow-hidden mb-12">
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light animate-fade-in-delayed">
                Discover timeless pieces that define modern elegance. Where luxury meets lifestyle.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-more-delayed">
              <Link
                to="/category/new-arrivals"
                className="group relative px-12 py-4 bg-white text-black font-semibold tracking-wider overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">SHOP NOW</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                <span className="absolute inset-0 z-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  SHOP NOW
                </span>
              </Link>
              <Link
                to="/category/sale"
                className="px-12 py-4 border-2 border-white text-white font-semibold tracking-wider hover:bg-white hover:text-black transition-all duration-300 hover:scale-105"
              >
                EXPLORE SALE
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-scroll-indicator" />
          </div>
        </div>
      </section>

      {/* Holiday Dressing Section - Moved from original hero */}
      <section className="relative bg-[#8B9A87] text-white animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <p className="text-sm tracking-widest mb-2 font-light">PREMIUM COLLECTION</p>
          <h1 className="text-4xl lg:text-5xl font-serif italic mb-4">
            Holiday Dressing
          </h1>
          <p className="text-lg font-light mb-8 max-w-md">
            Classic styles with seasonal spirit for every festive occasion
          </p>
        </div>
      </section>

      {/* Category Cards - Men, Women, Boys, Girls */}
      <section className="bg-[#8B9A87] animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000">
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Men', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=600&h=800' },
              { name: 'Women', image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=600&h=800' },
              { name: 'Boys', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=600&h=800' },
              { name: 'Girls', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=600&h=800' },
            ].map((category, index) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase()}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 group-hover:rotate-2"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/80 transition-all duration-300" />
                <div className="absolute bottom-6 left-0 right-0 text-center transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-lg font-medium tracking-wide">
                    {category.name.toUpperCase()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Split Section: Gifts by Price + Sweater Shop */}
      <section className="grid grid-cols-1 lg:grid-cols-2 animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000">
        {/* Gifts by Price */}
        <div className="relative min-h-[500px] lg:min-h-[600px] group overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1000"
            alt="Gifts by Price"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/70 transition-all duration-500" />
          <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-12 text-white transform group-hover:translate-y-[-8px] transition-transform duration-500">
            <p className="text-sm tracking-widest mb-2 font-light">CURATED GIFTS</p>
            <h2 className="text-3xl lg:text-4xl font-serif italic mb-3">
              Gifts by Price
            </h2>
            <p className="text-base font-light mb-6 max-w-sm">
              Find a thoughtful present with any budget
            </p>
            <div className="flex flex-wrap gap-4">
              {['MEN', 'WOMEN', 'BOYS', 'GIRLS'].map((cat) => (
                <Link
                  key={cat}
                  to={`/category/${cat.toLowerCase()}`}
                  className="text-sm tracking-wider border-b border-white pb-1 hover:opacity-70 hover:scale-105 transition-all duration-300"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sweater Shop */}
        <div className="relative min-h-[500px] lg:min-h-[600px] group overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1000"
            alt="Sweater Shop"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/70 transition-all duration-500" />
          <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-12 text-white transform group-hover:translate-y-[-8px] transition-transform duration-500">
            <p className="text-sm tracking-widest mb-2 font-light">COZY COLLECTION</p>
            <h2 className="text-3xl lg:text-4xl font-serif italic mb-3">
              Sweater Shop
            </h2>
            <p className="text-base font-light mb-6 max-w-sm">
              Soft fabrics and iconic silhouettes for everyone on your list
            </p>
            <div className="flex flex-wrap gap-4">
              {['MEN', 'WOMEN', 'KIDS'].map((cat) => (
                <Link
                  key={cat}
                  to={`/category/${cat.toLowerCase()}`}
                  className="text-sm tracking-wider border-b border-white pb-1 hover:opacity-70 hover:scale-105 transition-all duration-300"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Split Section: Gift Guide + E-Gift Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000">
        {/* The Gift Guide */}
        <div className="relative min-h-[500px] lg:min-h-[600px] bg-[#1a1f36] group overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=1000"
            alt="Gift Guide"
            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f36]/90 via-[#1a1f36]/50 to-transparent group-hover:from-[#1a1f36]/95 transition-all duration-500" />
          <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-12 text-white transform group-hover:translate-y-[-8px] transition-transform duration-500">
            <p className="text-sm tracking-widest mb-2 font-light">HANDPICKED SELECTION</p>
            <h2 className="text-3xl lg:text-4xl font-serif italic mb-3">
              The Gift Guide
            </h2>
            <p className="text-base font-light mb-6 max-w-sm">
              A curated selection of timeless gifts<br />
              for every special moment
            </p>
            <Link
              to="/category/gifts"
              className="text-sm tracking-wider border-b border-white pb-1 hover:opacity-70 hover:scale-105 transition-all duration-300 inline-block w-fit"
            >
              EXPLORE NOW
            </Link>
          </div>
        </div>

        {/* E-Gift Cards */}
        <div className="relative min-h-[500px] lg:min-h-[600px] group overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000"
            alt="E-Gift Cards"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/80 transition-all duration-500" />
          <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-12 text-white transform group-hover:translate-y-[-8px] transition-transform duration-500">
            <p className="text-sm tracking-widest mb-2 font-light">INSTANT DELIVERY</p>
            <h2 className="text-3xl lg:text-4xl font-serif italic mb-3">
              E-Gift Cards
            </h2>
            <p className="text-base font-light mb-6 max-w-sm">
              It's the gift that always fits
            </p>
            <Link
              to="/gift-cards"
              className="text-sm tracking-wider border-b border-white pb-1 hover:opacity-70 hover:scale-105 transition-all duration-300 inline-block w-fit"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm tracking-widest text-gray-500 mb-1">NEW ARRIVALS</p>
              <h2 className="text-2xl font-serif italic">Just In</h2>
            </div>
            <Link
              to="/category/new-arrivals"
              className="text-sm font-medium tracking-wider border-b border-gray-900 pb-1 hover:opacity-70 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              VIEW ALL <FiArrowRight size={14} />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} isLoading={isLoading} />
        </div>
      </section>

      {/* Full Width Banner - Free Shipping */}
      <section className="relative min-h-[400px] bg-gray-900 animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000 overflow-hidden group">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920"
          alt="Free Shipping"
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
        />
        <div className="relative z-10 h-full min-h-[400px] flex items-center justify-center text-center text-white px-4">
          <div className="transform group-hover:scale-105 transition-transform duration-500">
            <p className="text-sm tracking-widest mb-4 font-light">COMPLIMENTARY SHIPPING</p>
            <h2 className="text-3xl lg:text-4xl font-serif italic mb-4">
              Free Shipping Over $100
            </h2>
            <p className="text-base font-light mb-8 max-w-md mx-auto">
              Enjoy free standard shipping on all orders over $100.<br />
              Plus, easy returns within 30 days.
            </p>
            <Link
              to="/category/sale"
              className="inline-block bg-white text-gray-900 px-8 py-3 text-sm tracking-wider font-medium hover:bg-gray-100 hover:scale-105 transition-all duration-300"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-[#f8f7f5] animate-on-scroll opacity-0 translate-y-12 transition-all duration-1000">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-sm tracking-widest text-gray-500 mb-2">STAY CONNECTED</p>
          <h2 className="text-2xl font-serif italic mb-4">Join Our Newsletter</h2>
          <p className="text-gray-600 mb-6 font-light">
            Subscribe to get special offers, free giveaways, and new arrivals updates.
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 focus:scale-105 transition-all duration-300"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gray-900 text-white text-sm tracking-wider font-medium hover:bg-gray-800 hover:scale-105 transition-all duration-300"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>

      <style>{`
        @keyframes gradient {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(20px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(20px) translateX(-20px); }
        }

        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scroll-indicator {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }

        .animate-gradient {
          animation: gradient 8s ease-in-out infinite;
        }

        .animate-ken-burns {
          animation: ken-burns 20s ease-out infinite alternate;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .animate-slide-up-delayed {
          animation: slide-up 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-fade-in-delayed {
          animation: fade-in 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-fade-in-more-delayed {
          animation: fade-in 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }

        .animate-scroll-indicator {
          animation: scroll-indicator 2s ease-in-out infinite;
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
