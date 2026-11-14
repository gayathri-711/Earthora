import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  CloudSun,
  Cpu,
  Heart,
  HelpCircle,
  LayoutDashboard,
  Leaf,
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

// Primary hubs shown directly on laptops & desktops
const primaryNav = [
  { to: '/', label: 'Home' },
  { to: '/crop-management', label: 'Crops' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/weather-intelligence', label: 'Weather' },
  { to: '/soil-insights', label: 'Soil' },
  { to: '/expert-connect', label: 'Experts' },
  { to: '/knowledge-hub', label: 'Knowledge' },
];

// Secondary items accessible in "More" dropdown on laptops (1024px-1440px)
const secondaryNav = [
  { to: '/smart-agriculture', label: 'Smart Agri Suite', icon: Cpu, desc: 'IoT sensors & NDVI imagery' },
  { to: '/farmer-hub', label: 'Farmer Hub', icon: Wheat, desc: 'Verified regional growers' },
  { to: '/track-order', label: 'Order Tracking', icon: Package, desc: 'Live dispatch & cold-chain' },
  { to: '/about', label: 'About Us', icon: Sprout, desc: 'Our regenerative mission' },
  { to: '/contact', label: 'Contact', icon: HelpCircle, desc: 'Talk with agronomists' },
];

// All main nav links for ultra-wide displays (2xl: 1440px+)
const allNavLinks = [
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
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const moreRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setMoreDropdownOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileOpen]);

  // Close "More" dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      {/* Top Announcement Banner (Responsive) */}
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
        {/* 1. Large Screen Navigation (2xl: 1440px+): All 11 links */}
        <nav className="hidden 2xl:flex items-center gap-1 xl:gap-1.5 flex-1 justify-end ml-4" aria-label="Desktop wide navigation">
          {allNavLinks.map((link) => (
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

        {/* 2. Laptop / Medium Screen Navigation (lg to 2xl: 1024px - 1439px): Core 7 hubs + "More" dropdown */}
        <nav className="hidden lg:flex 2xl:hidden items-center gap-1 flex-1 justify-end ml-2" aria-label="Desktop adaptive navigation">
          {primaryNav.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-2 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-earthora-forest text-white shadow-xs'
                    : 'text-earthora-charcoal/85 hover:text-earthora-forest hover:bg-earthora-sand/40'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* More Hubs Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreDropdownOpen((v) => !v)}
              className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                moreDropdownOpen || secondaryNav.some((s) => location.pathname === s.to)
                  ? 'bg-earthora-forest text-white'
                  : 'text-earthora-charcoal/85 hover:text-earthora-forest hover:bg-earthora-sand/40'
              }`}
            >
              <span>More</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {moreDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-earthora-sand/80 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-earthora-olive border-b border-earthora-sand/50 mb-1">
                  Additional Hubs &amp; Services
                </div>
                {secondaryNav.map((link) => {
                  const Icon = link.icon;
                  const active = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMoreDropdownOpen(false)}
                      className={`flex items-start gap-3 rounded-xl p-2.5 transition-colors ${
                        active ? 'bg-earthora-forest text-white' : 'hover:bg-earthora-sand/30 text-earthora-charcoal'
                      }`}
                    >
                      <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${active ? 'text-earthora-mint' : 'text-earthora-forest'}`} />
                      <div>
                        <div className="text-xs font-bold leading-none">{link.label}</div>
                        <div className={`text-[10px] mt-1 ${active ? 'text-emerald-100' : 'text-earthora-muted'}`}>
                          {link.desc}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Divider on desktop */}
        <div className="h-5 w-px bg-earthora-sand/80 hidden lg:block mx-1 shrink-0" />

        {/* Action Features (Search, Wishlist, Cart, Dashboard Pill, Hamburger) */}
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

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="relative rounded-xl border border-transparent p-2 text-earthora-charcoal transition-colors hover:border-earthora-sand hover:bg-white"
            aria-label="Wishlist"
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

          {/* Dashboard / Auth Status (Visible on sm+ screens) */}
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-1.5">
              <Link
                to={dashboardPath}
                className="inline-flex items-center gap-1.5 rounded-xl border border-earthora-forest/20 bg-earthora-forest px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-earthora-deep shadow-xs"
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
              <Link to="/login" className="btn-secondary py-1.5 px-3 text-xs font-bold">
                <User className="h-3.5 w-3.5" />
                Sign In
              </Link>
              <Link to="/register" className="btn-primary py-1.5 px-3 text-xs font-bold">
                Join
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle (Visible on < lg screens) */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-xl border border-earthora-sand bg-white p-2 text-earthora-forest lg:hidden shadow-xs hover:bg-earthora-ivory"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Live Search Drawer Overlay */}
      {searchOpen && (
        <div className="border-t border-earthora-sand bg-white px-4 py-4 shadow-md animate-in fade-in duration-200">
          <form onSubmit={handleSearchSubmit} className="mx-auto flex max-w-2xl gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-earthora-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search seeds, fertilizers, smart irrigation, equipment, produce..."
                className="w-full rounded-xl border border-earthora-sand bg-earthora-ivory/40 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-earthora-charcoal placeholder-earthora-muted focus:border-earthora-forest focus:bg-white focus:outline-none"
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary shrink-0 text-xs sm:text-sm">
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="rounded-xl border border-earthora-sand p-2.5 text-earthora-muted hover:bg-earthora-ivory"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
          <div className="mx-auto mt-2.5 flex max-w-2xl flex-wrap items-center gap-1.5 text-[11px] text-earthora-muted">
            <span className="font-semibold text-earthora-charcoal">Quick suggestions:</span>
            {['Heirloom Tomatoes', 'Organic Biochar', 'Drip Kits', 'Ancient Grain', 'NPK Sensor'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSearchQuery(s);
                  navigate(`/marketplace?search=${encodeURIComponent(s)}`);
                  setSearchOpen(false);
                }}
                className="rounded-lg bg-earthora-ivory px-2 py-0.5 text-earthora-forest hover:bg-earthora-sand/60 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modern Responsive Mobile Slide-Over Drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-earthora-forest/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Panel */}
          <aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out border-l border-earthora-sand/80 lg:hidden overflow-y-auto"
            aria-label="Mobile Navigation"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-earthora-sand/80 bg-earthora-forest p-4 text-white">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
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
                    Rooted in Nature
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Search In Drawer */}
            <div className="p-4 border-b border-earthora-sand/60 bg-earthora-ivory/50">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-earthora-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search marketplace &amp; articles..."
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

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
              {/* 1. Core Agri Hubs */}
              <div>
                <div className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-earthora-olive mb-2">
                  Agro-Intelligence Modules
                </div>
                <div className="space-y-1">
                  {[
                    { to: '/smart-agriculture', label: 'Smart Agri Suite', icon: Cpu },
                    { to: '/crop-management', label: 'Crop Lifecycle Tracking', icon: Leaf },
                    { to: '/weather-intelligence', label: 'Weather Intelligence Radar', icon: CloudSun },
                    { to: '/soil-insights', label: 'Soil Insights & NPK Telemetry', icon: Sprout },
                    { to: '/expert-connect', label: 'Expert Connect Advisory', icon: Users },
                    { to: '/knowledge-hub', label: 'Knowledge Hub & Research', icon: Sparkles },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
                            isActive
                              ? 'bg-earthora-forest text-white shadow-xs'
                              : 'text-earthora-charcoal hover:bg-earthora-sand/40 hover:text-earthora-forest'
                          }`
                        }
                      >
                        <Icon className="h-4 w-4 shrink-0 text-earthora-mint" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              {/* 2. Commerce & Community */}
              <div>
                <div className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-earthora-olive mb-2">
                  Marketplace &amp; Portals
                </div>
                <div className="space-y-1">
                  {[
                    { to: '/marketplace', label: 'Agricultural Marketplace', icon: ShoppingBag },
                    { to: '/farmer-hub', label: 'Farmer Hub & Acreage', icon: Wheat },
                    { to: '/track-order', label: 'Live Order Tracking', icon: Package },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
                            isActive
                              ? 'bg-earthora-forest text-white shadow-xs'
                              : 'text-earthora-charcoal hover:bg-earthora-sand/40 hover:text-earthora-forest'
                          }`
                        }
                      >
                        <Icon className="h-4 w-4 shrink-0 text-earthora-forest" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              {/* 3. Company & Overview */}
              <div>
                <div className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-earthora-olive mb-2">
                  Ecosystem Overview
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { to: '/', label: 'Home' },
                    { to: '/about', label: 'About' },
                    { to: '/contact', label: 'Contact' },
                  ].map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/'}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `rounded-xl p-2.5 text-center text-xs font-bold transition-colors ${
                          isActive
                            ? 'bg-earthora-forest text-white'
                            : 'border border-earthora-sand bg-white text-earthora-charcoal hover:bg-earthora-sand/30'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Auth & Portal Card */}
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
                      onClick={() => setMobileOpen(false)}
                      className="btn-primary flex-1 py-2 text-xs"
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
                    onClick={() => setMobileOpen(false)}
                    className="btn-secondary py-2 text-xs font-bold text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
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
