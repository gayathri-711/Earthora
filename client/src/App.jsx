import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import PublicLayout from './layouts/PublicLayout';

import AboutPage from './pages/public/AboutPage';
import BlogDetailsPage from './pages/public/BlogDetailsPage';
import BlogPage from './pages/public/BlogPage';
import ContactPage from './pages/public/ContactPage';
import FaqPage from './pages/public/FaqPage';
import FarmersPage from './pages/public/FarmersPage';
import GalleryPage from './pages/public/GalleryPage';
import HomePage from './pages/public/HomePage';
import NotFoundPage from './pages/public/NotFoundPage';
import ProductDetailsPage from './pages/public/ProductDetailsPage';
import ProductsPage from './pages/public/ProductsPage';
import ServicesPage from './pages/public/ServicesPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CartPage from './pages/shop/CartPage';
import CheckoutPage from './pages/shop/CheckoutPage';
import OrderConfirmationPage from './pages/shop/OrderConfirmationPage';
import TrackOrderPage from './pages/shop/TrackOrderPage';
import WishlistPage from './pages/shop/WishlistPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import FarmerDashboard from './pages/farmer/FarmerDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailsPage />} />
                  <Route path="/farmers" element={<FarmersPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogDetailsPage />} />
                  <Route path="/faq" element={<FaqPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
                  <Route path="/track-order" element={<TrackOrderPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                <Route
                  path="/customer"
                  element={
                    <ProtectedRoute roles={['customer', 'admin']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer"
                  element={
                    <ProtectedRoute roles={['farmer', 'admin']}>
                      <FarmerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

