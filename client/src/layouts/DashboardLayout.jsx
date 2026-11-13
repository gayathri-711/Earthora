import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Sprout, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ title, subtitle, tabs = [], activeTab, onTabChange, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-earthora-ivory">
      <header className="border-b border-earthora-sand/80 bg-white">
        <div className="w-full flex flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 xl:px-10 py-3.5">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Brand Symbol & Name (In Left Corner) */}
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
                <span className="text-[10px] sm:text-[11px] font-black tracking-[0.22em] text-earthora-olive uppercase mt-1">
                  Agri Dashboard
                </span>
              </div>
            </Link>

            {/* Module Name & Subtitle */}
            <div className="border-l-2 border-earthora-sand/80 pl-4 sm:pl-5">
              <h1 className="font-heading text-lg sm:text-2xl lg:text-3xl font-black text-earthora-forest tracking-tight leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[11px] sm:text-xs font-medium text-earthora-muted line-clamp-1 sm:line-clamp-none mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Features Covered to Right Side */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <div className="hidden rounded-full bg-earthora-forest/10 px-3 py-1 text-xs font-semibold text-earthora-forest sm:inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-earthora-mint animate-pulse" />
              <span>{user?.name}</span>
              <span className="rounded bg-earthora-forest px-1.5 py-0.2 text-[10px] font-bold text-white uppercase">
                {user?.role}
              </span>
            </div>

            <Link
              to="/dashboard/smart"
              className="rounded-xl border border-earthora-sand px-3 py-1.5 text-xs font-semibold text-earthora-forest hover:bg-earthora-ivory transition-colors inline-flex items-center gap-1.5"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-earthora-olive" />
              Smart Radar
            </Link>

            <Link
              to="/marketplace"
              className="rounded-xl border border-earthora-sand px-3 py-1.5 text-xs font-semibold text-earthora-forest hover:bg-earthora-ivory transition-colors inline-flex items-center gap-1.5"
            >
              <Store className="h-3.5 w-3.5 text-earthora-olive" />
              Marketplace
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors inline-flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        {tabs.length > 0 && (
          <div className="w-full flex gap-2 overflow-x-auto px-4 sm:px-6 lg:px-8 xl:px-10 border-t border-earthora-sand/40">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-extrabold transition-all rounded-t-lg ${
                    active
                      ? 'border-earthora-forest text-earthora-forest bg-earthora-sand/30 shadow-xs'
                      : 'border-transparent text-earthora-muted hover:text-earthora-forest hover:bg-earthora-sand/15'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge !== null && tab.badge > 0 && (
                    <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
