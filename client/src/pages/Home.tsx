import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/product/ProductGrid';
import { useFeaturedProducts, useCategories } from '../hooks/useProducts';

const Home: React.FC = () => {
  const { products: featuredProducts, isLoading } = useFeaturedProducts(8);
  const { categories } = useCategories();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920)',
          }}
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 py-32 lg:py-48">
          <div className="max-w-xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              New Season Arrivals
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Discover the latest trends in fashion. Premium quality clothing for every style.
            </p>
            <Link
              to="/category/new-arrivals"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Men', 'Women', 'Accessories', 'Footwear'].map((category) => (
              <Link
                key={category}
                to={`/category/${category.toLowerCase()}`}
                className="relative aspect-[4/5] bg-gray-200 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors z-10" />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <span className="text-white text-xl font-semibold">{category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link
              to="/category/all"
              className="text-sm font-medium hover:underline flex items-center gap-1"
            >
              View All <FiArrowRight />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} isLoading={isLoading} />
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Free Shipping Over $100</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Enjoy free standard shipping on all orders over $100. Plus, easy returns within 30 days.
          </p>
          <Link
            to="/category/sale"
            className="inline-block bg-white text-gray-900 px-8 py-3 font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Sale
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to get special offers, free giveaways, and new arrivals updates.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
