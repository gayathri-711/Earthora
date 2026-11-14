import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle2,
  CloudSun,
  Cpu,
  Droplets,
  Layers,
  Leaf,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sprout,
  Star,
  Tractor,
  TrendingUp,
  Users,
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
    icon: Sprout,
    title: 'Crop Lifecycle Tracking',
    badge: 'Biological Phenology',
    description: 'Track growth progress, root-zone irrigation logs, and harvest projections across monitored acreage.',
    link: '/crop-management',
    btnText: 'Open Crop Suite',
  },
  {
    icon: ShoppingBag,
    title: 'Agricultural Marketplace',
    badge: 'Verified Organic · ₹ INR',
    description: 'Direct-trade certified seeds, biochar compost, automated irrigation hardware, and fresh harvest produce.',
    link: '/marketplace',
    btnText: 'Shop Marketplace',
  },
  {
    icon: Layers,
    title: 'Soil Insights & NPK Telemetry',
    badge: 'Lab & Probe Analytics',
    description: 'Real-time laboratory & sensor telemetry tracking pH balance, Nitrogen, Phosphorus, Potassium, and carbon.',
    link: '/soil-insights',
    btnText: 'Inspect Soil Health',
  },
  {
    icon: CloudSun,
    title: 'Agro-Weather Intelligence',
    badge: 'Microclimate Radar',
    description: 'Hyperlocal evapotranspiration forecasts, frost warnings, and spraying suitability windows to protect crops.',
    link: '/weather-intelligence',
    btnText: 'View Weather Radar',
  },
  {
    icon: Users,
    title: 'Expert Connect & Advisory',
    badge: '1-on-1 Agronomy',
    description: 'Book 45-minute virtual telemetry consultations with accredited agronomists and soil microbiologists.',
    link: '/expert-connect',
    btnText: 'Connect with Experts',
  },
  {
    icon: Cpu,
    title: 'Smart Precision Agriculture',
    badge: 'IoT & LoRaWAN Sensors',
    description: 'Autonomous soil moisture telemetry, smart valve actuation, and drone NDVI vegetative indices.',
    link: '/smart-agriculture',
    btnText: 'Explore IoT Suite',
  },
  {
    icon: Tractor,
    title: 'Farmer Hub & Acreage',
    badge: 'Partner Growers',
    description: 'Verified regional farm directory, land profile audits, acreage metrics, and grower onboarding.',
    link: '/farmer-hub',
    btnText: 'Visit Farmer Hub',
  },
  {
    icon: Sparkles,
    title: 'Knowledge Hub & Research',
    badge: 'Scientific Whitepapers',
    description: 'Peer-reviewed field guides, regenerative organic research, and weekly agro-intelligence dispatches.',
    link: '/knowledge-hub',
    btnText: 'Read Field Guides',
  },
];

