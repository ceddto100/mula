import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch, FiHeart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const NAV_ITEMS = [
  { label: 'MEN', path: '/category/men' },
  { label: 'WOMEN', path: '/category/women' },
  { label: 'KIDS & BABY', path: '/category/kids' },
  { label: 'HOME', path: '/category/home' },
  { label: 'GIFTS', path: '/category/gifts' },
  { label: 'DISCOVER', path: '/category/new-arrivals' },
  { label: 'SALE', path: '/category/sale' },
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
    <header className="bg-white sticky top-0 z-50">
      {/* Main header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-xl lg:text-2xl tracking-[0.3em] font-light text-gray-900">
                MULA
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="text-xs xl:text-sm tracking-wider text-gray-700 hover:text-gray-900 transition-colors font-normal"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:opacity-70 transition-opacity"
                aria-label="Search"
              >
                <FiSearch size={20} strokeWidth={1.5} />
              </button>

              <Link
                to={isAuthenticated ? '/account' : '/login'}
                className="p-2 hover:opacity-70 transition-opacity"
                aria-label="Account"
              >
                <FiUser size={20} strokeWidth={1.5} />
              </Link>

              <Link
                to="/wishlist"
                className="hidden lg:block p-2 hover:opacity-70 transition-opacity"
                aria-label="Wishlist"
              >
                <FiHeart size={20} strokeWidth={1.5} />
              </Link>

              <Link
                to="/cart"
                className="p-2 hover:opacity-70 transition-opacity relative"
                aria-label="Shopping bag"
              >
                <FiShoppingBag size={20} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gray-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="hidden xl:inline-block text-xs tracking-wider text-gray-700 hover:text-gray-900 ml-2"
                >
                  ADMIN
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full px-4 py-3 pl-12 border-b border-gray-300 focus:outline-none focus:border-gray-900 bg-transparent text-lg"
                  autoFocus
                />
                <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
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
        <div className="lg:hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto">
          <nav className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="px-6 py-4 text-sm tracking-wider text-gray-900 border-b border-gray-100 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 mt-4 pt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="px-6 py-4 text-sm tracking-wider text-gray-700 block hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    MY ACCOUNT
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="px-6 py-4 text-sm tracking-wider text-gray-700 block hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ADMIN DASHBOARD
                    </Link>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-4 text-sm tracking-wider text-gray-700 block hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  SIGN IN
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
