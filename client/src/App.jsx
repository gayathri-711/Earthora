import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import PublicLayout from './layouts/PublicLayout';

// Public Website Pages
import AboutPage from './pages/public/AboutPage';
import ArticleDetailsPage from './pages/public/ArticleDetailsPage';
import ContactPage from './pages/public/ContactPage';
import CropManagementPage from './pages/public/CropManagementPage';
import ExpertConnectPage from './pages/public/ExpertConnectPage';
import FarmerHubPage from './pages/public/FarmerHubPage';
import HomePage from './pages/public/HomePage';
import KnowledgeHubPage from './pages/public/KnowledgeHubPage';
import MarketplacePage from './pages/public/MarketplacePage';
import NotFoundPage from './pages/public/NotFoundPage';
import ProductDetailsPage from './pages/public/ProductDetailsPage';
import SmartAgriculturePage from './pages/public/SmartAgriculturePage';
import SmartDashboardPage from './pages/public/SmartDashboardPage';
import SoilInsightsPage from './pages/public/SoilInsightsPage';
import WeatherIntelligencePage from './pages/public/WeatherIntelligencePage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Shop & Order Tracking Pages
import CartPage from './pages/shop/CartPage';
import CheckoutPage from './pages/shop/CheckoutPage';
import OrderConfirmationPage from './pages/shop/OrderConfirmationPage';
import TrackOrderPage from './pages/shop/TrackOrderPage';
import WishlistPage from './pages/shop/WishlistPage';

// Dedicated Role Dashboards
import AdminDashboard from './pages/admin/AdminDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ExpertDashboard from './pages/expert/ExpertDashboard';
import FarmerDashboard from './pages/farmer/FarmerDashboard';

// AI Doubt Clearing Assistant
import EarthoraAIChatbot from './components/chat/EarthoraAIChatbot';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                {/* Public Website Flow */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/smart-agriculture" element={<SmartAgriculturePage />} />
                  <Route path="/farmer-hub" element={<FarmerHubPage />} />
                  <Route path="/crop-management" element={<CropManagementPage />} />
                  <Route path="/marketplace" element={<MarketplacePage />} />
                  <Route path="/marketplace/:id" element={<ProductDetailsPage />} />
                  <Route path="/weather-intelligence" element={<WeatherIntelligencePage />} />
                  <Route path="/soil-insights" element={<SoilInsightsPage />} />
                  <Route path="/expert-connect" element={<ExpertConnectPage />} />
                  <Route path="/knowledge-hub" element={<KnowledgeHubPage />} />
                  <Route path="/knowledge-hub/:slug" element={<ArticleDetailsPage />} />
                  <Route path="/contact" element={<ContactPage />} />

                  {/* Backward compatibility aliases */}
                  <Route path="/products" element={<MarketplacePage />} />
                  <Route path="/products/:id" element={<ProductDetailsPage />} />
                  <Route path="/farmers" element={<FarmerHubPage />} />
                  <Route path="/blog" element={<KnowledgeHubPage />} />
                  <Route path="/blog/:slug" element={<ArticleDetailsPage />} />

                  {/* Cart & Shop */}
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
                  <Route path="/track-order" element={<TrackOrderPage />} />

                  {/* Auth */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* Smart Dashboard (Ecosystem-wide Radar) */}
                <Route path="/dashboard" element={<SmartDashboardPage />} />
                <Route path="/dashboard/smart" element={<SmartDashboardPage />} />

                {/* Role-Protected Portals */}
                <Route
                  path="/dashboard/customer"
                  element={
                    <ProtectedRoute roles={['customer', 'admin']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer"
                  element={<Navigate to="/dashboard/customer" replace />}
                />

                <Route
                  path="/dashboard/farmer"
                  element={
                    <ProtectedRoute roles={['farmer', 'admin']}>
                      <FarmerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer"
                  element={<Navigate to="/dashboard/farmer" replace />}
                />

                <Route
                  path="/dashboard/expert"
                  element={
                    <ProtectedRoute roles={['expert', 'admin']}>
                      <ExpertDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/expert"
                  element={<Navigate to="/dashboard/expert" replace />}
                />

                <Route
                  path="/dashboard/admin"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={<Navigate to="/dashboard/admin" replace />}
                />
              </Routes>

              {/* Universal 24/7 AI Doubt-Clearing Assistant */}
              <EarthoraAIChatbot />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