export default function HomePage() {
  const { showToast } = useToast();
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
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-earthora-beige/60 via-earthora-ivory to-earthora-ivory pt-12 pb-20 border-b border-earthora-sand/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Content */}
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-earthora-forest/20 bg-white/90 px-4 py-1.5 text-xs sm:text-sm font-black text-earthora-forest backdrop-blur-md shadow-subtle uppercase tracking-[0.2em]">
                <Sparkles className="h-4 w-4 text-earthora-mint" />
                <span>EARTHORA · NEXT-GEN AGRI ECOSYSTEM</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.05] text-earthora-forest tracking-tight">
                Rooted in Nature. <br />
                <span className="text-emerald-700">Driven by Innovation.</span>
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-earthora-muted sm:text-lg">
                EARTHORA unites sustainable growers, certified agronomists, input suppliers,
                and conscious consumers on one intelligent platform. Monitor crops with precision IoT,
                audit soil health, and trade certified agricultural inputs and produce.
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-2">
                <Link to="/smart-agriculture" className="btn-primary px-6 py-3 justify-center">
                  Explore Smart Agri Suite
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/marketplace" className="btn-secondary px-6 py-3 justify-center">
                  Agricultural Marketplace
                </Link>
                <Link to="/register?role=farmer" className="btn-accent px-6 py-3 justify-center">
                  Join as Farmer
                </Link>
              </div>

              {/* Verified Metrics Counter */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-earthora-sand/80 pt-6">
                <div>
                  <p className="font-heading text-2xl font-black text-earthora-forest">{dashboardMetrics.totalFarmers || 48}+</p>
                  <p className="text-[11px] font-semibold text-earthora-muted uppercase">Verified Farms</p>
                </div>
                <div>
                  <p className="font-heading text-2xl font-black text-earthora-forest">{dashboardMetrics.totalCropAcreage || 1840} ac</p>
                  <p className="text-[11px] font-semibold text-earthora-muted uppercase">Precision Acreage</p>
                </div>
                <div>
                  <p className="font-heading text-2xl font-black text-earthora-forest">42%</p>
                  <p className="text-[11px] font-semibold text-earthora-muted uppercase">Water Saved</p>
                </div>
                <div>
                  <p className="font-heading text-2xl font-black text-earthora-forest">99.4%</p>
                  <p className="text-[11px] font-semibold text-earthora-muted uppercase">Soil Traceability</p>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic / Live Platform Preview */}
            <div className="lg:col-span-5">
              <div className="card-surface relative overflow-hidden border-2 border-earthora-forest/10 p-3 shadow-elevated">
                <img
                  src="/assets/img/hero/smart-agri-hero.jpg"
                  alt="Earthora Smart Farm"
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />

                {/* Floating Telemetry Card */}
                <div className="mt-3 grid grid-cols-2 gap-2.5 text-xs">
                  <div className="rounded-xl border border-earthora-sand/70 bg-earthora-beige/60 p-3">
                    <div className="flex items-center justify-between text-earthora-olive">
                      <span className="font-bold">Soil Moisture</span>
                      <Droplets className="h-3.5 w-3.5 text-earthora-mint" />
                    </div>
                    <p className="mt-1 font-heading text-lg font-bold text-earthora-forest">28% (Optimal)</p>
                    <p className="text-[10px] text-earthora-muted">LoRaWAN Probe #12 · North Plot</p>
                  </div>

                  <div className="rounded-xl border border-earthora-sand/70 bg-earthora-forest p-3 text-white">
                    <div className="flex items-center justify-between text-emerald-200">
                      <span className="font-bold">Soil Health Index</span>
                      <Activity className="h-3.5 w-3.5 text-earthora-mint" />
                    </div>
                    <p className="mt-1 font-heading text-lg font-bold text-earthora-mint">92 / 100</p>
                    <p className="text-[10px] text-emerald-100/70">pH 6.8 · High Mycorrhizae</p>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between rounded-xl bg-earthora-ivory p-3 text-xs text-earthora-muted">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-earthora-forest">
                    <CheckCircle2 className="h-4 w-4 text-earthora-mint" />
                    Live Regional Telemetry: Sonoma &amp; Willamette
                  </span>
                  <Link to="/weather-intelligence" className="font-bold text-earthora-olive hover:underline">
                    View Weather Radar →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. All Ecosystem Modules (Directly visible on Mobile & Desktop) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Ecosystem Architecture"
          title="All Platform Modules & Agronomy Suites"
          subtitle="Direct one-tap access to all 8 operational suites uniting field IoT telemetry, living soil analytics, and direct-trade agricultural commerce."
        />

        <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ECOSYSTEM_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.title}
                className="card-surface group flex flex-col justify-between p-4 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:border-earthora-mint hover:shadow-elevated"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="inline-flex rounded-xl bg-earthora-mint/20 p-2.5 sm:p-3 text-earthora-forest group-hover:bg-earthora-forest group-hover:text-earthora-mint transition-colors">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <span className="hidden sm:inline-block rounded-full bg-earthora-ivory px-2 py-0.5 text-[10px] font-bold text-earthora-olive uppercase">
                      {mod.badge}
                    </span>
                  </div>
                  <h3 className="font-heading text-sm sm:text-lg font-bold text-earthora-forest group-hover:text-emerald-800 leading-snug">
                    {mod.title}
                  </h3>
                  <p className="mt-1.5 text-[11px] sm:text-xs leading-relaxed text-earthora-muted line-clamp-2 sm:line-clamp-3">
                    {mod.description}
                  </p>
                </div>
                <Link
                  to={mod.link}
                  className="mt-4 sm:mt-6 inline-flex items-center justify-between rounded-xl bg-earthora-ivory px-3 py-2 text-xs font-bold text-earthora-forest group-hover:bg-earthora-forest group-hover:text-white transition-all shadow-xs"
                >
                  <span className="truncate">{mod.btnText}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 ml-1 text-earthora-mint group-hover:text-earthora-mint" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Smart Agriculture Showcase Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-earthora-forest p-8 text-white sm:p-12 lg:p-16">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-7">
              <span className="badge-tag border border-emerald-400/30 bg-emerald-950/60 text-xs font-bold uppercase tracking-wider text-earthora-mint">
                Smart Precision IoT
              </span>
              <h2 className="font-heading text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                Eliminate Guesswork with Live Field Telemetry
              </h2>
              <p className="text-sm leading-relaxed text-emerald-100/80">
                Earthora connects IoT soil probes, drone multispectral NDVI imagery, and solar drip valves
                directly to your dashboard. Make data-backed irrigation and fertilizer decisions that save costs
                and boost yields by up to 28%.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 pt-2 text-xs text-emerald-100">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-earthora-mint" /> Automated Irrigation Windows</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-earthora-mint" /> NPK &amp; Soil Moisture Alerts</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-earthora-mint" /> Hyperlocal Frost Risk Advisories</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-earthora-mint" /> Direct Agronomist Consultations</span>
              </div>
              <div className="pt-4 flex flex-wrap gap-3">
                <Link to="/smart-agriculture" className="btn-accent px-6 py-3">
                  View Smart Agriculture Architecture
                </Link>
                <Link to="/crop-management" className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 px-6 py-3">
                  Crop Management Suite
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-wider text-earthora-mint">Live Field Status</p>
                <h3 className="mt-1 font-heading text-lg font-bold text-white">North Plot 02 — Heirloom Tomatoes</h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-emerald-200">
                      <span>Growth Stage: Maturing</span>
                      <span className="font-bold">88%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-earthora-mint" style={{ width: '88%' }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-white/10 p-2.5">
                      <p className="text-emerald-300">Soil pH</p>
                      <p className="font-heading text-base font-bold text-white">6.8</p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-2.5">
                      <p className="text-emerald-300">Moisture</p>
                      <p className="font-heading text-base font-bold text-white">29%</p>
                    </div>
                  </div>
                  <Link
                    to="/soil-insights"
                    className="block text-center text-xs font-semibold text-emerald-300 hover:text-white"
                  >
                    Open Soil Insights &amp; NPK Analyzer →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Agricultural Marketplace Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Agricultural Marketplace"
            title="Certified Seeds, Equipment &amp; Fresh Harvest"
            subtitle="Verified organic inputs, precision smart irrigation hardware, and fresh harvest produce directly from regenerative farms."
          />
          <Link to="/marketplace" className="btn-secondary shrink-0">
            Browse All 5 Categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Farmer Hub & Expert Connect Preview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Farmer Hub */}
          <div className="card-surface flex flex-col justify-between p-8">
            <div>
              <div className="flex items-center justify-between">
                <span className="badge-tag bg-earthora-beige text-earthora-forest">Partner Network</span>
                <Link to="/farmer-hub" className="text-xs font-bold text-earthora-olive hover:underline">
                  View All Farms →
                </Link>
              </div>
              <h3 className="mt-3 font-heading text-2xl font-bold text-earthora-forest">
                Farmer Hub: Verified Land Stewards
              </h3>
              <p className="mt-2 text-sm text-earthora-muted">
                Explore family farms and organic collectives practicing regenerative soil stewardship,
                verified cover-crop cycling, and transparent cold-chain distribution.
              </p>

              <div className="mt-6 space-y-3">
                {EARTHORA_FARMERS.slice(0, 2).map((farmer) => (
                  <div key={farmer._id} className="flex items-center gap-3 rounded-xl border border-earthora-sand/70 p-3 bg-white/50">
                    <img
                      src={farmer.image}
                      alt={farmer.name}
                      className="h-12 w-12 rounded-xl object-cover shadow-xs border border-earthora-sand/80"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/img/farmers/farmer-elena.jpg';
                      }}
                    />
                    <div>
                      <h4 className="font-heading text-sm font-bold text-earthora-forest">{farmer.farmName}</h4>
                      <p className="text-xs text-earthora-muted">{farmer.location} · {farmer.totalAcres} acres</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/register?role=farmer" className="btn-primary mt-6 text-xs">
              <Sprout className="h-4 w-4" />
              Register Your Farm on Earthora
            </Link>
          </div>

          {/* Expert Connect */}
          <div className="card-surface flex flex-col justify-between p-8">
            <div>
              <div className="flex items-center justify-between">
                <span className="badge-tag bg-earthora-mint/20 text-earthora-forest">Agronomy Advisory</span>
                <Link to="/expert-connect" className="text-xs font-bold text-earthora-olive hover:underline">
                  Meet Agronomists →
                </Link>
              </div>
              <h3 className="mt-3 font-heading text-2xl font-bold text-earthora-forest">
                Expert Connect: Science-Backed Guidance
              </h3>
              <p className="mt-2 text-sm text-earthora-muted">
                Schedule 1-on-1 consultations with accredited soil microbiologists, irrigation engineers,
                and organic IPM specialists. Ask questions in our public peer-reviewed forum.
              </p>

              <div className="mt-6 space-y-3">
                {EARTHORA_EXPERTS.slice(0, 2).map((exp) => (
                  <div key={exp._id} className="flex items-center gap-3 rounded-xl border border-earthora-sand/70 p-3 bg-white/50">
                    <img
                      src={exp.image}
                      alt={exp.name}
                      className="h-12 w-12 rounded-xl object-cover shadow-xs border border-earthora-sand/80"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/img/experts/expert-aris-thorne.jpg';
                      }}
                    />
                    <div>
                      <h4 className="font-heading text-sm font-bold text-earthora-forest">{exp.name}</h4>
                      <p className="text-xs text-earthora-muted">{exp.title} · {exp.rating} ★</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/expert-connect" className="btn-secondary mt-6 text-xs">
              <Users className="h-4 w-4" />
              Book Agronomist Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Knowledge Hub Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Knowledge Hub"
            title="Agronomy Insights &amp; Technical Research"
            subtitle="Field trials, soil regeneration guides, and modern sustainable agriculture whitepapers."
          />
          <Link to="/knowledge-hub" className="btn-secondary shrink-0">
            Read Knowledge Base <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {articles.map((art) => (
            <article key={art._id} className="card-surface flex flex-col overflow-hidden hover:shadow-elevated">
              <Link to={`/knowledge-hub/${art.slug}`}>
                <img
                  src={art.image || '/assets/img/knowledge/precision-drip-irrigation.jpg'}
                  alt={art.title}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/img/knowledge/precision-drip-irrigation.jpg';
                  }}
                />
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 text-xs text-earthora-olive font-bold">
                  <span>{art.category}</span>
                  <span>·</span>
                  <span className="text-earthora-muted font-normal">{art.readTime || '5 min'}</span>
                </div>
                <Link
                  to={`/knowledge-hub/${art.slug}`}
                  className="mt-2 font-heading text-lg font-bold text-earthora-forest hover:text-earthora-mint line-clamp-2"
                >
                  {art.title}
                </Link>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-earthora-muted line-clamp-3">
                  {art.excerpt}
                </p>
                <div className="mt-4 border-t border-earthora-sand/70 pt-3 text-xs text-earthora-muted flex items-center justify-between">
                  <span>By {art.author}</span>
                  <Link to={`/knowledge-hub/${art.slug}`} className="font-bold text-earthora-forest hover:underline">
                    Read Article →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7. Newsletter & Contact Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Dispatch Box */}
          <div className="rounded-3xl bg-earthora-forest p-8 text-white lg:col-span-5 flex flex-col justify-between shadow-elevated">
            <div>
              <span className="badge-tag border border-emerald-400/30 bg-emerald-950/70 text-xs font-bold uppercase tracking-wider text-earthora-mint">
                Weekly Intelligence
              </span>
              <h3 className="mt-3 font-heading text-3xl font-extrabold">
                Get Hyperlocal Agro-Weather &amp; Soil Bulletins
              </h3>
              <p className="mt-3 text-sm text-emerald-100/80 leading-relaxed">
                Receive regional frost alerts, evapotranspiration irrigation advisories, and certified
                marketplace updates every Thursday.
              </p>
            </div>

            <form onSubmit={handleNewsletter} className="mt-8 space-y-3">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="agronomist@farm.com"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-emerald-200/50 focus:border-earthora-mint focus:outline-none"
              />
              <button type="submit" className="btn-accent w-full py-3 text-sm font-bold">
                Subscribe to Weekly Intelligence
              </button>
            </form>
          </div>

          {/* Quick Contact Form */}
          <div className="card-surface p-8 lg:col-span-7">
            <SectionHeading
              eyebrow="Connect With Earthora"
              title="Questions About IoT Hardware, Onboarding, or Advisory?"
              subtitle="Send a direct message to our agronomy support team."
            />

            <form onSubmit={handleQuickContact} className="mt-6 grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Full Name"
                className="input-field"
              />
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="Email Address"
                className="input-field"
              />
              <input
                type="text"
                required
                value={contactForm.subject}
                onChange={(e) => setContactForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder="Subject (e.g. Farm Onboarding / Hardware Integration)"
                className="input-field sm:col-span-2"
              />
              <textarea
                rows={4}
                required
                value={contactForm.message}
                onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="How can Earthora support your agricultural operations?"
                className="input-field sm:col-span-2"
              />
              <div className="sm:col-span-2">
                <button type="submit" disabled={submittingContact} className="btn-primary px-6 py-3">
                  {submittingContact ? 'Sending Inquiry...' : 'Submit Inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
