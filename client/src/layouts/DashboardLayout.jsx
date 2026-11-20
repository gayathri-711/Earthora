import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Database,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({
  title,
  subtitle,
  tabs = [],
  activeTab,
  onTabChange,
  sidebar = false,
  sidebarGroups = null,
  headerAction = null,
  children,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    setMobileSidebarOpen(false);
  };

  // Convert flat tabs to standard groups if no explicit sidebarGroups passed
  const resolvedGroups = sidebarGroups || [
    {
      title: 'Console Navigation',
      items: tabs,
    },
  ];

  // If sidebar mode is enabled (e.g. Admin Dashboard)
  if (sidebar) {
    return (
      <div className="min-h-screen bg-earthora-ivory flex flex-col lg:flex-row antialiased">
        {/* Mobile Backdrop */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-earthora-forest/60 backdrop-blur-xs lg:hidden transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Left Panel Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-earthora-sand/80 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'
          }`}
        >
          {/* Sidebar Brand Header */}
          <div className="p-5 border-b border-earthora-sand/70 flex items-center justify-between shrink-0 bg-gradient-to-b from-white to-earthora-sand/10">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/assets/earthora/logo-icon.svg"
                alt="EARTHORA"
                className="h-10 w-10 transition-transform duration-200 group-hover:scale-105 shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-heading text-xl font-black tracking-widest text-earthora-forest leading-none">
                  EARTHORA
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[9px] font-black tracking-[0.2em] text-earthora-olive uppercase">
                    Admin Console
                  </span>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-earthora-mint animate-pulse" />
                </div>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-earthora-muted hover:bg-earthora-sand/30 hover:text-earthora-forest"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sidebar Navigation Items */}
          <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 scrollbar-thin">
            {resolvedGroups.map((group, gIdx) => (
              <div key={group.title || gIdx} className="space-y-1">
                {group.title && (
                  <div className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-earthora-olive/80">
                    {group.title}
                  </div>
                )}
                <div className="space-y-1">
                  {group.items?.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                          isActive
                            ? 'bg-earthora-forest text-white shadow-md shadow-earthora-forest/15'
                            : 'text-earthora-charcoal hover:bg-earthora-sand/35 hover:text-earthora-forest'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {Icon && (
                            <Icon
                              className={`h-4 w-4 shrink-0 transition-colors ${
                                isActive ? 'text-earthora-mint' : 'text-earthora-olive'
                              }`}
                            />
                          )}
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge !== undefined && item.badge !== null && item.badge !== '' && (
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                              isActive
                                ? 'bg-earthora-mint text-earthora-forest'
                                : item.badgeColor === 'amber'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : item.badgeColor === 'emerald'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-earthora-sand text-earthora-forest'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Footer (User info & Quick links) */}
          <div className="p-3.5 border-t border-earthora-sand/80 bg-earthora-sand/15 shrink-0 space-y-2.5">
            {/* Admin identity chip */}
            <div className="rounded-xl border border-earthora-sand/80 bg-white p-2.5 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-earthora-forest text-white font-black text-xs shrink-0">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-earthora-forest truncate leading-tight">
                    {user?.name || 'Super Admin'}
                  </p>
                  <p className="text-[10px] text-earthora-olive font-medium truncate flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    Atlas Connected
                  </p>
                </div>
              </div>
              <span className="rounded bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 text-[9px] font-black text-emerald-900 uppercase shrink-0">
                Admin
              </span>
            </div>

            {/* Quick Portal Navigation Links */}
            <div className="grid grid-cols-2 gap-1.5 text-center">
              <Link
                to="/dashboard/smart"
                className="rounded-lg border border-earthora-sand bg-white py-1.5 px-2 text-[11px] font-bold text-earthora-forest hover:bg-earthora-ivory transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-earthora-olive" />
                <span>Radar</span>
              </Link>
              <Link
                to="/marketplace"
                className="rounded-lg border border-earthora-sand bg-white py-1.5 px-2 text-[11px] font-bold text-earthora-forest hover:bg-earthora-ivory transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Store className="h-3.5 w-3.5 text-earthora-olive" />
                <span>Store</span>
              </Link>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg border border-red-200 bg-red-50/60 py-1.5 px-3 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 shadow-2xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col min-h-screen">
          {/* Top Topbar */}
          <header className="sticky top-0 z-30 border-b border-earthora-sand/80 bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-earthora-sand bg-earthora-ivory text-earthora-forest hover:bg-earthora-sand/30"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="font-heading text-lg sm:text-xl font-black text-earthora-forest tracking-tight truncate">
                    {title}
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                    <Database className="h-3 w-3 text-emerald-600" />
                    Live Cloud Sync
                  </span>
                </div>
                {subtitle && (
                  <p className="text-[11px] text-earthora-muted line-clamp-1 mt-0.5 font-medium">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {headerAction}

              <div className="hidden md:flex items-center gap-1.5 rounded-full bg-earthora-sand/30 border border-earthora-sand px-3 py-1 text-xs font-bold text-earthora-forest">
                <span className="h-2 w-2 rounded-full bg-earthora-mint animate-pulse" />
                <span>{user?.name || 'Administrator'}</span>
              </div>
            </div>
          </header>

          {/* Canvas Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>
    );
  }

  // Default Standard Header + Horizontal Tabs (for Farmer, Customer, Smart dashboards)
  return (
    <div className="min-h-screen bg-earthora-ivory">
      <header className="border-b border-earthora-sand/80 bg-white">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-3 sm:gap-5 w-full md:w-auto justify-between md:justify-start">
            {/* Brand Symbol & Name (In Left Corner) */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
              <img
                src="/assets/earthora/logo-icon.svg"
                alt="EARTHORA"
                className="h-9 w-9 sm:h-11 sm:w-11 transition-transform duration-200 group-hover:scale-105 shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-heading text-xl sm:text-2xl font-black tracking-widest text-earthora-forest leading-none">
                  EARTHORA
                </span>
                <span className="text-[9px] sm:text-[10px] font-black tracking-[0.22em] text-earthora-olive uppercase mt-0.5">
                  Agri Dashboard
                </span>
              </div>
            </Link>

            {/* Module Name & Subtitle */}
            <div className="border-l-2 border-earthora-sand/80 pl-3 sm:pl-4">
              <h1 className="font-heading text-base sm:text-xl lg:text-2xl font-black text-earthora-forest tracking-tight leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[10px] sm:text-xs font-medium text-earthora-muted line-clamp-1 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Features Covered to Right Side */}
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-end flex-wrap">
            <div className="rounded-full bg-earthora-forest/10 px-2.5 py-1 text-xs font-semibold text-earthora-forest inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-earthora-mint animate-pulse" />
              <span className="truncate max-w-[100px] sm:max-w-none">{user?.name}</span>
              <span className="rounded bg-earthora-forest px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold text-white uppercase">
                {user?.role}
              </span>
            </div>

            <Link
              to="/dashboard/smart"
              className="rounded-xl border border-earthora-sand px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-earthora-forest hover:bg-earthora-ivory transition-colors inline-flex items-center gap-1.5"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-earthora-olive" />
              <span className="hidden xs:inline">Smart Radar</span>
            </Link>

            <Link
              to="/marketplace"
              className="rounded-xl border border-earthora-sand px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-earthora-forest hover:bg-earthora-ivory transition-colors inline-flex items-center gap-1.5"
            >
              <Store className="h-3.5 w-3.5 text-earthora-olive" />
              <span className="hidden xs:inline">Marketplace</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-red-200 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors inline-flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        {tabs.length > 0 && (
          <div className="mx-auto max-w-7xl flex gap-1 sm:gap-2 overflow-x-auto scrollbar-none px-4 sm:px-6 lg:px-8 border-t border-earthora-sand/40">
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
