import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiHeart, FiShare2 } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import ProductImageGallery from '../components/product/ProductImageGallery';
import ProductGrid from '../components/product/ProductGrid';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';
import toast from 'react-hot-toast';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, isLoading, error } = useProduct(id || '');
  const { addToCart, isLoading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Related products
  const { products: relatedProducts } = useProducts({
    category: product?.category,
    limit: 4,
  });

  const filteredRelatedProducts = relatedProducts.filter((p) => p._id !== id);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate(`/login?redirect=/product/${id}`);
      return;
    }

    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }

    try {
      await addToCart({
        productId: id!,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });
    } catch (error) {
      // Error is handled in context
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-gray-200 animate-pulse rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4" />
              <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4" />
              <div className="h-24 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/" className="text-gray-600 hover:underline">
            Return to home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-gray-900">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <ProductImageGallery images={product.images} productName={product.name} />

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold mb-6">{formatPrice(product.price)}</p>

            {product.description && (
              <p className="text-gray-600 mb-8">{product.description}</p>
            )}

            {/* Size selection */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Size</span>
                  <button className="text-sm text-gray-500 hover:text-gray-900">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md transition-colors ${
                        selectedSize === size
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'border-gray-300 hover:border-gray-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selection */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <span className="font-medium block mb-3">
                  Color: {selectedColor || 'Select a color'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? 'ring-2 ring-offset-2 ring-gray-900'
                          : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <span className="font-medium block mb-3">Quantity</span>
              <div className="flex items-center border border-gray-300 rounded-md w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <FiMinus size={18} />
                </button>
                <span className="px-6 py-3 text-center min-w-[60px]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-gray-100"
                  disabled={quantity >= product.stock}
                >
                  <FiPlus size={18} />
                </button>
              </div>
              {product.stock < 10 && product.stock > 0 && (
                <p className="text-red-500 text-sm mt-2">Only {product.stock} left in stock</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || cartLoading}
                className="flex-1 bg-gray-900 text-white py-4 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Out of Stock' : cartLoading ? 'Adding...' : 'Add to Cart'}
              </button>
              <button className="p-4 border border-gray-300 rounded-md hover:border-gray-900 transition-colors">
                <FiHeart size={24} />
              </button>
              <button className="p-4 border border-gray-300 rounded-md hover:border-gray-900 transition-colors">
                <FiShare2 size={24} />
              </button>
            </div>

            {/* Product info */}
            <div className="border-t pt-6 space-y-4 text-sm text-gray-600">
              <p>Free shipping on orders over $100</p>
              <p>30-day easy returns</p>
              <p>Category: {product.category}</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {filteredRelatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <ProductGrid products={filteredRelatedProducts.slice(0, 4)} />
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductPage;
