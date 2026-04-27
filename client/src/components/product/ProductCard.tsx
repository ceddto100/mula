import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { SIZES } from '../../utils/constants';
import {
  getProductColors,
  getProductImageUrls,
  getProductName,
  getProductPrice,
  getProductSizes,
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
  const productSizes = getProductSizes(product);

  // Show product sizes if available, fall back to first 4 standard sizes
  const displaySizes = productSizes.length > 0 ? productSizes.slice(0, 5) : SIZES.slice(0, 4);
  const inStock = productStock > 0;

  return (
    <Link to={`/product/${product._id}`} className="group block">
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-800 mb-4 shadow-md hover:shadow-2xl transition-shadow duration-300">
        {imageUrls[0] ? (
          <img
            src={imageUrls[0]}
            alt={productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-grotesk text-sm text-brand-500">No image</span>
          </div>
        )}

        {/* Out-of-stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-brand-900/80 flex items-center justify-center">
            <span className="text-white font-display text-2xl tracking-wider">OUT OF STOCK</span>
          </div>
        )}

        {/* Low-stock badge */}
        {inStock && productStock < 5 && (
          <div className="absolute top-3 left-3 bg-accent-sunset text-white text-xs font-grotesk font-bold px-3 py-1.5 tracking-wider">
            ONLY {productStock} LEFT
          </div>
        )}

        {/* Quick Add overlay — slides up on hover, only when in stock */}
        {inStock && (
          <div className="absolute bottom-0 left-0 right-0 bg-brand-900/95 backdrop-blur-sm p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-white tracking-widest text-sm">QUICK ADD</span>
              <FiPlus className="text-accent-electric" size={15} />
            </div>
            {/* Size pills */}
            <div className="flex gap-1.5 flex-wrap">
              {displaySizes.map((size) => (
                <span
                  key={size}
                  onClick={(e) => e.preventDefault()}
                  className="px-2.5 py-1 border border-brand-600 text-brand-300 text-xs font-grotesk hover:border-accent-electric hover:text-accent-electric transition-colors cursor-pointer"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="space-y-1.5">
        <h3 className="font-grotesk font-semibold text-brand-200 group-hover:text-white transition-colors text-sm leading-tight line-clamp-2">
          {productName}
        </h3>
        <p className="text-white font-grotesk font-bold text-base">{formatPrice(productPrice)}</p>

        {/* Color swatches */}
        {productColors.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {productColors.slice(0, 5).map((color: string) => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border border-brand-600 hover:border-accent-electric transition-colors cursor-pointer"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {productColors.length > 5 && (
              <div className="flex items-center justify-center w-4 h-4 rounded-full bg-brand-700">
                <span className="text-[9px] font-grotesk font-bold text-brand-400">
                  +{productColors.length - 5}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
