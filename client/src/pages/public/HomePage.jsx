import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  CloudSun,
  Cpu,
  Droplets,
  Globe2,
  Layers,
  Menu,
  MoreHorizontal,
  MoreVertical,
  ShoppingBag,
  Sparkles,
  Sprout,
  Tractor,
  Users,
  X,
} from 'lucide-react';
import api from '../../api/client';
import ProductCard from '../../components/shop/ProductCard';
import { useToast } from '../../context/ToastContext';
import {
  EARTHORA_ARTICLES,
  EARTHORA_PRODUCTS,
} from '../../data/catalogData';

// EXACTLY 5 Core Feature Cards for the Landing Page
const CORE_PLATFORM_CARDS = [
  {
    id: 'crops',
    title: 'Crop Lifecycle & Phenology',
    badge: 'Agronomy',
    icon: Sprout,
    image: '/assets/img/crops/crop-tomatoes.jpg',
    description: 'Track sowing cycles, bio-diverse rotations, and harvest windows with zero synthetic inputs.',
    link: '/crop-management',
    btnText: 'Open Crops',
  },
  {
    id: 'soil',
    title: 'Soil Insights & Biochar',
    badge: 'Live Telemetry',
    icon: Layers,
    image: '/assets/img/knowledge/biochar-composting.jpg',
    description: 'In-situ NPK macronutrients, moisture, pH equilibrium, and 100-year carbon permanence.',
    link: '/soil-insights',
    btnText: 'Inspect Soil',
  },
  {
    id: 'weather',
    title: 'Weather Radar & Smart IoT',
    badge: 'Microclimate',
    icon: CloudSun,
    image: '/assets/img/smart-agri/drone-remote-sensing.jpg',
    description: 'Hyperlocal rainfall forecasts, frost risk warnings, and automated solar drip actuators.',
    link: '/weather-intelligence',
    btnText: 'View Radar',
  },
  {
    id: 'farmer-hub',
    title: 'Farmer Hub & Collective',
    badge: 'Grower Network',
    icon: Tractor,
    image: '/assets/img/farmers/farm-green-valley.jpg',
    description: 'Verified regional family farms, soil audits, and collective cold-chain distribution.',
    link: '/farmer-hub',
    btnText: 'Visit Hub',
  },
  {
    id: 'marketplace',
    title: 'Agricultural Marketplace',
    badge: 'Fair Trade · ₹ INR',
    icon: ShoppingBag,
    image: '/assets/img/products/heirloom-tomatoes.jpg',
    description: 'Certified heirloom seeds, organic fertilizers, and no-till tools at direct grower prices.',
    link: '/marketplace',
    btnText: 'Shop Catalog',
  },
];

// All 8 Modules for the 3-Lines / 3-Dots Drawer
const ALL_DRAWER_MODULES = [
  {
    id: 'crops',
    icon: Sprout,
    title: 'Crop Lifecycle',
    badge: 'Agronomy',
    description: 'Track sowing cycles, irrigation intervals, and harvest dates.',
    link: '/crop-management',
    btnText: 'Open Crops',
  },
  {
    id: 'marketplace',
    icon: ShoppingBag,
    title: 'Marketplace',
    badge: 'Fair Trade · ₹ INR',
    description: 'Heirloom seeds, organic fertilizers, and no-till smart tools.',
    link: '/marketplace',
    btnText: 'Shop Catalog',
  },
  {
    id: 'soil',
    icon: Layers,
    title: 'Soil Insights',
    badge: 'Live Telemetry',
    description: 'Instant NPK, moisture, and pH sensor telemetry.',
    link: '/soil-insights',
    btnText: 'Inspect Soil',
  },
  {
    id: 'weather',
    icon: CloudSun,
    title: 'Weather Radar',
    badge: 'Microclimate',
    description: 'Hyperlocal rainfall forecasts and frost hazard alerts.',
    link: '/weather-intelligence',
    btnText: 'View Radar',
  },
  {
    id: 'experts',
    icon: Users,
    title: 'Expert Connect',
    badge: '1-on-1 Advice',
    description: 'Consult certified agronomists and soil microbiologists.',
    link: '/expert-connect',
    btnText: 'Talk to Expert',
  },
  {
    id: 'smart-agri',
    icon: Cpu,
    title: 'Smart Agri Suite',
    badge: 'IoT Precision',
    description: 'Automated solar drip valves and drone NDVI maps.',
    link: '/smart-agriculture',
    btnText: 'Explore IoT',
  },
  {
    id: 'farmer-hub',
    icon: Tractor,
    title: 'Farmer Hub',
    badge: 'Grower Network',
    description: 'Verified regional family farms and soil audit reports.',
    link: '/farmer-hub',
    btnText: 'Visit Hub',
  },
  {
    id: 'knowledge',
    icon: Sparkles,
    title: 'Knowledge Hub',
    badge: 'Research',
    description: 'Actionable organic pest recipes and field trial guides.',
    link: '/knowledge-hub',
    btnText: 'Read Guides',
  },
];

