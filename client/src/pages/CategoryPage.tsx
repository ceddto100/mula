import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import { useProducts } from '../hooks/useProducts';
import { capitalizeFirst } from '../utils/formatters';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    sizes: searchParams.get('sizes')?.split(',').filter(Boolean),
    colors: searchParams.get('colors')?.split(',').filter(Boolean),
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
  });

  const page = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || '-createdAt';

  const { products, isLoading, pagination } = useProducts({
    category: category !== 'all' ? category : undefined,
    page,
    limit: 12,
    sort,
    ...filters,
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.sizes?.length) params.set('sizes', newFilters.sizes.join(','));
    if (newFilters.colors?.length) params.set('colors', newFilters.colors.join(','));
    if (newFilters.minPrice) params.set('minPrice', String(newFilters.minPrice));
    if (newFilters.maxPrice) params.set('maxPrice', String(newFilters.maxPrice));
    if (sort !== '-createdAt') params.set('sort', sort);
    setSearchParams(params);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoryTitle = category === 'all' ? 'All Products' : capitalizeFirst(category || '');

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{categoryTitle}</span>
        </nav>

        <div className="flex items-start gap-8">
          {/* Filters Sidebar */}
          <ProductFilters filters={filters} onFilterChange={handleFilterChange} />

          {/* Products */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold">{categoryTitle}</h1>
                <p className="text-gray-500 text-sm mt-1">
                  {pagination.total} products
                </p>
              </div>

              <div className="flex items-center gap-4">
                <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
                <select
                  value={sort}
                  onChange={handleSortChange}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                >
                  <option value="-createdAt">Newest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <ProductGrid products={products} isLoading={isLoading} />

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-md ${
                      page === i + 1
                        ? 'bg-gray-900 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
