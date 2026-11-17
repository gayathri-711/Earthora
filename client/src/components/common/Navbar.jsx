import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  CloudSun,
  Cpu,
  Heart,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  Sprout,
  Tractor,
  User,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

// All navigation module options matching user's screenshot
const allNavLinks = [
  { to: '/', label: 'Home', icon: Home, desc: 'Ecosystem overview & live field telemetry' },
  { to: '/about', label: 'About', icon: Sparkles, desc: 'The Earthora standard & scientific pillars' },
  { to: '/smart-agriculture', label: 'Smart Agri', icon: Cpu, desc: 'Precision IoT architecture & drone NDVI' },
  { to: '/farmer-hub', label: 'Farmer Hub', icon: Tractor, desc: 'Regional farm directory & land metrics' },
  { to: '/crop-management', label: 'Crops', icon: Sprout, desc: 'Crop lifecycle phenology & harvest tracking' },
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag, desc: 'Seeds, organic fertilizers & tools in ₹' },
  { to: '/weather-intelligence', label: 'Weather', icon: CloudSun, desc: 'Hyperlocal microclimate radar & frost alerts' },
  { to: '/soil-insights', label: 'Soil', icon: Layers, desc: 'Rhizosphere NPK availability & biochar' },
  { to: '/expert-connect', label: 'Experts', icon: Users, desc: '1-on-1 consultations with accredited agronomists' },
  { to: '/knowledge-hub', label: 'Knowledge', icon: BookOpen, desc: 'Regenerative field trials & whitepapers' },
  { to: '/contact', label: 'Contact', icon: Mail, desc: 'Regional campuses & agronomy inquiry' },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { summary } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMenuDrawerOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (menuDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuDrawerOpen]);

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
    setMenuDrawerOpen(false);
    navigate(q ? `/marketplace?search=${encodeURIComponent(q)}` : '/marketplace');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-earthora-sand/70 bg-earthora-ivory/95 backdrop-blur-md">
      {/* Top Announcement Banner */}
      <div className="bg-earthora-forest px-3 sm:px-6 lg:px-8 py-1.5 text-center text-[11px] sm:text-xs font-medium text-emerald-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
          <span className="hidden md:inline-flex items-center gap-2 shrink-0">
            <span className="flex h-2 w-2 rounded-full bg-earthora-mint animate-pulse" />
            <strong className="text-white">EARTHORA 2.0:</strong> Smart Agriculture &amp; Sustainable Farming Ecosystem
          </span>
          <span className="mx-auto md:mx-0 text-white/90 truncate">
            Rooted in Nature. Driven by Innovation. · Code <strong className="text-earthora-mint font-bold">ORGANIC10</strong> for 10% off
          </span>
          <Link
            to="/smart-agriculture"
            className="hidden lg:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 hover:text-white shrink-0"
          >
            Explore IoT Suite →
          </Link>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Symbol & Name (Left Corner) */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
          <img
            src="/assets/earthora/logo-icon.svg"
            alt="EARTHORA"
            className="h-9 w-9 sm:h-11 sm:w-11 transition-transform duration-200 group-hover:scale-105 shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-heading text-xl sm:text-2xl lg:text-3xl font-black tracking-widest text-earthora-forest leading-none">
              EARTHORA
            </span>
            <span className="hidden xs:block text-[9px] sm:text-[10px] font-black tracking-[0.24em] text-earthora-olive uppercase mt-0.5 sm:mt-1">
              Smart Agri Ecosystem
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-1 justify-end ml-2 xl:ml-4" aria-label="Desktop wide navigation">
          {allNavLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-2.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
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

        {/* Divider on desktop */}
        <div className="h-5 w-px bg-earthora-sand/80 hidden lg:block mx-1 shrink-0" />

        {/* Action Features (Search, Wishlist, Cart, Sign In, Three Dashes Button) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Quick Search Button */}
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-xl border border-transparent p-2 text-earthora-charcoal transition-colors hover:border-earthora-sand hover:bg-white"
            aria-label="Search agricultural marketplace"
            title="Search products and knowledge"
          >
            <Search className="h-4.5 w-4.5" />
          </button>

          {/* Favourite / Wishlist Link */}
          <Link
            to="/wishlist"
            className="relative rounded-xl border border-transparent p-2 text-earthora-charcoal transition-colors hover:border-earthora-sand hover:bg-white"
            aria-label="Wishlist (Favourite)"
            title="Saved items"
          >
            <Heart className="h-4.5 w-4.5" />
            {wishlistItems.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-earthora-olive px-1 text-[10px] font-bold text-white shadow-xs">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Shopping Cart Link */}
          <Link
            to="/cart"
            className="relative rounded-xl border border-transparent p-2 text-earthora-charcoal transition-colors hover:border-earthora-sand hover:bg-white"
            aria-label="Shopping Cart"
            title="Agricultural cart"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {summary.count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-earthora-forest px-1 text-[10px] font-bold text-white shadow-xs">
                {summary.count}
              </span>
            )}
          </Link>

          {/* Sign In / Auth Status */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Link
                to={dashboardPath}
                className="inline-flex items-center gap-1 rounded-full border border-earthora-forest/20 bg-earthora-forest px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-earthora-deep shadow-xs"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-earthora-mint" />
                <span className="hidden xs:inline">
                  {user.role === 'admin'
                    ? 'Admin'
                    : user.role === 'farmer'
                      ? 'Farmer'
                      : user.role === 'expert'
                        ? 'Expert'
                        : 'Portal'}
                </span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden sm:inline-flex rounded-xl p-2 text-earthora-muted hover:bg-white hover:text-red-700 transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-full border border-earthora-sand bg-white px-2.5 sm:px-3 py-1.5 text-xs font-bold text-earthora-forest hover:bg-earthora-forest hover:text-white transition-all shadow-xs whitespace-nowrap"
            >
              <User className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Link>
          )}

          {/* THREE DASHES (☰) IN RIGHT CORNER NEAR CART, FAVOURITE & SIGN IN */}
          <button
            type="button"
            onClick={() => setMenuDrawerOpen((v) => !v)}
            className="rounded-xl border border-earthora-sand/90 bg-white p-2 text-earthora-forest shadow-xs hover:bg-earthora-forest hover:text-earthora-mint hover:border-earthora-forest transition-all flex items-center justify-center shrink-0 ml-0.5 sm:ml-1"
            aria-label="Open all module options"
            aria-expanded={menuDrawerOpen}
            title="Open all module options"
          >
            {menuDrawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Ribbon */}
      <nav
        className="lg:hidden border-t border-earthora-sand/70 bg-earthora-ivory/95 backdrop-blur-md px-2.5 py-1.5 overflow-x-auto scrollbar-none shadow-xs"
        aria-label="Mobile navigation ribbon"
      >
        <div className="flex items-center gap-1 min-w-max px-0.5">
          {allNavLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-earthora-forest text-white shadow-xs font-black'
                    : 'bg-white/80 border border-earthora-sand/80 text-earthora-charcoal/85 hover:text-earthora-forest hover:bg-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Live Search Drawer Overlay */}
      {searchOpen && (
        <div className="border-t border-earthora-sand/80 bg-white px-4 py-4 shadow-elevated transition-all">
          <form onSubmit={handleSearchSubmit} className="mx-auto flex max-w-2xl items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-earthora-muted" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search heirloom seeds, bio-fertilizers, weather, guides, or crop varieties..."
                className="w-full rounded-xl border border-earthora-sand bg-earthora-ivory/60 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-earthora-charcoal placeholder-earthora-muted focus:border-earthora-forest focus:bg-white focus:outline-none"
              />
            </div>
            <button type="submit" className="btn-primary py-2.5 px-4 text-xs font-bold shrink-0">
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="rounded-xl border border-earthora-sand p-2 text-earthora-muted hover:bg-earthora-ivory hover:text-earthora-charcoal"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* SLIDE-OVER DRAWER WITH ALL MODULE OPTIONS (TRIGGERED BY THREE DASHES) */}
      {menuDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-earthora-forest/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMenuDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Panel (Active across all screen sizes) */}
          <aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm sm:max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out border-l border-earthora-sand/80 overflow-y-auto"
            aria-label="All Module Navigation Drawer"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-earthora-sand/80 bg-earthora-forest p-4 sm:p-5 text-white">
              <Link
                to="/"
                onClick={() => setMenuDrawerOpen(false)}
                className="flex items-center gap-2.5 group"
              >
                <img
                  src="/assets/earthora/logo-icon.svg"
                  alt="EARTHORA"
                  className="h-9 w-9 shrink-0"
                />
                <div>
                  <div className="font-heading text-xl font-black tracking-widest leading-none">
                    EARTHORA
                  </div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-earthora-mint uppercase mt-0.5">
                    All Platform Modules
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMenuDrawerOpen(false)}
                className="rounded-xl border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Search inside Drawer */}
            <div className="p-4 border-b border-earthora-sand/60 bg-earthora-ivory/50">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-earthora-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search marketplace, weather, articles..."
                  className="w-full rounded-xl border border-earthora-sand bg-white py-2 pl-9 pr-8 text-xs text-earthora-charcoal placeholder-earthora-muted focus:border-earthora-forest focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-earthora-muted hover:text-earthora-charcoal"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </form>
            </div>

            {/* Drawer Content: ALL MODULE OPTIONS */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <div>
                <div className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-earthora-olive mb-2.5 flex items-center justify-between">
                  <span>Ecosystem Modules ({allNavLinks.length})</span>
                  <span className="text-[10px] text-earthora-muted">1-Tap Navigation</span>
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {allNavLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === '/'}
                        onClick={() => setMenuDrawerOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all group ${
                            isActive
                              ? 'bg-earthora-forest text-white shadow-xs'
                              : 'text-earthora-forest bg-earthora-ivory/40 border border-earthora-sand/60 hover:bg-earthora-forest hover:text-white hover:border-earthora-forest'
                          }`
                        }
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-earthora-mint/20 text-earthora-forest group-hover:bg-white/20 group-hover:text-earthora-mint shrink-0">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-heading text-xs font-bold leading-none">{link.label}</div>
                          <div className="text-[10px] text-earthora-muted group-hover:text-emerald-200 truncate mt-0.5">
                            {link.desc}
                          </div>
                        </div>
                        <span className="text-xs opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transform transition-transform">
                          →
                        </span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              {/* Commerce Quick Links */}
              <div>
                <div className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-earthora-olive mb-2">
                  Shopping &amp; Wishlist
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/cart"
                    onClick={() => setMenuDrawerOpen(false)}
                    className="flex items-center gap-2 rounded-xl border border-earthora-sand bg-white p-2.5 text-xs font-bold text-earthora-charcoal hover:bg-earthora-sand/30"
                  >
                    <ShoppingBag className="h-4 w-4 text-earthora-forest" />
                    <span>Cart ({summary.count})</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setMenuDrawerOpen(false)}
                    className="flex items-center gap-2 rounded-xl border border-earthora-sand bg-white p-2.5 text-xs font-bold text-earthora-charcoal hover:bg-earthora-sand/30"
                  >
                    <Heart className="h-4 w-4 text-earthora-olive" />
                    <span>Saved ({wishlistItems.length})</span>
                  </Link>
                  <Link
                    to="/track-order"
                    onClick={() => setMenuDrawerOpen(false)}
                    className="col-span-2 flex items-center gap-2 rounded-xl border border-earthora-sand bg-white p-2.5 text-xs font-bold text-earthora-charcoal hover:bg-earthora-sand/30"
                  >
                    <Package className="h-4 w-4 text-earthora-muted" />
                    <span>Track Active Order</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Auth Card */}
            <div className="border-t border-earthora-sand/80 bg-earthora-beige/40 p-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-earthora-forest text-xs font-bold text-white uppercase">
                        {user?.name?.[0] || 'U'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-earthora-forest">{user?.name}</div>
                        <div className="text-[10px] font-semibold text-earthora-olive uppercase">
                          Role: {user?.role}
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Active
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={dashboardPath}
                      onClick={() => setMenuDrawerOpen(false)}
                      className="btn-primary flex-1 py-2 text-xs"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Open Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMenuDrawerOpen(false);
                      }}
                      className="rounded-xl border border-red-200 bg-white p-2 text-red-600 hover:bg-red-50 transition-colors"
                      title="Sign Out"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuDrawerOpen(false)}
                    className="btn-secondary py-2 text-xs font-bold text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuDrawerOpen(false)}
                    className="btn-primary py-2 text-xs font-bold text-center"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </>
      )}
    </header>
  );
}
