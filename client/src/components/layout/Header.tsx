import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const NAV_ITEMS = [
  { label: 'New', path: '/category/new-arrivals' },
  { label: 'Men', path: '/category/men' },
  { label: 'Women', path: '/category/women' },
  { label: 'Collections', path: '/category/collections' },
  { label: 'Sale', path: '/category/sale' },
];

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="bg-brand-100 sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="bg-brand-900 text-brand-100 text-center py-2 text-xs tracking-widest font-grotesk">
        FREE SHIPPING ON ORDERS OVER $75 &nbsp;•&nbsp; USE CODE: STYLE15 FOR 15% OFF
      </div>

      {/* Main header */}
      <div className="border-b border-brand-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 -ml-2 text-brand-800 hover:text-brand-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX size={24} strokeWidth={2} /> : <FiMenu size={24} strokeWidth={2} />}
            </button>

            {/* Desktop Nav Left */}
            <nav className="hidden lg:flex items-center space-x-8 flex-1">
              {NAV_ITEMS.slice(0, 2).map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="text-sm font-grotesk font-medium tracking-widest text-brand-800 hover:text-brand-900 transition-colors uppercase"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Logo - centered */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center">
              <span className="font-script text-3xl lg:text-4xl text-brand-900 leading-none">
                Cualquier
              </span>
            </Link>

            {/* Desktop Nav Right */}
            <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-end">
              {NAV_ITEMS.slice(2).map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="text-sm font-grotesk font-medium tracking-widest text-brand-800 hover:text-brand-900 transition-colors uppercase"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-3 lg:ml-8">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-brand-800 hover:text-brand-900 transition-colors"
                aria-label="Search"
              >
                <FiSearch size={20} strokeWidth={2} />
              </button>

              <Link
                to={isAuthenticated ? '/account' : '/login'}
                className="p-2 text-brand-800 hover:text-brand-900 transition-colors"
                aria-label="Account"
              >
                <FiUser size={20} strokeWidth={2} />
              </Link>

              <Link
                to="/cart"
                className="p-2 text-brand-800 hover:text-brand-900 transition-colors relative"
                aria-label="Shopping bag"
              >
                <FiShoppingBag size={20} strokeWidth={2} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-900 text-brand-100 text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="hidden xl:inline-block text-xs font-grotesk tracking-widest text-brand-700 hover:text-brand-900 ml-1 uppercase"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-brand-100 border-b border-brand-300 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-6 py-3 pl-12 border border-brand-400 focus:outline-none focus:border-brand-800 bg-white text-base font-grotesk transition-all"
                  autoFocus
                />
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" size={18} />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-600 hover:text-brand-900"
                >
                  <FiX size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[108px] bg-brand-100 z-40 overflow-y-auto">
          <nav className="flex flex-col divide-y divide-brand-300">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="px-6 py-4 text-sm font-grotesk font-medium tracking-widest text-brand-900 hover:bg-brand-200 transition-all uppercase"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 pb-4">
              {isAuthenticated ? (
                <Link
                  to="/account"
                  className="px-6 py-3 text-sm font-grotesk text-brand-700 block hover:bg-brand-200 transition-all uppercase tracking-widest"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Account
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-3 text-sm font-grotesk text-brand-700 block hover:bg-brand-200 transition-all uppercase tracking-widest"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
