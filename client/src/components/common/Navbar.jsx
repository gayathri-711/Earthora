import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Heart,
  Menu,
  Search,
  ShoppingBasket,
  Sprout,
  User,
  X,
  LayoutDashboard,
  LogOut,
  Package,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop Produce' },
  { to: '/farmers', label: 'Farmers' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/blog', label: 'Journal' },
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
      ? '/admin'
      : user?.role === 'farmer'
        ? '/farmer'
        : '/customer';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setSearchOpen(false);
    setMobileOpen(false);
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : '/products');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-agriva-line/80 bg-agriva-cream/95 backdrop-blur-md">
      <div className="bg-agriva-forest px-4 py-1.5 text-center text-xs font-medium text-agriva-mint">
        <span className="inline-flex items-center gap-2">
          <Sprout className="h-3.5 w-3.5" />
          From Farm to Home – Naturally Organic · Free chilled delivery on orders over $50 · Use{' '}
          <strong className="text-white">ORGANIC10</strong> for 10% off
        </span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/assets/img/logo/black-logo.svg" alt="AGRIVA" className="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-agriva-forest underline decoration-agriva-leaf decoration-2 underline-offset-8'
                    : 'text-agriva-muted hover:text-agriva-forest'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-lg border border-transparent p-2 text-agriva-ink transition-colors hover:border-agriva-line hover:bg-white"
            aria-label="Search organic products"
          >
            <Search className="h-5 w-5" />
          </button>

          <Link
            to="/track-order"
            className="hidden rounded-lg border border-transparent p-2 text-agriva-ink transition-colors hover:border-agriva-line hover:bg-white sm:inline-flex"
            title="Track Order"
            aria-label="Track order"
          >
            <Package className="h-5 w-5" />
          </Link>

          <Link
            to="/wishlist"
            className="relative rounded-lg border border-transparent p-2 text-agriva-ink transition-colors hover:border-agriva-line hover:bg-white"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-agriva-earth px-1 text-[10px] font-bold text-white">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative rounded-lg border border-transparent p-2 text-agriva-ink transition-colors hover:border-agriva-line hover:bg-white"
            aria-label="Shopping cart"
          >
            <ShoppingBasket className="h-5 w-5" />
            {summary.count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-agriva-forest px-1 text-[10px] font-bold text-white">
                {summary.count}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to={dashboardPath}
                className="inline-flex items-center gap-1.5 rounded-lg border border-agriva-line bg-white px-3 py-1.5 text-xs font-semibold text-agriva-forest transition-colors hover:bg-agriva-oat"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                {user.role === 'admin'
                  ? 'Admin'
                  : user.role === 'farmer'
                    ? 'Farmer Portal'
                    : user.name.split(' ')[0]}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg p-2 text-agriva-muted hover:bg-white hover:text-red-700"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary hidden py-2 text-xs sm:inline-flex">
              <User className="h-3.5 w-3.5" />
              Sign In
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg border border-agriva-line bg-white p-2 text-agriva-ink lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-agriva-line bg-white px-4 py-3">
          <form onSubmit={handleSearchSubmit} className="mx-auto flex max-w-2xl gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tomatoes, honey, heritage grains, apples..."
              className="input-field"
              autoFocus
            />
            <button type="submit" className="btn-primary shrink-0">
              Search
            </button>
          </form>
        </div>
      )}

      {mobileOpen && (
        <div className="border-t border-agriva-line bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-agriva-mint/40 text-agriva-forest' : 'text-agriva-ink hover:bg-agriva-oat'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/track-order"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-agriva-ink hover:bg-agriva-oat"
            >
              Track Order
            </Link>
            <div className="mt-2 border-t border-agriva-line pt-3">
              {isAuthenticated ? (
                <div className="flex items-center justify-between gap-2">
                  <Link
                    to={dashboardPath}
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary flex-1"
                  >
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
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

