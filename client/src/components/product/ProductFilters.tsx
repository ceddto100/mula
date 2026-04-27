import React, { useState } from 'react';
import { FiX, FiChevronDown } from 'react-icons/fi';
import { SIZES, COLORS } from '../../utils/constants';

interface ProductFiltersProps {
  filters: {
    sizes?: string[];
    colors?: string[];
    minPrice?: number;
    maxPrice?: number;
  };
  onFilterChange: (filters: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  isOpen,
  onClose,
}) => {
  const [openSections, setOpenSections] = useState<string[]>(['size', 'color', 'price']);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
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
    onFilterChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters =
    (filters.sizes?.length || 0) > 0 ||
    (filters.colors?.length || 0) > 0 ||
    !!filters.minPrice ||
    !!filters.maxPrice;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-80 bg-brand-900 border-l border-brand-700 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-700">
          <div className="flex items-center gap-3">
            <h2 className="text-white font-display text-xl tracking-widest">FILTERS</h2>
            {hasActiveFilters && (
              <span className="bg-accent-electric text-brand-900 text-xs font-grotesk font-bold px-2 py-0.5 rounded-full">
                ACTIVE
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-brand-400 hover:text-white transition-colors"
            aria-label="Close filters"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-accent-electric hover:text-white font-grotesk underline transition-colors"
            >
              Clear all filters
            </button>
          )}

          {/* Size */}
          <div className="border-b border-brand-700 pb-6">
            <button
              onClick={() => toggleSection('size')}
              className="flex items-center justify-between w-full py-2 text-white font-grotesk font-semibold tracking-wider"
            >
              SIZE
              <FiChevronDown
                className={`transform transition-transform text-brand-400 ${
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
                    className={`px-3 py-2 text-sm font-grotesk border transition-all ${
                      filters.sizes?.includes(size)
                        ? 'bg-accent-electric text-brand-900 border-accent-electric font-bold'
                        : 'border-brand-600 text-brand-300 hover:border-accent-electric hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color */}
          <div className="border-b border-brand-700 pb-6">
            <button
              onClick={() => toggleSection('color')}
              className="flex items-center justify-between w-full py-2 text-white font-grotesk font-semibold tracking-wider"
            >
              COLOR
              <FiChevronDown
                className={`transform transition-transform text-brand-400 ${
                  openSections.includes('color') ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.includes('color') && (
              <div className="flex flex-wrap gap-3 mt-3">
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorChange(color.name)}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${
                      filters.colors?.includes(color.name)
                        ? 'ring-2 ring-offset-2 ring-accent-electric ring-offset-brand-900 border-transparent'
                        : 'border-brand-600 hover:border-brand-400'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div>
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full py-2 text-white font-grotesk font-semibold tracking-wider"
            >
              PRICE
              <FiChevronDown
                className={`transform transition-transform text-brand-400 ${
                  openSections.includes('price') ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.includes('price') && (
              <div className="space-y-2 mt-3">
                {[
                  { label: 'Under $50', min: undefined, max: 50 },
                  { label: '$50 – $100', min: 50, max: 100 },
                  { label: '$100 – $200', min: 100, max: 200 },
                  { label: 'Over $200', min: 200, max: undefined },
                ].map((range) => (
                  <button
                    key={range.label}
                    onClick={() => handlePriceChange(range.min, range.max)}
                    className={`block w-full text-left px-4 py-2.5 text-sm font-grotesk transition-all ${
                      filters.minPrice === range.min && filters.maxPrice === range.max
                        ? 'bg-accent-electric text-brand-900 font-bold'
                        : 'text-brand-300 hover:bg-brand-800 hover:text-white'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-brand-700">
          <button
            onClick={onClose}
            className="w-full py-3 bg-accent-electric text-brand-900 font-display text-lg tracking-widest hover:bg-white transition-colors"
          >
            APPLY FILTERS
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
