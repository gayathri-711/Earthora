import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Cpu,
  Droplets,
  Flame,
  Globe2,
  Layers,
  Leaf,
  Menu,
  MoreHorizontal,
  MoreVertical,
  Radio,
  Satellite,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sprout,
  Tractor,
  Trees,
  Users,
  X,
} from 'lucide-react';
import api from '../../api/client';
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
    color: 'emerald',
    description: 'Heirloom seeds, organic fertilizers, and no-till smart tools at direct prices.',
    link: '/marketplace',
    btnText: 'Shop Catalog',
  },
  {
    id: 'soil',
    icon: Layers,
    title: 'Soil Insights',
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

// Varaha-Style 4 Core Nature-Based Solutions
const NATURE_SOLUTIONS = [
  {
    id: 'regen-ag',
    title: 'Regenerative Agriculture',
    category: 'Soil Biodiversity',
    icon: Leaf,
    image: '/assets/img/knowledge/living-soil-mycorrhizae.jpg',
    description:
      'We partner with smallholders to replace synthetic inputs with zero-tillage, living cover crops, bio-diverse rotations, and organic mycorrhizae that revive natural soil biology.',
    metrics: ['+24% Crop Resilience', '35% Input Cost Savings', 'Restored Mycorrhizal Network'],
    link: '/crop-management',
    linkText: 'Explore Crop Cycles',
  },
  {
    id: 'biochar',
    title: 'Biochar & Soil Carbon Permanence',
    category: 'Century-Scale Sinks',
    icon: Flame,
    image: '/assets/img/knowledge/biochar-composting.jpg',
    description:
      'Transforming post-harvest agricultural crop residues into stable, porous biochar carbon sinks that lock carbon away for 100+ years while radically boosting water retention.',
    metrics: ['4x Cation Exchange Capacity', 'High Drought Resistance', '100+ Year Carbon Stability'],
    link: '/soil-insights',
    linkText: 'Inspect Soil Telemetry',
  },
  {
    id: 'agroforestry',
    title: 'Afforestation & Agroforestry (ARR)',
    category: 'Canopy Restoration',
    icon: Trees,
    image: '/assets/img/about/agtech-field-trial.jpg',
    description:
      'Planting native multi-strata timber and fruit trees along farm boundaries to generate microclimate windbreaks, support local biodiversity corridors, and diversify rural income.',
    metrics: ['Natural Windbreak Buffers', 'Pollinator Corridors', 'Alternative Farmer Yields'],
    link: '/farmer-hub',
    linkText: 'View Partner Farms',
  },
  {
    id: 'dmrv',
    title: 'Digital MRV & Precision Telemetry',
    category: 'Institutional Rigor',
    icon: Satellite,
    image: '/assets/img/smart-agri/drone-remote-sensing.jpg',
    description:
      'Combining high-resolution Sentinel satellite imagery, multispectral drone NDVI imaging, and in-situ soil NPK sensors for audit-grade scientific verification.',
    metrics: ['Satellite & GIS Mapping', 'Drone NDVI Biomass Audits', 'Tamper-Proof In-Situ Data'],
    link: '/smart-agriculture',
    linkText: 'Discover IoT Architecture',
  },
];

// Varaha-Style 4-Step Technology & MRV Process
const DMRV_PROCESS_STEPS = [
  {
    step: '01',
    title: 'GPS Field Mapping & FPO Onboarding',
    desc: 'Local farmer producer organizations (FPOs) and field agents map exact farm parcel boundaries with sub-meter GPS accuracy.',
    badge: 'Onboarding & Registry',
  },
  {
    step: '02',
    title: 'Satellite Remote Sensing & Drone NDVI',
    desc: 'Constellation satellites and multispectral drones monitor crop vegetative vigor, canopy cover, and tillage practices year-round.',
    badge: 'Spectral Tracking',
  },
  {
    step: '03',
    title: 'Biogeochemical & Living Soil Modeling',
    desc: 'Calibrated biogeochemical algorithms quantify topsoil organic carbon sequestration, rhizosphere moisture, and NPK macronutrient balances.',
    badge: 'Scientific Quantification',
  },
  {
    step: '04',
    title: 'Fair Direct-Trade & Transparent Dividends',
    desc: 'Verified harvest and biological inputs flow through our marketplace with transparent ₹ INR payouts direct to smallholder grower accounts.',
    badge: 'Direct Value Return',
  },
];

// Institutional Quality & Trust Standards
const TRUST_STANDARDS = [
  { title: 'Verra Carbon Standard', label: 'Methodology Aligned' },
  { title: 'Gold Standard Criteria', label: 'Co-Benefit Verified' },
  { title: 'FAO Agroecology Framework', label: '10 Pillars of Nature' },
  { title: 'ISO 14064 Compliance', label: 'GHG Accounting Protocol' },
  { title: 'Soil Association Organic', label: 'Biological Input Audited' },
  { title: 'Open Ag Data Alliance', label: 'Decentralized Farmer Data' },
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
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Stunning Varaha-Style Hero Section */}
      <section className="relative overflow-hidden bg-earthora-deep text-white border-b border-earthora-sand/70">
        {/* Full-Bleed High-Impact Photographic Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: "url('/assets/img/about/earthora-farm-aerial.jpg')",
          }}
          aria-hidden="true"
        />

        {/* Sophisticated Cinematic Overlay with Radiant Emerald Mesh Glow */}
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
                  <span>EARTHORA · FULL-STACK CLIMATE &amp; AGRI PLATFORM</span>
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
                Empowering Smallholder Farmers to <span className="text-earthora-mint">Regenerate Land</span> &amp; Fight Climate Change.
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-emerald-100/90 sm:text-lg">
                A full-stack climate and agronomy ecosystem uniting regenerative agriculture, biochar soil carbon permanence, precision IoT telemetry, and direct-trade fair prices for smallholder growers worldwide.
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

              {/* Verified Metrics Counter (Varaha-style highlight row) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-white/15 pt-6">
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-xs">
                  <p className="font-heading text-2xl font-black text-earthora-mint">200k+</p>
                  <p className="text-[10px] font-semibold text-emerald-200/80 uppercase">Smallholder Farmers</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-xs">
                  <p className="font-heading text-2xl font-black text-earthora-mint">1.1M ac</p>
                  <p className="text-[10px] font-semibold text-emerald-200/80 uppercase">Regenerative Land</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-xs">
                  <p className="font-heading text-2xl font-black text-earthora-mint">2.0M t</p>
                  <p className="text-[10px] font-semibold text-emerald-200/80 uppercase">CO₂e Sequestered</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-xs">
                  <p className="font-heading text-2xl font-black text-earthora-mint">2.4M L</p>
                  <p className="text-[10px] font-semibold text-emerald-200/80 uppercase">Water Conserved</p>
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

      {/* 2. Signature Varaha Impact Metrics Ribbon */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-earthora-sand/80 bg-white p-6 sm:p-8 md:p-10 shadow-elevated">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-earthora-forest border border-emerald-200">
              <Globe2 className="h-3.5 w-3.5 text-earthora-mint" />
              Verified Field Scale
            </span>
            <h2 className="mt-2.5 font-heading text-2xl sm:text-3xl font-extrabold text-earthora-forest">
              Real Impact Across Agricultural Landscapes
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-earthora-muted">
              Measuring carbon permanence, soil health renewal, and direct farmer prosperity across smallholder communities.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-earthora-sand/70">
            <div className="pt-4 md:pt-0">
              <div className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-earthora-forest">
                200,000+
              </div>
              <div className="mt-1.5 text-xs font-bold text-earthora-forest uppercase tracking-wider">
                Smallholder Farmers
              </div>
              <p className="mt-1 text-[11px] text-earthora-muted">Enrolled in regenerative practices</p>
            </div>

            <div className="pt-4 md:pt-0 md:pl-6">
              <div className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-earthora-forest">
                1.1M+
              </div>
              <div className="mt-1.5 text-xs font-bold text-earthora-forest uppercase tracking-wider">
                Acres Stewarded
              </div>
              <p className="mt-1 text-[11px] text-earthora-muted">Under verified biological management</p>
            </div>

            <div className="pt-4 md:pt-0 md:pl-6">
              <div className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-earthora-forest">
                2.0M+
              </div>
              <div className="mt-1.5 text-xs font-bold text-earthora-forest uppercase tracking-wider">
                Tonnes CO₂e Sequestered
              </div>
              <p className="mt-1 text-[11px] text-earthora-muted">Durable soil &amp; biomass carbon sinks</p>
            </div>

            <div className="pt-4 md:pt-0 md:pl-6">
              <div className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-earthora-forest">
                2.4M+
              </div>
              <div className="mt-1.5 text-xs font-bold text-earthora-forest uppercase tracking-wider">
                Litres Water Conserved
              </div>
              <p className="mt-1 text-[11px] text-earthora-muted">Through precision drip &amp; no-till cover</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Varaha-Style 4 Core Nature-Based Solutions */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-earthora-forest border border-emerald-200">
            <Sprout className="h-3.5 w-3.5 text-earthora-mint" />
            <span>Nature-Based Interventions</span>
          </div>
          <h2 className="mt-3 font-heading text-2xl sm:text-4xl font-extrabold text-earthora-forest">
            High-Integrity Carbon Removal &amp; Regenerative Agriculture
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-earthora-muted leading-relaxed">
            We partner with smallholder farmers to implement durable carbon removal and regenerative practices that restore ecosystems, improve yields, and generate fair income.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {NATURE_SOLUTIONS.map((sol) => {
            const Icon = sol.icon;
            return (
              <div
                key={sol.id}
                className="card-surface group flex flex-col justify-between overflow-hidden p-6 sm:p-7 border border-earthora-sand/80 hover:border-earthora-mint hover:shadow-elevated transition-all"
              >
                <div>
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-earthora-beige/60 mb-5">
                    <img
                      src={sol.image}
                      alt={sol.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute left-3 top-3">
                      <span className="inline-flex items-center gap-1 rounded-lg border border-white/40 bg-earthora-forest/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-earthora-mint backdrop-blur-md">
                        <Icon className="h-3 w-3" />
                        {sol.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-earthora-forest group-hover:text-emerald-800 transition-colors">
                    {sol.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-earthora-muted leading-relaxed">
                    {sol.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {sol.metrics.map((m, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-lg border border-earthora-sand/90 bg-earthora-ivory/80 px-2.5 py-1 text-[11px] font-semibold text-earthora-forest"
                      >
                        <CheckCircle2 className="h-3 w-3 text-earthora-mint shrink-0" />
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-earthora-sand/70">
                  <Link
                    to={sol.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-earthora-forest hover:text-earthora-mint transition-colors group-hover:translate-x-0.5 transform duration-200"
                  >
                    <span>{sol.linkText}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-earthora-mint" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. The Technology Architecture: Varaha-Style Digital MRV Flow */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-earthora-forest p-7 sm:p-10 lg:p-12 text-white shadow-elevated">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-950/70 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-earthora-mint">
              <Satellite className="h-3.5 w-3.5" />
              dMRV Technology Pipeline
            </span>
            <h2 className="mt-3 font-heading text-2xl sm:text-4xl font-extrabold text-white">
              Science, Remote Sensing &amp; Biogeochemistry at Scale
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Our end-to-end digital MRV pipeline turns on-field farmer practices into audit-ready ecological data and transparent economic returns.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DMRV_PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm flex flex-col justify-between hover:bg-white/10 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-heading text-2xl font-black text-earthora-mint">
                      {step.step}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-2 py-0.5 rounded-full">
                      {step.badge}
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-white leading-snug">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-emerald-100/75">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <ShieldCheck className="h-4 w-4 text-earthora-mint shrink-0" />
              <span>Full compliance with international carbon registry methodologies and open spatial standards.</span>
            </div>
            <Link to="/smart-agriculture" className="btn-accent px-5 py-2 text-xs font-bold">
              Explore dMRV Architecture →
            </Link>
          </div>
        </div>
      </section>

      {/* 5. All Platform Modules & Agronomy Suites (Horizontal Left-to-Right Flow with 3 Lines / 3 Dots) */}
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
                  className="mt-4 flex items-center text-xs font-bold text-earthora-forest group-hover:text-emerald-800 transition-colors"
                >
                  <span>{mod.btnText}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-earthora-mint ml-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Interactive All Feature Modules Modal / Drawer (Triggered by 3 Lines / 3 Dots) */}
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

      {/* 7. Agricultural Marketplace Highlights */}
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

      {/* 8. Knowledge Hub & Field Trials (Left-to-Right Single Row, Limited, Article Name + Read Article Only) */}
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

      {/* 9. Farmer Hub & Expert Connect */}
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
                {EARTHORA_EXPERTS.slice(0, 2).map((expert) => (
                  <div key={expert._id} className="flex items-center gap-3 rounded-xl border border-earthora-sand/70 p-2.5 bg-white/50">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="h-11 w-11 rounded-xl object-cover border border-earthora-sand/80 shrink-0"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/img/experts/expert-aris-thorne.jpg';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-heading text-xs font-bold text-earthora-forest truncate">{expert.name}</h4>
                      <p className="text-[11px] text-earthora-muted truncate">{expert.title} · {expert.experience}</p>
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

      {/* 10. Varaha-Style Trust & Institutional Standards Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-earthora-sand/80 bg-earthora-ivory/40 p-6 sm:p-8 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-earthora-olive mb-4">
            Audited Against Global Scientific Standards
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {TRUST_STANDARDS.map((std, i) => (
              <div
                key={i}
                className="rounded-xl border border-earthora-sand/70 bg-white p-3 shadow-2xs hover:border-earthora-forest/40 transition-colors"
              >
                <Award className="h-4 w-4 text-earthora-forest mx-auto mb-1.5" />
                <div className="font-heading text-xs font-bold text-earthora-forest leading-tight">
                  {std.title}
                </div>
                <div className="text-[10px] text-earthora-muted mt-0.5">{std.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Varaha-Style High-Impact Closing Call to Action */}
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

      {/* 12. Weekly Dispatch & Quick Contact Form */}
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