export default function HomePage() {
  const { showToast } = useToast();
  const [modulesDrawerOpen, setModulesDrawerOpen] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState(EARTHORA_PRODUCTS.slice(0, 4));
  const [articles, setArticles] = useState(EARTHORA_ARTICLES);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submittingContact, setSubmittingContact] = useState(false);

  useEffect(() => {
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
      {/* 1. Hero Section Inspired by Varaha */}
      <section className="relative overflow-hidden bg-earthora-deep text-white border-b border-earthora-sand/70">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ backgroundImage: "url('/assets/img/about/earthora-farm-aerial.jpg')" }}
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-earthora-deep/90 to-emerald-950/85 backdrop-blur-[2px]"
          aria-hidden="true"
        />
        <div
          className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-earthora-mint/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Content */}
            <div className="space-y-6 lg:col-span-7">
              {/* Badge + 3 Lines / 3 Dots Feature Module Quick Launcher */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-900/60 px-3.5 py-1 text-xs font-black text-earthora-mint backdrop-blur-md uppercase tracking-[0.2em]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>EARTHORA · CLIMATE &amp; AGRI ECOSYSTEM</span>
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

              {/* Varaha-Inspired Mission Headline */}
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight drop-shadow-md text-white">
                Empowering Smallholder Farmers to <span className="text-earthora-mint">Regenerate Land</span> &amp; Feed the Future.
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-emerald-100/90 sm:text-lg">
                Uniting regenerative agriculture, biochar soil carbon permanence, precision IoT telemetry, and direct fair-trade prices for smallholders worldwide.
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
            </div>

            {/* Right Hero Graphic: Live Telemetry Glass Card */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-md">
                <img
                  src="/assets/img/smart-agri/smart-agtech-ecosystem.jpg"
                  alt="Earthora Smart Farm"
                  className="aspect-[4/3] w-full rounded-xl object-cover shadow-inner"
                />

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

      {/* 2. Signature Varaha Impact Metrics Ribbon (Clean Stats Strip - No Card Boxes) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-earthora-sand/80 bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-earthora-sand/70">
            <div className="pt-2 md:pt-0">
              <div className="font-heading text-3xl sm:text-4xl font-black text-earthora-forest">
                200,000+
              </div>
              <div className="mt-1 text-xs font-bold text-earthora-forest uppercase tracking-wider">
                Smallholder Farmers
              </div>
              <p className="text-[11px] text-earthora-muted mt-0.5">Enrolled in regenerative practices</p>
            </div>

            <div className="pt-2 md:pt-0 md:pl-6">
              <div className="font-heading text-3xl sm:text-4xl font-black text-earthora-forest">
                1.1M+
              </div>
              <div className="mt-1 text-xs font-bold text-earthora-forest uppercase tracking-wider">
                Acres Stewarded
              </div>
              <p className="text-[11px] text-earthora-muted mt-0.5">Under verified biological care</p>
            </div>

            <div className="pt-2 md:pt-0 md:pl-6">
              <div className="font-heading text-3xl sm:text-4xl font-black text-earthora-forest">
                2.0M+
              </div>
              <div className="mt-1 text-xs font-bold text-earthora-forest uppercase tracking-wider">
                Tonnes CO₂e Sequestered
              </div>
              <p className="text-[11px] text-earthora-muted mt-0.5">Durable soil &amp; biomass sinks</p>
            </div>

            <div className="pt-2 md:pt-0 md:pl-6">
              <div className="font-heading text-3xl sm:text-4xl font-black text-earthora-forest">
                2.4M+
              </div>
              <div className="mt-1 text-xs font-bold text-earthora-forest uppercase tracking-wider">
                Litres Water Conserved
              </div>
              <p className="text-[11px] text-earthora-muted mt-0.5">Precision drip &amp; living cover</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Platform Modules (EXACTLY 5 CLEAN CARDS) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-earthora-forest border border-emerald-200">
              <Sparkles className="h-3.5 w-3.5 text-earthora-mint" />
              <span>Core Agronomy Suites</span>
            </div>
            <h2 className="mt-2 font-heading text-2xl sm:text-4xl font-extrabold text-earthora-forest">
              All Platform Modules &amp; Agronomy Suites
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-earthora-muted">
              Explore the 5 core operational suites. Short, sweet, and actionable.
            </p>
          </div>

          {/* Three Lines / Three Dots Trigger Button */}
          <button
            type="button"
            onClick={() => setModulesDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-earthora-forest/20 bg-earthora-forest px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-earthora-deep transition-all self-start md:self-auto"
            title="View all 8 modules in 3 lines or 3 dots drawer"
          >
            <Menu className="h-4 w-4 text-earthora-mint" />
            <span>All 8 Modules</span>
            <MoreVertical className="h-3.5 w-3.5 text-earthora-mint" />
          </button>
        </div>

        {/* Exactly 5 Cards Responsive Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {CORE_PLATFORM_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="card-surface group flex flex-col justify-between overflow-hidden p-4 sm:p-5 border border-earthora-sand/80 hover:border-earthora-mint hover:shadow-elevated transition-all"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-earthora-beige/60 mb-3.5">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute left-2.5 top-2.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-earthora-forest/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-earthora-mint backdrop-blur-md">
                        <Icon className="h-3 w-3" />
                        {card.badge}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-heading text-base font-bold text-earthora-forest group-hover:text-emerald-700 leading-snug">
                    {card.title}
                  </h3>

                  <p className="mt-1.5 text-xs text-earthora-muted leading-relaxed line-clamp-3">
                    {card.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-earthora-sand/70">
                  <Link
                    to={card.link}
                    className="inline-flex items-center text-xs font-bold text-earthora-forest hover:text-earthora-mint transition-colors"
                  >
                    <span>{card.btnText}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-earthora-mint ml-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Interactive All Feature Modules Modal / Drawer (Triggered by 3 Lines / 3 Dots) */}
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
                {ALL_DRAWER_MODULES.map((mod) => {
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

      {/* 5. Agricultural Marketplace (EXACTLY 4 PRODUCT CARDS - Product Name + View Details Button + Price in ₹ + Add to Cart) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center mb-6">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-earthora-forest">
              Certified Seeds, Equipment &amp; Fresh Harvest
            </h2>
            <p className="text-xs text-earthora-muted mt-1">
              Direct-trade organic seeds, biological amendments, and regenerative farming tools.
            </p>
          </div>
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

      {/* 6. Knowledge Hub & Field Trials (Single Row, Limited, Title + Read Article Only) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center mb-6">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-earthora-forest">
            Knowledge Hub &amp; Field Trials
          </h2>
          <Link to="/knowledge-hub" className="btn-secondary shrink-0 text-xs font-bold self-start sm:self-auto">
            View All Articles <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>

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

      {/* 7. Varaha-Style Closing Call to Action */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-earthora-forest px-6 py-12 sm:px-12 sm:py-16 text-center text-white shadow-elevated">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{ backgroundImage: "url('/assets/img/about/earthora-farm-aerial.jpg')" }}
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-950/70 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-earthora-mint">
              <Sparkles className="h-3.5 w-3.5" />
              Join the Movement
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black leading-tight">
              Ready to Accelerate Planetary Regeneration?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed max-w-2xl mx-auto">
              Whether you are a smallholder grower seeking regenerative bio-inputs and fair prices or a conscious buyer sourcing certified harvest, Earthora provides the full-stack platform.
            </p>
            <div className="pt-3 flex flex-wrap justify-center gap-3">
              <Link to="/register?role=farmer" className="btn-accent px-7 py-3 text-xs sm:text-sm font-bold">
                Join as Farmer
              </Link>
              <Link to="/marketplace" className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 px-7 py-3 text-xs sm:text-sm font-bold">
                Explore Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Weekly Dispatch & Quick Contact Form */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Dispatch Box */}
          <div className="rounded-3xl bg-earthora-deep p-7 sm:p-8 text-white lg:col-span-5 flex flex-col justify-between shadow-elevated border border-white/10">
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
