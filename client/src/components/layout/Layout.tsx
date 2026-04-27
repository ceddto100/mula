import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-brand-900/45 via-brand-950/20 to-brand-900/45" />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
