import React from 'react';
import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { CartItem as CartItemType } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { getProductImageUrls, getProductName, getProductPrice, getProductStock } from '../../utils/productView';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem, isLoading } = useCart();
  const product = item.productId;
  const productImages = product ? getProductImageUrls(product) : [];
  const productName = product ? getProductName(product) : '';
  const productPrice = product ? getProductPrice(product) : 0;
  const productStock = product ? getProductStock(product) : 0;

  if (!product) {
    return null;
  }

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= productStock) {
      await updateQuantity(item._id, newQuantity);
    }
  };

  const handleRemove = async () => {
    await removeItem(item._id);
  };

  return (
    <div className="flex gap-4 py-4 border-b">
      {/* Product image */}
      <Link to={`/product/${product._id}`} className="flex-shrink-0">
        <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden">
          {productImages[0] ? (
            <img
              src={productImages[0]}
              alt={productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* Product details */}
      <div className="flex-1 flex flex-col">
        <Link to={`/product/${product._id}`} className="font-medium hover:text-gray-600">
          {productName}
        </Link>

        <div className="text-sm text-gray-500 mt-1">
          <span>Size: {item.size}</span>
          <span className="mx-2">|</span>
          <span>Color: {item.color}</span>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          {/* Quantity controls */}
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isLoading || item.quantity <= 1}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiMinus size={16} />
            </button>
            <span className="px-4 py-2 text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isLoading || item.quantity >= productStock}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPlus size={16} />
            </button>
          </div>

          {/* Price and remove */}
          <div className="flex items-center gap-4">
            <span className="font-semibold">{formatPrice(productPrice * item.quantity)}</span>
            <button
              onClick={handleRemove}
              disabled={isLoading}
              className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
