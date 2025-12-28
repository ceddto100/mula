import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch, FiHeart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const NAV_ITEMS = [
  { label: 'NEW', path: '/category/new-arrivals' },
  { label: 'MEN', path: '/category/men' },
  { label: 'WOMEN', path: '/category/women' },
  { label: 'COLLECTIONS', path: '/category/collections' },
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
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Main header */}
      <div className="border-b-2 border-brand-500">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 -ml-2 text-brand-700 hover:text-brand-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX size={26} strokeWidth={2.5} /> : <FiMenu size={26} strokeWidth={2.5} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center lg:mr-12">
              <img
                src="/images/Cualquier_logo.png"
                alt="Cualquier"
                className="h-12 lg:h-16 w-auto hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10 flex-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="text-sm xl:text-base font-grotesk font-semibold tracking-wide text-brand-800 hover:text-brand-500 transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-brand-700 hover:text-brand-500 transition-colors hover:scale-110 duration-300"
                aria-label="Search"
              >
                <FiSearch size={22} strokeWidth={2} />
              </button>

              <Link
                to={isAuthenticated ? '/account' : '/login'}
                className="p-2 text-brand-700 hover:text-brand-500 transition-colors hover:scale-110 duration-300"
                aria-label="Account"
              >
                <FiUser size={22} strokeWidth={2} />
              </Link>

              <Link
                to="/wishlist"
                className="hidden lg:block p-2 text-brand-700 hover:text-brand-500 transition-colors hover:scale-110 duration-300"
                aria-label="Wishlist"
              >
                <FiHeart size={22} strokeWidth={2} />
              </Link>

              <Link
                to="/cart"
                className="p-2 text-brand-700 hover:text-brand-500 transition-colors hover:scale-110 duration-300 relative"
                aria-label="Shopping bag"
              >
                <FiShoppingBag size={22} strokeWidth={2} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-electric text-brand-900 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="hidden xl:inline-block text-xs font-grotesk font-semibold tracking-wider text-brand-700 hover:text-brand-500 ml-2"
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
        <div className="absolute top-full left-0 right-0 bg-white border-b-2 border-brand-500 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-6 py-4 pl-14 border-2 border-brand-300 focus:outline-none focus:border-brand-500 bg-brand-50 text-lg font-grotesk rounded-lg transition-all"
                  autoFocus
                />
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" size={24} strokeWidth={2.5} />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-brand-700 hover:text-brand-500"
                >
                  <FiX size={24} strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-brand-900 z-40 overflow-y-auto">
          <nav className="flex flex-col p-4">
            {NAV_ITEMS.map((item, index) => (
              <Link
                key={item.label}
                to={item.path}
                className="px-6 py-5 text-base font-grotesk font-semibold tracking-wide text-white border-b border-brand-700 hover:bg-brand-800 hover:pl-8 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.label} →
              </Link>
            ))}
            <div className="border-t-2 border-brand-600 mt-6 pt-6">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="px-6 py-4 text-sm font-grotesk text-brand-200 block hover:bg-brand-800 hover:text-white transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    MY ACCOUNT
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="px-6 py-4 text-sm font-grotesk text-brand-200 block hover:bg-brand-800 hover:text-white transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ADMIN DASHBOARD
                    </Link>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-4 text-sm font-grotesk text-brand-200 block hover:bg-brand-800 hover:text-white transition-all"
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
