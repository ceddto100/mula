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

  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({itemCount} items)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Estimated Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>

        {shipping > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Free shipping on orders over $100
          </p>
        )}

        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
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
