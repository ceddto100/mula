import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {isHomePage ? (
          children
        ) : (
          <div className="min-h-full bg-white/95 text-gray-900 backdrop-blur-[2px]">{children}</div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
