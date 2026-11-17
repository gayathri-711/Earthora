import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  CloudSun,
  Cpu,
  Heart,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MoreHorizontal,
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

// Desktop & Ribbon links
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

// Clean vertical category & module items styled exactly like user's second photo
const DRAWER_CATEGORIES = [
  {
    id: 'home',
    label: 'Home',
    to: '/',
  },
  {
    id: 'marketplace',
    label: 'Agricultural Marketplace',
    to: '/marketplace',
    subItems: [
      { label: 'All Marketplace Products', to: '/marketplace' },
      { label: 'Seeds & Seedlings', to: '/marketplace?category=seeds' },
      { label: 'Organic Fertilizers', to: '/marketplace?category=fertilizers' },
      { label: 'Farming Equipment', to: '/marketplace?category=equipment' },
      { label: 'Smart Irrigation Systems', to: '/marketplace?category=irrigation' },
      { label: 'Fresh Harvest Produce', to: '/marketplace?category=produce' },
    ],
  },
  {
    id: 'smart-agri',
    label: 'Smart Agriculture',
    to: '/smart-agriculture',
    subItems: [
      { label: 'Precision IoT Suite', to: '/smart-agriculture' },
      { label: 'LoRaWAN Soil Probes', to: '/smart-agriculture' },
      { label: 'Automated Solar Drip Valves', to: '/smart-agriculture' },
      { label: 'Drone Multispectral NDVI', to: '/smart-agriculture' },
    ],
  },
  {
    id: 'crops',
    label: 'Crop Management',
    to: '/crop-management',
    subItems: [
      { label: 'Active Crop Phenology', to: '/crop-management' },
      { label: 'Sowing & Growth Cycles', to: '/crop-management' },
      { label: 'Harvest Planning & Yield Logs', to: '/crop-management' },
    ],
  },
  {
    id: 'soil',
    label: 'Soil Insights',
    to: '/soil-insights',
    subItems: [
      { label: 'Rhizosphere NPK Telemetry', to: '/soil-insights' },
      { label: 'pH & Soil Carbon Equilibrium', to: '/soil-insights' },
      { label: 'Biochar Soil Amendment', to: '/soil-insights' },
    ],
  },
  {
    id: 'weather',
    label: 'Weather Intelligence',
    to: '/weather-intelligence',
    subItems: [
      { label: 'Hyperlocal Weather Radar', to: '/weather-intelligence' },
      { label: 'Spraying Windows & Frost Hazards', to: '/weather-intelligence' },
      { label: 'Microclimate Advisories', to: '/weather-intelligence' },
    ],
  },
  {
    id: 'farmer-hub',
    label: 'Farmer Hub',
    to: '/farmer-hub',
    subItems: [
      { label: 'Regional Partner Farms', to: '/farmer-hub' },
      { label: 'Register Your Farm on Earthora', to: '/register?role=farmer' },
      { label: 'Soil Stewardship Collective', to: '/farmer-hub' },
    ],
  },
  {
    id: 'experts',
    label: 'Expert Connect',
    to: '/expert-connect',
    subItems: [
      { label: 'Meet Agronomists & Scientists', to: '/expert-connect' },
      { label: 'Book 1-on-1 Virtual Advisory', to: '/expert-connect' },
      { label: 'Community Agro Q&A Forum', to: '/expert-connect' },
    ],
  },
  {
    id: 'knowledge',
    label: 'Knowledge Hub',
    to: '/knowledge-hub',
    subItems: [
      { label: 'Regenerative Field Guides', to: '/knowledge-hub' },
      { label: 'Biochar Preparation Whitepapers', to: '/knowledge-hub' },
      { label: 'Organic Pest Recipes', to: '/knowledge-hub' },
    ],
  },
  {
    id: 'about',
    label: 'About Earthora',
    to: '/about',
    subItems: [
      { label: 'The Earthora Standard', to: '/about' },
      { label: '4 Scientific Pillars', to: '/about' },
      { label: 'Global Sustainability Goals', to: '/about' },
    ],
  },
  {
    id: 'contact',
    label: 'Contact Us',
    to: '/contact',
  },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { summary } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState('marketplace');
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

        {/* Action Features (Search, Wishlist, Cart, Sign In, All Feature Modules Pill Button) */}
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

          {/* ALL FEATURE MODULES PILL BUTTON NEAR SIGN IN (Three Dashes & Three Dots) */}
          <button
            type="button"
            onClick={() => setMenuDrawerOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-earthora-forest/20 bg-earthora-forest px-3 sm:px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-earthora-deep hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 ml-1 sm:ml-1.5 group"
            aria-label="Open all feature modules"
            aria-expanded={menuDrawerOpen}
            title="Open all feature modules"
          >
            {menuDrawerOpen ? (
              <X className="h-3.5 w-3.5 text-earthora-mint" />
            ) : (
              <Menu className="h-3.5 w-3.5 text-earthora-mint group-hover:rotate-90 transition-transform" />
            )}
            <span className="hidden sm:inline">All Feature Modules</span>
            <span className="sm:hidden">Modules</span>
            <MoreHorizontal className="h-3.5 w-3.5 text-earthora-mint" />
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

      {/* SLIDE-OVER DRAWER STYLED EXACTLY LIKE SECOND PHOTO */}
      {menuDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMenuDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Panel (Exact match to second uploaded photo) */}
          <aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[320px] sm:max-w-[350px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out border-l border-gray-100 overflow-y-auto"
            aria-label="Category Navigation Drawer"
          >
            {/* Header: Exact "Category" with divider line & close button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight font-heading">
                Category
              </h2>
              <button
                type="button"
                onClick={() => setMenuDrawerOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu Items List (Vertical list with chevron right and expandable green active state) */}
            <div className="flex-1 overflow-y-auto py-2">
              {DRAWER_CATEGORIES.map((cat) => {
                const isOpen = openCategory === cat.id;
                const hasSubs = cat.subItems && cat.subItems.length > 0;

                return (
                  <div key={cat.id} className="border-b border-gray-100/70 last:border-b-0">
                    {hasSubs ? (
                      <div>
                        {/* Parent Row with Chevron Toggle */}
                        <button
                          type="button"
                          onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                          className={`w-full flex items-center justify-between px-6 py-3.5 text-left transition-colors group ${
                            isOpen ? 'text-emerald-600 font-bold' : 'text-gray-900 hover:text-emerald-600 font-semibold'
                          }`}
                        >
                          <span className="text-sm sm:text-base leading-snug">{cat.label}</span>
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4 text-emerald-600 shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 shrink-0" />
                          )}
                        </button>

                        {/* Indented Sub-Items with Left Green Border Line (Exact match to second photo) */}
                        {isOpen && (
                          <div className="ml-6 border-l-2 border-emerald-500 pl-4 py-1.5 space-y-2 mb-2">
                            {cat.subItems.map((sub, idx) => (
                              <Link
                                key={idx}
                                to={sub.to}
                                onClick={() => setMenuDrawerOpen(false)}
                                className="block text-xs sm:text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors py-0.5"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Direct Link Item */
                      <Link
                        to={cat.to}
                        onClick={() => setMenuDrawerOpen(false)}
                        className="flex items-center justify-between px-6 py-3.5 text-sm sm:text-base font-semibold text-gray-900 hover:text-emerald-600 transition-colors group"
                      >
                        <span>{cat.label}</span>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 shrink-0" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Links at the bottom */}
            <div className="border-t border-gray-100 bg-gray-50/70 p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                <Link
                  to="/cart"
                  onClick={() => setMenuDrawerOpen(false)}
                  className="hover:text-emerald-600 flex items-center gap-1.5"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Cart ({summary.count})</span>
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMenuDrawerOpen(false)}
                  className="hover:text-emerald-600 flex items-center gap-1.5"
                >
                  <Heart className="h-4 w-4" />
                  <span>Wishlist ({wishlistItems.length})</span>
                </Link>
              </div>

              {isAuthenticated ? (
                <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                  <span className="text-xs font-bold text-gray-800 truncate">{user?.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuDrawerOpen(false);
                    }}
                    className="text-xs text-red-600 font-bold hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuDrawerOpen(false)}
                  className="block w-full text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </aside>
        </>
      )}
    </header>
  );
}
