import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/product/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { useSeo } from '../hooks/useSeo';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  const { products, isLoading } = useProducts({
    search: query,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    limit: 48,
  });
  useSeo(
    query ? `Search "${query}" | Cualquier` : 'Search | Cualquier',
    'Search the Cualquier catalog by product, collection, and style.'
  );

  const updateQuery = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set('q', value);
    } else {
      next.delete('q');
    }
    setSearchParams(next);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-display mb-4">Search</h1>
        <input
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          placeholder="Search products, collections, styles..."
          className="w-full max-w-2xl border-2 border-brand-300 focus:border-brand-500 px-4 py-3 rounded-md"
        />
        <p className="mt-4 text-sm text-brand-700">
          {query ? `Showing results for "${query}"` : 'Enter a search term to discover products.'}
        </p>

        {isLoading ? (
          <div className="py-16 text-center text-brand-500">Loading results...</div>
        ) : (
          <div className="mt-8">
            <ProductGrid products={products} isLoading={false} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
