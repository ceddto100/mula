import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/product/ProductGrid';
import { useFeaturedProducts } from '../hooks/useProducts';

const Home: React.FC = () => {
  const { products: featuredProducts, isLoading } = useFeaturedProducts(8);

  return (
    <Layout>
      {/* Hero Section - Holiday Dressing */}
      <section className="relative bg-[#8B9A87] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <p className="text-sm tracking-widest mb-2 font-light">POLO RALPH LAUREN</p>
          <h1 className="text-4xl lg:text-5xl font-serif italic mb-4">
            Holiday Dressing
          </h1>
          <p className="text-lg font-light mb-8 max-w-md">
            Classic styles with seasonal spirit for every festive occasion
          </p>
        </div>
      </section>

      {/* Category Cards - Men, Women, Boys, Girls */}
      <section className="bg-[#8B9A87]">
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Men', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=600&h=800' },
              { name: 'Women', image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=600&h=800' },
              { name: 'Boys', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=600&h=800' },
              { name: 'Girls', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=600&h=800' },
            ].map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase()}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-sm"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-0 right-0 text-center">
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
      <section className="grid grid-cols-1 lg:grid-cols-2">
        {/* Gifts by Price */}
        <div className="relative min-h-[500px] lg:min-h-[600px]">
          <img
            src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1000"
            alt="Gifts by Price"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-12 text-white">
            <p className="text-sm tracking-widest mb-2 font-light">RALPH LAUREN</p>
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
                  className="text-sm tracking-wider border-b border-white pb-1 hover:opacity-70 transition-opacity"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sweater Shop */}
        <div className="relative min-h-[500px] lg:min-h-[600px]">
          <img
            src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1000"
            alt="Sweater Shop"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-12 text-white">
            <p className="text-sm tracking-widest mb-2 font-light">POLO RALPH LAUREN</p>
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
                  className="text-sm tracking-wider border-b border-white pb-1 hover:opacity-70 transition-opacity"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Split Section: Gift Guide + E-Gift Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2">
        {/* The Gift Guide */}
        <div className="relative min-h-[500px] lg:min-h-[600px] bg-[#1a1f36]">
          <img
            src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=1000"
            alt="Gift Guide"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f36]/90 via-[#1a1f36]/50 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-12 text-white">
            <p className="text-sm tracking-widest mb-2 font-light">RALPH LAUREN</p>
            <h2 className="text-3xl lg:text-4xl font-serif italic mb-3">
              The Gift Guide
            </h2>
            <p className="text-base font-light mb-6 max-w-sm">
              A curated selection of timeless gifts<br />
              from the World of Ralph Lauren
            </p>
            <Link
              to="/category/gifts"
              className="text-sm tracking-wider border-b border-white pb-1 hover:opacity-70 transition-opacity inline-block w-fit"
            >
              EXPLORE NOW
            </Link>
          </div>
        </div>

        {/* E-Gift Cards */}
        <div className="relative min-h-[500px] lg:min-h-[600px]">
          <img
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000"
            alt="E-Gift Cards"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-12 text-white">
            <p className="text-sm tracking-widest mb-2 font-light">RALPH LAUREN</p>
            <h2 className="text-3xl lg:text-4xl font-serif italic mb-3">
              E-Gift Cards
            </h2>
            <p className="text-base font-light mb-6 max-w-sm">
              It's the gift that always fits
            </p>
            <Link
              to="/gift-cards"
              className="text-sm tracking-wider border-b border-white pb-1 hover:opacity-70 transition-opacity inline-block w-fit"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm tracking-widest text-gray-500 mb-1">NEW ARRIVALS</p>
              <h2 className="text-2xl font-serif italic">Just In</h2>
            </div>
            <Link
              to="/category/new-arrivals"
              className="text-sm font-medium tracking-wider border-b border-gray-900 pb-1 hover:opacity-70 transition-opacity flex items-center gap-2"
            >
              VIEW ALL <FiArrowRight size={14} />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} isLoading={isLoading} />
        </div>
      </section>

      {/* Full Width Banner - Free Shipping */}
      <section className="relative min-h-[400px] bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920"
          alt="Free Shipping"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 h-full min-h-[400px] flex items-center justify-center text-center text-white px-4">
          <div>
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
              className="inline-block bg-white text-gray-900 px-8 py-3 text-sm tracking-wider font-medium hover:bg-gray-100 transition-colors"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-[#f8f7f5]">
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
              className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gray-900 text-white text-sm tracking-wider font-medium hover:bg-gray-800 transition-colors"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
