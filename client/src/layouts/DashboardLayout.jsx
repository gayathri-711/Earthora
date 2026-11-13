import { Link, useNavigate } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ title, subtitle, tabs, activeTab, onTabChange, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-agriva-cream">
      <header className="border-b border-agriva-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <img src="/assets/img/logo/black-logo.svg" alt="AGRIVA" className="h-7 w-auto" />
            </Link>
            <div className="border-l border-agriva-line pl-4">
              <h1 className="font-display text-lg font-semibold text-agriva-ink">{title}</h1>
              <p className="text-xs text-agriva-muted">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-agriva-mint/60 px-3 py-1 text-xs font-semibold text-agriva-forest sm:inline-block">
              {user?.name} ({user?.role})
            </span>
            <Link to="/" className="btn-secondary py-1.5 text-xs">
              <Home className="h-3.5 w-3.5" />
              Storefront
            </Link>
            <button type="button" onClick={handleLogout} className="btn-secondary py-1.5 text-xs text-red-700">
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? 'border-agriva-forest text-agriva-forest'
                    : 'border-transparent text-agriva-muted hover:text-agriva-ink'
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

