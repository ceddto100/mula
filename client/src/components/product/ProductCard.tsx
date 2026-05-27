import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiBell } from 'react-icons/fi';
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

const CLOUDINARY_RE = /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)/;

function buildCloudinaryUrl(url: string, width: number): string {
  if (!url) return url;
  const match = url.match(CLOUDINARY_RE);
  if (!match) return url;
  const versionMatch = match[2].match(/(v\d+\/.+)$/);
  const assetPath = versionMatch ? versionMatch[1] : match[2];
  return `${match[1]}f_auto,q_auto,c_fill,g_auto,w_${width}/${assetPath}`;
}

const CARD_WIDTHS = [240, 360, 480, 720];

function getCardSrcSet(url: string): string | undefined {
  if (!url || !CLOUDINARY_RE.test(url)) return undefined;
  return CARD_WIDTHS.map((w) => `${buildCloudinaryUrl(url, w)} ${w}w`).join(', ');
}

function getCardSrc(url: string): string {
  if (!url) return url;
  if (!CLOUDINARY_RE.test(url)) return url;
  return buildCloudinaryUrl(url, 480);
}

interface ProductCardProps {
  product: Product;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrls = getProductImageUrls(product);
  const productName = getProductName(product);
  const productPrice = getProductPrice(product);
  const productStock = getProductStock(product);
  const productColors = getProductColors(product);
  const productSizes = getProductSizes(product);

  const displaySizes = productSizes.length > 0 ? productSizes.slice(0, 5) : SIZES.slice(0, 4);
  const inStock = productStock > 0;

  return (
    <Link to={`/product/${product._id}`} className="group block">
      {/* Image container */}
      <div
        className={`
          relative aspect-[3/4] overflow-hidden rounded-2xl mb-3
          transition-all duration-500 ease-out
          shadow-[0_4px_24px_rgba(0,0,0,0.10)]
          group-hover:shadow-[0_16px_48px_rgba(181,59,234,0.28)]
          group-hover:-translate-y-0.5
          ${!inStock ? 'ring-1 ring-[#B53BEA]/30' : ''}
        `}
      >
        {imageUrls[0] ? (
          <img
            src={getCardSrc(imageUrls[0])}
            srcSet={getCardSrcSet(imageUrls[0])}
            sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 45vw"
            alt={productName}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            style={!inStock ? { filter: 'grayscale(22%) brightness(0.96)' } : undefined}
            loading="lazy"
            decoding="async"
            width={480}
            height={640}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="font-grotesk text-sm text-gray-400">No image</span>
          </div>
        )}

        {/* Sold out: ultra-subtle dark veil — image stays 80%+ visible */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/18 pointer-events-none" />
        )}

        {/* Sold out: diagonal corner ribbon */}
        {!inStock && (
          <div className="absolute top-0 right-0 w-[108px] h-[108px] overflow-hidden pointer-events-none">
            <div
              className="absolute top-[24px] right-[-30px] w-[136px] py-[6px] text-center font-grotesk font-black tracking-[0.18em] text-[9px] text-white shadow-md"
              style={{ backgroundColor: '#B53BEA', transform: 'rotate(45deg)' }}
            >
              SOLD OUT
            </div>
          </div>
        )}

        {/* Low-stock badge */}
        {inStock && productStock < 5 && (
          <div
            className="absolute top-3 left-3 text-white text-[10px] font-grotesk font-black px-3 py-1.5 tracking-widest rounded-sm shadow-lg"
            style={{ backgroundColor: '#B53BEA' }}
          >
            ONLY {productStock} LEFT
          </div>
        )}

        {/* Sold out: Notify Me — fades up on hover */}
        {!inStock && (
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-350 ease-out pointer-events-none group-hover:pointer-events-auto">
            <button
              onClick={(e) => e.preventDefault()}
              className="w-full flex items-center justify-center gap-2 py-3 text-white text-[11px] font-grotesk font-black tracking-[0.14em] uppercase rounded-xl shadow-xl backdrop-blur-sm transition-colors duration-200 hover:brightness-110"
              style={{ backgroundColor: '#B53BEA' }}
            >
              <FiBell size={13} strokeWidth={2.5} />
              Notify Me
            </button>
          </div>
        )}

        {/* In-stock: Quick Add — slides up on hover */}
        {inStock && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/88 backdrop-blur-sm p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-white tracking-widest text-sm">QUICK ADD</span>
              <FiPlus style={{ color: '#B53BEA' }} size={15} />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {displaySizes.map((size) => (
                <span
                  key={size}
                  onClick={(e) => e.preventDefault()}
                  className="px-2.5 py-1 border border-white/25 text-white/75 text-xs font-grotesk rounded-sm cursor-pointer transition-all duration-150 hover:border-[#B53BEA] hover:text-[#B53BEA]"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="space-y-1 px-0.5">
        <h3
          className={`font-grotesk font-semibold text-sm leading-tight line-clamp-2 transition-colors duration-200 ${
            inStock ? 'text-black group-hover:text-gray-700' : 'text-black/65'
          }`}
        >
          {productName}
        </h3>

        <div className="flex items-center gap-2">
          <p className={`font-grotesk font-bold text-base ${inStock ? 'text-black' : 'text-black/55'}`}>
            {formatPrice(productPrice)}
          </p>
          {!inStock && (
            <span className="text-[9px] font-grotesk font-black tracking-[0.16em] uppercase" style={{ color: '#B53BEA' }}>
              Sold Out
            </span>
          )}
        </div>

        {/* Color swatches */}
        {productColors.length > 0 && (
          <div className="flex gap-1.5 pt-0.5">
            {productColors.slice(0, 5).map((color: string) => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border border-gray-300 hover:border-[#B53BEA] transition-colors cursor-pointer"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {productColors.length > 5 && (
              <div className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-200">
                <span className="text-[9px] font-grotesk font-bold text-gray-500">
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

const ProductCard = React.memo(ProductCardComponent);

export default ProductCard;
