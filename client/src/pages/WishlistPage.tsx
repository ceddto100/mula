import React, { useMemo, useState } from 'react';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/product/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { wishlistStore } from '../utils/wishlist';
import { useSeo } from '../hooks/useSeo';

const WishlistPage: React.FC = () => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(wishlistStore.getAll());
  const { products, isLoading } = useProducts({ limit: 100 });
  useSeo('Wishlist | Cualquier', 'Saved products you want to come back to.');

  const wishedProducts = useMemo(
    () => products.filter((product) => wishlistIds.includes(product._id)),
    [products, wishlistIds]
  );

  const clearWishlist = () => {
    wishlistIds.forEach((id) => wishlistStore.remove(id));
    setWishlistIds([]);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display">Your Wishlist</h1>
          {wishlistIds.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-sm px-4 py-2 border border-brand-400 hover:bg-brand-50 rounded"
            >
              Clear wishlist
            </button>
          )}
        </div>
        {wishlistIds.length === 0 ? (
          <div className="text-brand-600">No saved items yet. Tap the heart on a product to save it.</div>
        ) : (
          <ProductGrid products={wishedProducts} isLoading={isLoading} />
        )}
      </div>
    </Layout>
  );
};

export default WishlistPage;
