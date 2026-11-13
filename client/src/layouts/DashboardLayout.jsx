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
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/assets/earthora/logo-icon.svg" alt="EARTHORA" className="h-8 w-8" />
              <div className="flex flex-col">
                <span className="font-heading text-lg font-extrabold tracking-wider text-earthora-forest">
                  EARTHORA
                </span>
                <span className="text-[9px] font-bold tracking-[0.16em] text-earthora-olive uppercase">
                  Agri Dashboard
                </span>
              </div>
            </Link>

            <div className="border-l border-earthora-sand/70 pl-4 hidden sm:block">
              <h1 className="font-heading text-base font-bold text-earthora-forest">{title}</h1>
              <p className="text-[11px] text-earthora-muted">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 sm:px-6 lg:px-8 border-t border-earthora-sand/40">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all ${
                    active
                      ? 'border-earthora-forest text-earthora-forest'
                      : 'border-transparent text-earthora-muted hover:text-earthora-forest'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {tab.label}
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
