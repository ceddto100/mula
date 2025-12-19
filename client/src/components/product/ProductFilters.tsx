import React, { useState } from 'react';
import { FiX, FiFilter, FiChevronDown } from 'react-icons/fi';
import { SIZES, COLORS } from '../../utils/constants';

interface ProductFiltersProps {
  filters: {
    sizes?: string[];
    colors?: string[];
    minPrice?: number;
    maxPrice?: number;
  };
  onFilterChange: (filters: any) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onFilterChange }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(['size', 'color', 'price']);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleSizeChange = (size: string) => {
    const currentSizes = filters.sizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    onFilterChange({ ...filters, sizes: newSizes.length ? newSizes : undefined });
  };

  const handleColorChange = (color: string) => {
    const currentColors = filters.colors || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter((c) => c !== color)
      : [...currentColors, color];
    onFilterChange({ ...filters, colors: newColors.length ? newColors : undefined });
  };

  const handlePriceChange = (min?: number, max?: number) => {
    onFilterChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters =
    (filters.sizes?.length || 0) > 0 ||
    (filters.colors?.length || 0) > 0 ||
    filters.minPrice ||
    filters.maxPrice;

  const FilterContent = () => (
    <div className="space-y-6">
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          Clear all filters
        </button>
      )}

      {/* Size filter */}
      <div>
        <button
          onClick={() => toggleSection('size')}
          className="flex items-center justify-between w-full py-2 font-semibold"
        >
          Size
          <FiChevronDown
            className={`transform transition-transform ${
              openSections.includes('size') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {openSections.includes('size') && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                  filters.sizes?.includes(size)
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-gray-300 hover:border-gray-900'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color filter */}
      <div>
        <button
          onClick={() => toggleSection('color')}
          className="flex items-center justify-between w-full py-2 font-semibold"
        >
          Color
          <FiChevronDown
            className={`transform transition-transform ${
              openSections.includes('color') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {openSections.includes('color') && (
          <div className="flex flex-wrap gap-2 mt-3">
            {COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorChange(color.name)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  filters.colors?.includes(color.name)
                    ? 'ring-2 ring-offset-2 ring-gray-900'
                    : 'border-gray-200'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Price filter */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full py-2 font-semibold"
        >
          Price
          <FiChevronDown
            className={`transform transition-transform ${
              openSections.includes('price') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {openSections.includes('price') && (
          <div className="space-y-2 mt-3">
            {[
              { label: 'Under $50', min: undefined, max: 50 },
              { label: '$50 - $100', min: 50, max: 100 },
              { label: '$100 - $200', min: 100, max: 200 },
              { label: 'Over $200', min: 200, max: undefined },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => handlePriceChange(range.min, range.max)}
                className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  filters.minPrice === range.min && filters.maxPrice === range.max
                    ? 'bg-gray-900 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile filter button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md"
      >
        <FiFilter size={18} />
        Filters
        {hasActiveFilters && (
          <span className="bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
            {(filters.sizes?.length || 0) + (filters.colors?.length || 0) + (filters.minPrice ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <h2 className="text-lg font-semibold mb-6">Filters</h2>
        <FilterContent />
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setIsMobileOpen(false)}>
                <FiX size={24} />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilters;
