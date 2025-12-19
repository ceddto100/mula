import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage: React.FC = () => {
  const { cart, isLoading, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const canceled = searchParams.get('canceled');

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <FiShoppingBag className="mx-auto text-gray-300" size={64} />
          <h1 className="text-2xl font-bold mt-6 mb-4">Your Cart</h1>
          <p className="text-gray-500 mb-8">Please login to view your cart</p>
          <Link
            to="/login?redirect=/cart"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
          >
            Login
          </Link>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 py-4 border-b">
                <div className="w-24 h-32 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <FiShoppingBag className="mx-auto text-gray-300" size={64} />
          <h1 className="text-2xl font-bold mt-6 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8">Add some items to get started</p>
          <Link
            to="/"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Your Cart ({itemCount} items)</h1>

        {canceled && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md mb-6">
            Your checkout was canceled. Your cart items are still saved.
          </div>
        )}

        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cart.items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}

            <Link
              to="/"
              className="inline-block mt-6 text-sm text-gray-600 hover:text-gray-900"
            >
              &larr; Continue Shopping
            </Link>
          </div>

          {/* Cart Summary */}
          <div className="mt-8 lg:mt-0">
            <CartSummary />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
