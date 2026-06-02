import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch, FiHeart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const NAV_ITEMS = [
  { label: 'NEW', path: '/new-arrivals' },
  { label: 'MEN', path: '/men' },
  { label: 'WOMEN', path: '/women' },
  { label: 'COLLECTIONS', path: '/collections' },
  { label: 'SALE', path: '/sale' },
];

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  // Lock background scroll while the mobile menu is open, and close the menu
  // or search overlay on Escape.
  useEffect(() => {
    const lock = isMobileMenuOpen;
    if (lock) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen && !isSearchOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen, isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      {/* Main header */}
      <div className="border-b-2 border-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Mobile menu button — only visible on mobile, stays purple */}
            <button
              className="lg:hidden p-2 -ml-2 text-[#B53BEA] transition-opacity hover:opacity-70"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX size={26} strokeWidth={2.5} /> : <FiMenu size={26} strokeWidth={2.5} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center lg:mr-12">
              <img
                src="/Images/ccosa_logo.png"
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
                  className="text-sm xl:text-base font-grotesk font-semibold tracking-wide text-[#B53BEA] hover:opacity-70 transition-opacity relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#B53BEA] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-[#B53BEA] hover:opacity-70 transition-opacity hover:scale-110 duration-300"
                aria-label="Search"
              >
                <FiSearch size={22} strokeWidth={2} />
              </button>

              <Link
                to={isAuthenticated ? '/account' : '/login'}
                className="p-2 text-[#B53BEA] hover:opacity-70 transition-opacity hover:scale-110 duration-300"
                aria-label="Account"
              >
                <FiUser size={22} strokeWidth={2} />
              </Link>

              <Link
                to="/wishlist"
                className="hidden lg:block p-2 text-[#B53BEA] hover:opacity-70 transition-opacity hover:scale-110 duration-300"
                aria-label="Wishlist"
              >
                <FiHeart size={22} strokeWidth={2} />
              </Link>

              <Link
                to="/cart"
                className="p-2 text-[#B53BEA] hover:opacity-70 transition-opacity hover:scale-110 duration-300 relative"
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
                  className="hidden xl:inline-block text-xs font-grotesk font-semibold tracking-wider text-[#B53BEA] hover:opacity-70 transition-opacity ml-2"
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
        <div className="absolute top-full left-0 right-0 bg-black/70 backdrop-blur-md border-b-2 border-[#B53BEA] shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-6 py-4 pl-14 border-2 border-[#B53BEA] focus:outline-none bg-brand-50 text-lg font-grotesk rounded-lg transition-all"
                  autoFocus
                />
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B53BEA]" size={24} strokeWidth={2.5} />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#B53BEA] hover:opacity-70"
                >
                  <FiX size={24} strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu — always purple since it's mobile-only */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/20 z-50 overflow-y-auto max-h-[calc(100vh-5rem)]">
          <nav className="flex flex-col p-4">
            {NAV_ITEMS.map((item, index) => (
              <Link
                key={item.label}
                to={item.path}
                className="px-6 py-5 text-base font-grotesk font-semibold tracking-wide text-[#B53BEA] border-b border-white/20 hover:pl-8 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label} →
              </Link>
            ))}
            <div className="border-t border-white/20 mt-6 pt-6">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="px-6 py-4 text-sm font-grotesk text-[#B53BEA] block hover:bg-white/10 transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    MY ACCOUNT
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="px-6 py-4 text-sm font-grotesk text-[#B53BEA] block hover:bg-white/10 transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ADMIN DASHBOARD
                    </Link>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-4 text-sm font-grotesk text-[#B53BEA] block hover:bg-white/10 transition-all"
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
