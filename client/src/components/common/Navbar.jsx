import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  CloudSun,
  Cpu,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  Sprout,
  User,
  Users,
  Wheat,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const mainNav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/smart-agriculture', label: 'Smart Agri' },
  { to: '/farmer-hub', label: 'Farmer Hub' },
  { to: '/crop-management', label: 'Crops' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/weather-intelligence', label: 'Weather' },
  { to: '/soil-insights', label: 'Soil' },
  { to: '/expert-connect', label: 'Experts' },
  { to: '/knowledge-hub', label: 'Knowledge' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { summary } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const dashboardPath =
    user?.role === 'admin'
      ? '/dashboard/admin'
      : user?.role === 'farmer'
        ? '/dashboard/farmer'
        : user?.role === 'expert'
          ? '/dashboard/expert'
          : '/dashboard/customer';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setSearchOpen(false);
    setMobileOpen(false);
    navigate(q ? `/marketplace?search=${encodeURIComponent(q)}` : '/marketplace');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-earthora-sand/70 bg-earthora-ivory/95 backdrop-blur-md">
      {/* Top Banner */}
      <div className="bg-earthora-forest px-4 sm:px-6 lg:px-8 xl:px-10 py-1.5 text-center text-xs font-medium text-emerald-200">
        <div className="flex w-full items-center justify-between">
          <span className="hidden sm:inline-flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-earthora-mint animate-pulse" />
            <strong className="text-white">EARTHORA 2.0:</strong> Smart Agriculture &amp; Sustainable Farming Ecosystem
          </span>
          <span className="mx-auto sm:mx-0 text-white/90">
            Rooted in Nature. Driven by Innovation. · Code <strong className="text-earthora-mint font-bold">ORGANIC10</strong> for 10% off
          </span>
          <Link
            to="/smart-agriculture"
            className="hidden lg:inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 hover:text-white"
          >
            Explore IoT Suite →
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-3 flex items-center justify-between gap-4">
        {/* Brand Symbol & Name (Present in Left Corner) */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src="/assets/earthora/logo-icon.svg"
            alt="EARTHORA"
            className="h-10 w-10 sm:h-12 sm:w-12 transition-transform duration-200 group-hover:scale-105 shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-heading text-2xl sm:text-3xl font-black tracking-widest text-earthora-forest leading-none">
              EARTHORA
            </span>
            <span className="text-[10px] sm:text-[11px] font-black tracking-[0.24em] text-earthora-olive uppercase mt-1">
              Smart Agri Ecosystem
            </span>
          </div>
        </Link>

        {/* Features Covering to the Right Side with Little Space */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 lg:gap-2.5 flex-1 ml-4 lg:ml-8">
          {/* Desktop Nav Items (Features with Little Space) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main navigation">
            {mainNav.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-earthora-forest text-white shadow-xs'
                      : 'text-earthora-charcoal/85 hover:text-earthora-forest hover:bg-earthora-sand/40'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="h-5 w-px bg-earthora-sand/80 hidden lg:block mx-1" />

          {/* Action Features (Search, Wishlist, Cart, Dashboard, Auth) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-xl border border-transparent p-2 text-earthora-charcoal transition-colors hover:border-earthora-sand hover:bg-white"
              aria-label="Search agricultural marketplace"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            <Link
              to="/wishlist"
              className="relative rounded-xl border border-transparent p-2 text-earthora-charcoal transition-colors hover:border-earthora-sand hover:bg-white"
              aria-label="Wishlist"
            >
              <Heart className="h-4.5 w-4.5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-earthora-olive px-1 text-[10px] font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative rounded-xl border border-transparent p-2 text-earthora-charcoal transition-colors hover:border-earthora-sand hover:bg-white"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {summary.count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-earthora-forest px-1 text-[10px] font-bold text-white">
                  {summary.count}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="hidden items-center gap-1.5 sm:flex">
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-earthora-forest/20 bg-earthora-forest px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-earthora-deep shadow-xs"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-earthora-mint" />
                  <span>
                    {user.role === 'admin'
                      ? 'Admin'
                      : user.role === 'farmer'
                        ? 'Farmer Hub'
                        : user.role === 'expert'
                          ? 'Expert Suite'
                          : 'My Portal'}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl p-2 text-earthora-muted hover:bg-white hover:text-red-700 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link to="/login" className="btn-secondary py-1.5 px-3 text-xs">
                  <User className="h-3.5 w-3.5" />
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary py-1.5 px-3 text-xs">
                  Join
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-xl border border-earthora-sand bg-white p-2 text-earthora-charcoal lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Live Search Drawer */}
      {searchOpen && (
        <div className="border-t border-earthora-sand bg-white px-4 py-3">
          <form onSubmit={handleSearchSubmit} className="mx-auto flex max-w-2xl gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search seeds, fertilizers, smart irrigation, equipment, produce..."
              className="input-field"
              autoFocus
            />
            <button type="submit" className="btn-primary shrink-0">
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-earthora-sand bg-white px-4 py-4 lg:hidden shadow-elevated">
          <nav className="grid grid-cols-2 gap-2 text-xs">
            {mainNav.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg p-2.5 font-medium transition-colors ${
                    isActive
                      ? 'bg-earthora-forest text-white'
                      : 'text-earthora-charcoal hover:bg-earthora-beige'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 border-t border-earthora-sand pt-3">
            {isAuthenticated ? (
              <div className="flex items-center justify-between gap-2">
                <Link
                  to={dashboardPath}
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary flex-1"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Open Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="btn-secondary"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
