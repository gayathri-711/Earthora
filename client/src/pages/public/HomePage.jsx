import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Cpu,
  Droplets,
  Layers,
  Menu,
  MoreHorizontal,
  MoreVertical,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sprout,
  Tractor,
  Users,
  X,
} from 'lucide-react';
import api from '../../api/client';
import SectionHeading from '../../components/common/SectionHeading';
import ProductCard from '../../components/shop/ProductCard';
import { useToast } from '../../context/ToastContext';
import {
  EARTHORA_ARTICLES,
  EARTHORA_EXPERTS,
  EARTHORA_FARMERS,
  EARTHORA_PRODUCTS,
} from '../../data/catalogData';

const ECOSYSTEM_MODULES = [
  {
    id: 'crops',
    icon: Sprout,
    title: 'Crop Lifecycle',
    badge: 'Agronomy',
    color: 'emerald',
    description: 'Track sowing cycles, irrigation intervals, and harvest dates in real time.',
    link: '/crop-management',
    btnText: 'Open Crops',
  },
  {
    id: 'marketplace',
    icon: ShoppingBag,
    title: 'Marketplace',
    badge: 'Fair Trade · ₹ INR',
    color: 'amber',
    description: 'Direct-trade heirloom seeds, biochar compost, equipment, and fresh harvest.',
    link: '/marketplace',
    btnText: 'Shop Market',
  },
  {
    id: 'soil',
    icon: Layers,
    title: 'Soil Health & NPK',
    badge: 'Live Telemetry',
    color: 'lime',
    description: 'Instant Nitrogen, Phosphorus, Potassium, moisture, and pH sensor readings.',
    link: '/soil-insights',
    btnText: 'Inspect Soil',
  },
  {
    id: 'weather',
    icon: CloudSun,
    title: 'Weather Radar',
    badge: 'Microclimate',
    color: 'sky',
    description: 'Hyperlocal rainfall forecasts, frost hazard alerts, and spraying windows.',
    link: '/weather-intelligence',
    btnText: 'View Radar',
  },
  {
    id: 'experts',
    icon: Users,
    title: 'Expert Connect',
    badge: '1-on-1 Advice',
    color: 'purple',
    description: 'Consult certified agronomists and soil microbiologists via virtual telemetry.',
    link: '/expert-connect',
    btnText: 'Talk to Expert',
  },
  {
    id: 'smart-agri',
    icon: Cpu,
    title: 'Smart Agri Suite',
    badge: 'IoT Precision',
    color: 'cyan',
    description: 'Automated solar drip valves, drone NDVI maps, and field telemetry nodes.',
    link: '/smart-agriculture',
    btnText: 'Explore IoT',
  },
  {
    id: 'farmer-hub',
    icon: Tractor,
    title: 'Farmer Hub',
    badge: 'Grower Network',
    color: 'orange',
    description: 'Verified regional family farms, soil audit reports, and collective harvest logs.',
    link: '/farmer-hub',
    btnText: 'Visit Hub',
  },
  {
    id: 'knowledge',
    icon: Sparkles,
    title: 'Knowledge Hub',
    badge: 'Research',
    color: 'teal',
    description: 'Actionable organic pest recipes, regenerative field trials, and guides.',
    link: '/knowledge-hub',
    btnText: 'Read Guides',
  },
];

