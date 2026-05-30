import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Critical routes
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import { productsApi } from './api/products.api';
import { applyAccentColor, applyHeadingFont, saveBrandTheme } from './utils/brandTheme';

// Lazy loaded routes
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const InfoPage = lazy(() => import('./pages/InfoPage'));

const RouteFallback = () => <div className="min-h-[40vh]" aria-hidden="true" />;

const App: React.FC = () => {
  useEffect(() => {
    const loadAccentColor = async () => {
      try {
        const content = await productsApi.getHomePageContent();
        applyAccentColor(content.brandTheme?.accentColor);
        applyHeadingFont(content.brandTheme?.headingFont);
        saveBrandTheme({
          accentColor: content.brandTheme?.accentColor,
          headingFont: content.brandTheme?.headingFont,
        });
      } catch (error) {
        console.error('Failed to load brand theme from API:', error);
      }
    };

    loadAccentColor();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1f2937',
                color: '#fff',
              },
            }}
          />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/category/:category/:productType" element={<CategoryPage />} />
              <Route path="/:category/:productType" element={<CategoryPage />} />
              <Route path="/:category" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/products/:handle" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/shipping" element={<InfoPage />} />
              <Route path="/returns" element={<InfoPage />} />
              <Route path="/faq" element={<InfoPage />} />
              <Route path="/size-guide" element={<InfoPage />} />
              <Route path="/contact" element={<InfoPage />} />
              <Route path="/about" element={<InfoPage />} />
              <Route path="/careers" element={<InfoPage />} />
              <Route path="/stores" element={<InfoPage />} />
              <Route path="/sustainability" element={<InfoPage />} />
              <Route path="/privacy" element={<InfoPage />} />
              <Route path="/terms" element={<InfoPage />} />
              <Route path="/accessibility" element={<InfoPage />} />

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-success"
                element={
                  <ProtectedRoute>
                    <OrderSuccessPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account/:tab"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminOrders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold mb-4">404</h1>
                      <p className="text-gray-500 mb-8">Page not found</p>
                      <a href="/" className="text-gray-900 hover:underline">
                        Go back home
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
