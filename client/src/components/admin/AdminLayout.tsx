import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiPackage, FiShoppingCart, FiGrid, FiLogOut, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../api/admin.api';
import { getHeadingFontFamily } from '../../utils/adminTheme';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [headingFontFamily, setHeadingFontFamily] = useState(getHeadingFontFamily('Inter'));

  useEffect(() => {
    const loadAdminTheme = async () => {
      try {
        const content = await adminApi.getHomePageContent();
        setHeadingFontFamily(getHeadingFontFamily(content.brandTheme?.headingFont));
      } catch (error) {
        console.error('Failed to load admin heading font:', error);
      }
    };

    loadAdminTheme();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { path: '/admin', icon: FiGrid, label: 'Dashboard' },
    { path: '/admin/products', icon: FiPackage, label: 'Products' },
    { path: '/admin/orders', icon: FiShoppingCart, label: 'Orders' },
  ];

  return (
    <div
      className="min-h-screen bg-white text-gray-900 admin-theme"
      style={{ '--admin-heading-font': headingFontFamily } as React.CSSProperties}
    >
      {/* Top header */}
      <header className="bg-white shadow-sm">
        <div className="w-full px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <FiArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Store</span>
            </Link>
            <span className="text-gray-300">|</span>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="w-full px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
