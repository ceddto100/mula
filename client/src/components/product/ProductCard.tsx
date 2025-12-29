import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import {
  getProductColors,
  getProductImageUrls,
  getProductName,
  getProductPrice,
  getProductStock,
} from '../../utils/productView';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrls = getProductImageUrls(product);
  const productName = getProductName(product);
  const productPrice = getProductPrice(product);
  const productStock = getProductStock(product);
  const productColors = getProductColors(product);

  return (
    <Link to={`/product/${product._id}`} className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-100 mb-4 shadow-md hover:shadow-xl transition-shadow duration-300">
        {imageUrls[0] ? (
          <>
            <img
              src={imageUrls[0]}
              alt={productName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            {/* Hover Overlay with Arrow */}
            <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/20 transition-all duration-300 flex items-center justify-center">
              <div className="text-white text-6xl opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300">
                →
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-400">
            <span className="font-grotesk">No image</span>
          </div>
        )}

        {/* Stock Status Badges */}
        {productStock === 0 && (
          <div className="absolute inset-0 bg-brand-900/80 flex items-center justify-center">
            <span className="text-white font-display text-2xl tracking-wider">OUT OF STOCK</span>
          </div>
        )}
        {productStock > 0 && productStock < 5 && (
          <div className="absolute top-3 left-3 bg-accent-sunset text-white text-xs font-grotesk font-bold px-3 py-1.5 tracking-wider">
            ONLY {productStock} LEFT
          </div>
        )}

        {/* Quick View CTA */}
        <div className="absolute bottom-0 left-0 right-0 bg-brand-900 text-white p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <span className="font-grotesk font-semibold text-sm tracking-wide">QUICK VIEW</span>
            <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" size={18} />
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-grotesk font-semibold text-brand-900 group-hover:text-brand-500 transition-colors text-base leading-tight">
          {productName}
        </h3>
        <p className="text-brand-900 font-grotesk font-bold text-lg">{formatPrice(productPrice)}</p>

        {/* Color Swatches */}
        {productColors.length > 0 && (
          <div className="flex gap-1.5 mt-3">
            {productColors.slice(0, 5).map((color: string) => (
              <div
                key={color}
                className="w-5 h-5 rounded-full border-2 border-brand-300 hover:border-brand-500 transition-colors cursor-pointer"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {productColors.length > 5 && (
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-200 border-2 border-brand-300">
                <span className="text-[10px] font-grotesk font-bold text-brand-700">+{productColors.length - 5}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
