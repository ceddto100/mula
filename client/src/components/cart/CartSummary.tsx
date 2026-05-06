import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({ showCheckoutButton = true }) => {
  const { subtotal, itemCount } = useCart();
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-gray-900">
      <h3 className="text-2xl font-semibold mb-5 text-gray-900">Order Summary</h3>

      <div className="space-y-3 text-base">
        <div className="flex justify-between">
          <span className="text-gray-700">Subtotal ({itemCount} items)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <p className="text-sm text-gray-600">
          Taxes and shipping calculated at checkout.
        </p>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between font-bold text-4xl">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>

      {showCheckoutButton && (
        <div className="mt-6">
          {isAuthenticated ? (
            <Link
              to="/checkout"
              className="block w-full bg-gray-900 text-white text-center py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Proceed to Checkout
            </Link>
          ) : (
            <div>
              <Link
                to="/login?redirect=/checkout"
                className="block w-full bg-gray-900 text-white text-center py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                Login to Checkout
              </Link>
              <p className="text-xs text-gray-500 text-center mt-2">
                You need to be logged in to checkout
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartSummary;
