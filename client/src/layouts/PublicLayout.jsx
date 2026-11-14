import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { CloudSun, Home, Layers, Leaf, ShoppingBag, Sprout, Users } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useCart } from '../context/CartContext';

export default function PublicLayout() {
  const { summary } = useCart();
  const location = useLocation();

  const mobileBottomTabs = [
    { to: '/', label: 'Home', icon: Home, exact: true },
    { to: '/crop-management', label: 'Crops', icon: Leaf },
    { to: '/marketplace', label: 'Market', icon: ShoppingBag, badge: summary.count },
    { to: '/soil-insights', label: 'Soil', icon: Layers },
    { to: '/weather-intelligence', label: 'Weather', icon: CloudSun },
    { to: '/expert-connect', label: 'Experts', icon: Users },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-earthora-ivory">
      <Navbar />

      {/* Main Content with bottom padding on mobile so bottom bar doesn't overlap */}
      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>

      <Footer />

      {/* Mobile App Bottom Navigation Bar (Visible on mobile & tablet < lg screens) */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-earthora-sand/80 px-2 py-1.5 flex items-center justify-around lg:hidden shadow-elevated"
        aria-label="Mobile Bottom Navigation"
      >
        {mobileBottomTabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.exact
            ? location.pathname === tab.to
            : location.pathname.startsWith(tab.to);

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                active
                  ? 'text-earthora-forest font-black scale-105'
                  : 'text-earthora-muted hover:text-earthora-forest'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 transition-transform ${active ? 'text-earthora-mint scale-110' : ''}`} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-earthora-forest px-1 text-[9px] font-black text-white shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 leading-tight ${active ? 'font-black text-earthora-forest' : 'font-semibold'}`}>
                {tab.label}
              </span>
              {active && (
                <span className="mt-0.5 h-1 w-3 rounded-full bg-earthora-mint" />
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