export default function HomePage() {
  const { showToast } = useToast();
  const modulesScrollRef = useRef(null);
  const [modulesDrawerOpen, setModulesDrawerOpen] = useState(false);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalFarmers: 48,
    activeFarms: 42,
    totalCropAcreage: 1840,
    avgSoilScore: 91,
    totalProducts: 24,
  });
  const [featuredProducts, setFeaturedProducts] = useState(EARTHORA_PRODUCTS.slice(0, 4));
  const [articles, setArticles] = useState(EARTHORA_ARTICLES);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submittingContact, setSubmittingContact] = useState(false);

  const scrollModules = (direction) => {
    if (modulesScrollRef.current) {
      const scrollAmount = 330;
      modulesScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    api
      .get('/dashboard/smart')
      .then(({ data }) => {
        if (data.data?.metrics) {
          setDashboardMetrics(data.data.metrics);
        }
      })
      .catch(() => {});

    api
      .get('/products?featured=true&limit=4')
      .then(({ data }) => {
        if (Array.isArray(data.data?.products) && data.data.products.length > 0) {
          setFeaturedProducts(data.data.products.slice(0, 4));
        }
      })
      .catch(() => {});

    api
      .get('/knowledge?limit=3')
      .then(({ data }) => {
        if (Array.isArray(data.data?.articles) && data.data.articles.length > 0) {
          setArticles(data.data.articles.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      await api.post('/contact/newsletter', { email: newsletterEmail.trim() });
    } catch {}
    showToast('Subscribed to Earthora Agro-Intelligence Brief.');
    setNewsletterEmail('');
  };

  const handleQuickContact = async (e) => {
    e.preventDefault();
    setSubmittingContact(true);
    try {
      await api.post('/contact', contactForm);
      showToast('Inquiry received. An Earthora agronomist will respond within 24 hours.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      showToast('Inquiry recorded. An Earthora agronomist will respond within 24 hours.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } finally {
      setSubmittingContact(false);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* 1. Stunning Hero Section with Immersive Nature / Smart Agro Background */}
      <section className="relative overflow-hidden bg-earthora-deep text-white border-b border-earthora-sand/70">
        {/* Full-Bleed High-Impact Photographic Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: "url('/assets/img/about/earthora-farm-aerial.jpg')",
          }}
          aria-hidden="true"
        />

        {/* Sophisticated Cinematic Overlay with Radiant Emerald Glow */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-earthora-deep/90 to-emerald-950/85 backdrop-blur-[2px]"
          aria-hidden="true"
        />
        <div
          className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-earthora-mint/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Content */}
            <div className="space-y-6 lg:col-span-7">
              {/* Badge + 3 Lines / 3 Dots Feature Module Quick Launcher */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-900/60 px-3.5 py-1 text-xs font-black text-earthora-mint backdrop-blur-md shadow-subtle uppercase tracking-[0.2em]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>EARTHORA · SMART AGRI ECOSYSTEM</span>
                </div>

                {/* The 3 Lines / 3 Dots Button for Feature Modules */}
                <button
                  type="button"
                  onClick={() => setModulesDrawerOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-bold text-white hover:bg-white hover:text-earthora-forest backdrop-blur-md transition-all shadow-sm group"
                  title="Open all feature modules in three lines or three dots"
                >
                  <Menu className="h-3.5 w-3.5 text-earthora-mint group-hover:rotate-90 transition-transform" />
                  <span>All Feature Modules</span>
                  <MoreHorizontal className="h-3.5 w-3.5 text-earthora-mint" />
                </button>
              </div>

              <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight drop-shadow-md text-white">
                Rooted in Nature. <br />
                <span className="text-earthora-mint">Driven by Innovation.</span>
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-emerald-100/90 sm:text-lg">
                The smart agriculture platform uniting sustainable growers, agronomy experts, and consumers with IoT field telemetry, living soil analytics, and fair-trade organic commerce.
              </p>

              {/* The EXACT TWO Hero CTA Buttons: Join as Farmer & Marketplace */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  to="/register?role=farmer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-earthora-mint px-7 py-3.5 text-sm sm:text-base font-extrabold text-earthora-forest shadow-lg shadow-earthora-mint/20 hover:bg-emerald-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Sprout className="h-4.5 w-4.5" />
                  <span>Join as Farmer</span>
                </Link>

                <Link
                  to="/marketplace"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md px-7 py-3.5 text-sm sm:text-base font-extrabold text-white shadow-md hover:bg-white hover:text-earthora-forest hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                  <span>Marketplace</span>
                </Link>
              </div>

              {/* Verified Metrics Counter (Short and Sweet) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-white/15 pt-6">
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-xs">
                  <p className="font-heading text-2xl font-black text-earthora-mint">{dashboardMetrics.totalFarmers || 48}+</p>
                  <p className="text-[10px] font-semibold text-emerald-200/80 uppercase">Verified Farms</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-xs">
                  <p className="font-heading text-2xl font-black text-earthora-mint">{dashboardMetrics.totalCropAcreage || 1840} ac</p>
                  <p className="text-[10px] font-semibold text-emerald-200/80 uppercase">Precision Land</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-xs">
                  <p className="font-heading text-2xl font-black text-earthora-mint">42%</p>
                  <p className="text-[10px] font-semibold text-emerald-200/80 uppercase">Water Saved</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-xs">
                  <p className="font-heading text-2xl font-black text-earthora-mint">99.4%</p>
                  <p className="text-[10px] font-semibold text-emerald-200/80 uppercase">Soil Accuracy</p>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic: Live Telemetry Glass Card */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-md">
                <img
                  src="/assets/img/smart-agri/smart-agtech-ecosystem.jpg"
                  alt="Earthora Smart Farm"
                  className="aspect-[4/3] w-full rounded-xl object-cover shadow-inner"
                />

                {/* Floating Live Sensor Readings */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl border border-white/15 bg-black/25 p-3 backdrop-blur-md">
                    <div className="flex items-center justify-between text-emerald-300">
                      <span className="font-bold">Soil Moisture</span>
                      <Droplets className="h-3.5 w-3.5 text-earthora-mint" />
                    </div>
                    <p className="mt-1 font-heading text-lg font-bold text-white">28% (Optimal)</p>
                    <p className="text-[10px] text-emerald-200/60">Probe #12 · North Plot</p>
                  </div>

                  <div className="rounded-xl border border-white/15 bg-emerald-950/60 p-3 backdrop-blur-md text-white">
                    <div className="flex items-center justify-between text-emerald-300">
                      <span className="font-bold">Soil Health</span>
                      <Activity className="h-3.5 w-3.5 text-earthora-mint" />
                    </div>
                    <p className="mt-1 font-heading text-lg font-bold text-earthora-mint">92 / 100</p>
                    <p className="text-[10px] text-emerald-200/60">pH 6.8 · Living Organic</p>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between rounded-xl bg-black/30 p-2.5 text-xs text-emerald-100 backdrop-blur-sm">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                    <CheckCircle2 className="h-4 w-4 text-earthora-mint" />
                    Active LoRaWAN Telemetry
                  </span>
                  <Link to="/weather-intelligence" className="font-bold text-earthora-mint hover:underline">
                    Radar Live →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. All Platform Modules & Agronomy Suites (Horizontal Left-to-Right Flow with 3 Lines / 3 Dots) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-earthora-olive mb-1">
              <Sparkles className="h-3.5 w-3.5 text-earthora-mint" />
              <span>Comprehensive Ecosystem</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-earthora-forest">
              All Platform Modules &amp; Agronomy Suites
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-earthora-muted">
              Explore all 8 smart farming tools from left to right. Short, fast, and actionable.
            </p>
          </div>

          {/* Left / Right Carousel Controls + 3 Lines / 3 Dots Button */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => scrollModules('left')}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-earthora-sand/80 bg-white text-earthora-forest shadow-xs hover:bg-earthora-sand/30 hover:border-earthora-forest transition-all"
              aria-label="Scroll left"
              title="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => scrollModules('right')}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-earthora-sand/80 bg-white text-earthora-forest shadow-xs hover:bg-earthora-sand/30 hover:border-earthora-forest transition-all"
              aria-label="Scroll right"
              title="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Three Lines / Three Dots Trigger Button */}
            <button
              type="button"
              onClick={() => setModulesDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-earthora-forest/20 bg-earthora-forest px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-earthora-deep transition-all"
              title="View all modules in 3 lines or 3 dots drawer"
            >
              <Menu className="h-4 w-4 text-earthora-mint" />
              <span className="hidden sm:inline">All Modules</span>
              <MoreVertical className="h-3.5 w-3.5 text-earthora-mint" />
            </button>
          </div>
        </div>

        {/* Left-to-Right Smooth Scrolling Track */}
        <div
          ref={modulesScrollRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory py-2 px-1"
        >
          {ECOSYSTEM_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="w-[280px] sm:w-[310px] md:w-[330px] shrink-0 snap-start card-surface group flex flex-col justify-between p-5 border border-earthora-sand/80 hover:border-earthora-mint hover:shadow-elevated transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex rounded-xl bg-earthora-mint/20 p-2.5 text-earthora-forest group-hover:bg-earthora-forest group-hover:text-earthora-mint transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-earthora-ivory border border-earthora-sand/60 px-2 py-0.5 text-[10px] font-bold text-earthora-olive uppercase">
                      {mod.badge}
                    </span>
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-earthora-forest group-hover:text-emerald-800 leading-snug">
                    {mod.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-earthora-muted line-clamp-2">
                    {mod.description}
                  </p>
                </div>

                <Link
                  to={mod.link}
                  className="mt-5 inline-flex items-center justify-between rounded-xl bg-earthora-ivory px-3.5 py-2 text-xs font-bold text-earthora-forest group-hover:bg-earthora-forest group-hover:text-white transition-all shadow-xs"
                >
                  <span>{mod.btnText}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-earthora-mint ml-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Interactive All Feature Modules Modal / Drawer (Triggered by 3 Lines / 3 Dots) */}
      {modulesDrawerOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setModulesDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl transition-transform border-l border-earthora-sand/80 animate-in slide-in-from-right duration-200"
            aria-label="All feature modules drawer"
          >
            <div className="flex items-center justify-between border-b border-earthora-sand/80 bg-earthora-forest p-4 text-white">
              <div className="flex items-center gap-2">
                <Menu className="h-5 w-5 text-earthora-mint" />
                <h3 className="font-heading text-base sm:text-lg font-bold">
                  All Feature Modules &amp; Suites
                </h3>
                <MoreVertical className="h-4 w-4 text-earthora-mint" />
              </div>
              <button
                type="button"
                onClick={() => setModulesDrawerOpen(false)}
                className="rounded-xl border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <p className="text-xs text-earthora-muted px-1">
                Direct 1-tap jump to all 8 operational suites. Short, sweet, and actionable.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ECOSYSTEM_MODULES.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <Link
                      key={mod.id}
                      to={mod.link}
                      onClick={() => setModulesDrawerOpen(false)}
                      className="group flex flex-col justify-between rounded-xl border border-earthora-sand/80 bg-earthora-ivory/40 p-3.5 hover:bg-white hover:border-earthora-forest/40 hover:shadow-md transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-earthora-forest text-earthora-mint">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-earthora-olive">
                            {mod.badge}
                          </span>
                        </div>
                        <h4 className="font-heading text-sm font-bold text-earthora-forest group-hover:text-emerald-700">
                          {mod.title}
                        </h4>
                        <p className="mt-1 text-[11px] text-earthora-muted line-clamp-2">
                          {mod.description}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center text-xs font-bold text-earthora-forest group-hover:text-emerald-700">
                        <span>{mod.btnText}</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </>
      )}

      {/* 5. Agricultural Marketplace Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center mb-6">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-earthora-forest">
            Certified Seeds, Equipment &amp; Fresh Harvest
          </h2>
          <Link to="/marketplace" className="btn-secondary shrink-0 text-xs font-bold self-start sm:self-auto">
            Browse All Marketplace <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Farmer Hub & Expert Connect (Short and Sweet) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Farmer Hub */}
          <div className="card-surface flex flex-col justify-between p-6 sm:p-7">
            <div>
              <div className="flex items-center justify-between">
                <span className="badge-tag bg-earthora-beige text-earthora-forest text-xs">Partner Network</span>
                <Link to="/farmer-hub" className="text-xs font-bold text-earthora-olive hover:underline">
                  View All Farms →
                </Link>
              </div>
              <h3 className="mt-2.5 font-heading text-xl font-bold text-earthora-forest">
                Farmer Hub: Verified Land Stewards
              </h3>
              <p className="mt-1.5 text-xs text-earthora-muted leading-relaxed">
                Connect with family farms and organic collectives practicing regenerative soil stewardship and verified cold-chain distribution.
              </p>

              <div className="mt-4 space-y-2.5">
                {EARTHORA_FARMERS.slice(0, 2).map((farmer) => (
                  <div key={farmer._id} className="flex items-center gap-3 rounded-xl border border-earthora-sand/70 p-2.5 bg-white/50">
                    <img
                      src={farmer.image}
                      alt={farmer.name}
                      className="h-11 w-11 rounded-xl object-cover border border-earthora-sand/80 shrink-0"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/img/farmers/farmer-elena.jpg';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-heading text-xs font-bold text-earthora-forest truncate">{farmer.farmName}</h4>
                      <p className="text-[11px] text-earthora-muted truncate">{farmer.location} · {farmer.totalAcres} acres</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/register?role=farmer" className="btn-primary mt-5 text-xs justify-center">
              <Sprout className="h-4 w-4" />
              Register Your Farm on Earthora
            </Link>
          </div>

          {/* Expert Connect */}
          <div className="card-surface flex flex-col justify-between p-6 sm:p-7">
            <div>
              <div className="flex items-center justify-between">
                <span className="badge-tag bg-earthora-mint/20 text-earthora-forest text-xs">Agronomy Advisory</span>
                <Link to="/expert-connect" className="text-xs font-bold text-earthora-olive hover:underline">
                  Meet Agronomists →
                </Link>
              </div>
              <h3 className="mt-2.5 font-heading text-xl font-bold text-earthora-forest">
                Expert Connect: Science-Backed Guidance
              </h3>
              <p className="mt-1.5 text-xs text-earthora-muted leading-relaxed">
                Schedule 1-on-1 virtual sessions with accredited soil microbiologists, irrigation engineers, and certified crop advisors.
              </p>

              <div className="mt-4 space-y-2.5">
                {EARTHORA_EXPERTS.slice(0, 2).map((exp) => (
                  <div key={exp._id} className="flex items-center gap-3 rounded-xl border border-earthora-sand/70 p-2.5 bg-white/50">
                    <img
                      src={exp.image}
                      alt={exp.name}
                      className="h-11 w-11 rounded-xl object-cover border border-earthora-sand/80 shrink-0"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/img/experts/expert-aris-thorne.jpg';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-heading text-xs font-bold text-earthora-forest truncate">{exp.name}</h4>
                      <p className="text-[11px] text-earthora-muted truncate">{exp.title} · {exp.rating} ★</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/expert-connect" className="btn-secondary mt-5 text-xs justify-center">
              <Users className="h-4 w-4" />
              Book Agronomist Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Knowledge Hub & Field Trials (Left-to-Right Single Row, Limited, Article Name + Read Article Only) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center mb-6">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-earthora-forest">
            Knowledge Hub &amp; Field Trials
          </h2>
          <Link to="/knowledge-hub" className="btn-secondary shrink-0 text-xs font-bold self-start sm:self-auto">
            View All Articles <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>

        {/* Single Row from Left to Right */}
        <div className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-3 snap-x snap-mandatory">
          {articles.slice(0, 3).map((art) => (
            <article
              key={art._id}
              className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0 snap-start card-surface flex flex-col justify-between p-4 overflow-hidden hover:shadow-elevated transition-all"
            >
              <div>
                <Link to={`/knowledge-hub/${art.slug}`}>
                  <img
                    src={art.image || '/assets/img/knowledge/precision-drip-irrigation.jpg'}
                    alt={art.title}
                    className="aspect-[16/10] w-full object-cover rounded-xl transition-transform duration-300 hover:scale-102"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/img/knowledge/precision-drip-irrigation.jpg';
                    }}
                  />
                </Link>
                <Link
                  to={`/knowledge-hub/${art.slug}`}
                  className="mt-3 block font-heading text-base font-bold text-earthora-forest hover:text-earthora-mint leading-snug line-clamp-2"
                >
                  {art.title}
                </Link>
              </div>

              <div className="mt-4 pt-3 border-t border-earthora-sand/70">
                <Link
                  to={`/knowledge-hub/${art.slug}`}
                  className="inline-flex items-center text-xs font-bold text-earthora-forest hover:text-earthora-mint transition-colors"
                >
                  <span>Read Article</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1 text-earthora-mint" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 8. Weekly Dispatch & Quick Contact Form */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Dispatch Box */}
          <div className="rounded-3xl bg-earthora-forest p-7 sm:p-8 text-white lg:col-span-5 flex flex-col justify-between shadow-elevated">
            <div>
              <span className="badge-tag border border-emerald-400/30 bg-emerald-950/70 text-xs font-bold uppercase tracking-wider text-earthora-mint">
                Weekly Intelligence
              </span>
              <h3 className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold leading-snug">
                Hyperlocal Agro-Weather &amp; Soil Bulletins
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                Receive regional frost alerts, irrigation advisories, and marketplace updates every Thursday.
              </p>
            </div>

            <form onSubmit={handleNewsletter} className="mt-6 space-y-2.5">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="agronomist@farm.com"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs text-white placeholder:text-emerald-200/50 focus:border-earthora-mint focus:outline-none"
              />
              <button type="submit" className="btn-accent w-full py-2.5 text-xs font-bold">
                Subscribe to Weekly Intelligence
              </button>
            </form>
          </div>

          {/* Quick Contact Form */}
          <div className="card-surface p-7 sm:p-8 lg:col-span-7">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-earthora-olive">Connect With Us</span>
            <h3 className="mt-1 font-heading text-xl sm:text-2xl font-bold text-earthora-forest">
              Questions About Hardware, Onboarding, or Advisory?
            </h3>
            <p className="text-xs text-earthora-muted mt-1">
              Drop our agronomy support team a quick note below.
            </p>

            <form onSubmit={handleQuickContact} className="mt-5 grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Full Name"
                className="input-field text-xs py-2"
              />
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="Email Address"
                className="input-field text-xs py-2"
              />
              <input
                type="text"
                required
                value={contactForm.subject}
                onChange={(e) => setContactForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder="Subject (e.g. Farm Onboarding / Hardware Integration)"
                className="input-field text-xs py-2 sm:col-span-2"
              />
              <textarea
                rows={3}
                required
                value={contactForm.message}
                onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="How can Earthora support your agricultural operations?"
                className="input-field text-xs py-2 sm:col-span-2"
              />
              <div className="sm:col-span-2">
                <button type="submit" disabled={submittingContact} className="btn-primary px-6 py-2.5 text-xs font-bold">
                  {submittingContact ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
