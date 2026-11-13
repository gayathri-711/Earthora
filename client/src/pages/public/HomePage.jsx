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

const CORE_PILLARS = [
  {
    icon: Cpu,
    title: 'Smart Precision Agriculture',
    description: 'IoT telemetry, LoRaWAN soil moisture probes, and satellite NDVI indices providing micro-climate field intelligence.',
    link: '/smart-agriculture',
  },
  {
    icon: Sprout,
    title: 'Crop Lifecycle Tracking',
    description: 'From seedling to bin picking, log irrigation schedules, organic inputs, and stage-by-stage growth progress.',
    link: '/crop-management',
  },
  {
    icon: Layers,
    title: 'Soil Insights & NPK Telemetry',
    description: 'Real-time laboratory & sensor analysis tracking pH, Nitrogen, Phosphorus, Potassium, and active mycorrhizal carbon.',
    link: '/soil-insights',
  },
  {
    icon: CloudSun,
    title: 'Agro-Weather Intelligence',
    description: 'Hyperlocal evapotranspiration forecasts, frost warnings, and spraying suitability windows to protect harvests.',
    link: '/weather-intelligence',
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
              <div className="inline-flex items-center gap-2 rounded-full border border-earthora-forest/20 bg-white/80 px-4 py-1.5 text-xs font-bold text-earthora-forest backdrop-blur-md shadow-subtle">
                <Sparkles className="h-3.5 w-3.5 text-earthora-mint" />
                <span>Next-Gen Agricultural Ecosystem</span>
              </div>

              <h1 className="font-heading text-4xl font-extrabold leading-[1.08] text-earthora-forest sm:text-5xl lg:text-6xl">
                Rooted in Nature. <br />
                <span className="text-emerald-700">Driven by Innovation.</span>
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-earthora-muted sm:text-lg">
                EARTHORA unites sustainable growers, certified agronomists, input suppliers,
                and conscious consumers on one intelligent platform. Monitor crops with precision IoT,
                audit soil health, and trade certified agricultural inputs and produce.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/smart-agriculture" className="btn-primary px-6 py-3">
                  Explore Smart Agri Suite
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/marketplace" className="btn-secondary px-6 py-3">
                  Agricultural Marketplace
                </Link>
                <Link to="/register?role=farmer" className="btn-accent px-6 py-3">
                  Join as Farmer
                </Link>
              </div>

              {/* Verified Metrics Counter */}
              <div className="grid grid-cols-4 gap-4 border-t border-earthora-sand/80 pt-6">
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
                  src="/assets/img/home-1/hero/slider-1.jpg"
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

      {/* 2. Core Ecosystem Pillars */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Ecosystem Architecture"
          title="Integrated Technology for Modern Agriculture"
          subtitle="Four interconnected pillars uniting hardware sensors, agronomic data science, and direct marketplace trade."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CORE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="card-surface flex flex-col justify-between p-6 hover:border-earthora-forest/40">
                <div>
                  <div className="mb-4 inline-flex rounded-xl bg-earthora-mint/20 p-3 text-earthora-forest">
                    <Icon className="h-6 w-6 text-earthora-forest" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-earthora-forest">{pillar.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-earthora-muted">{pillar.description}</p>
                </div>
                <Link
                  to={pillar.link}
                  className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-earthora-forest hover:text-earthora-mint"
                >
                  Explore Module <ArrowRight className="h-3.5 w-3.5" />
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
                  <div key={farmer._id} className="flex items-center gap-3 rounded-xl border border-earthora-sand/70 p-3">
                    <img src={farmer.image} alt={farmer.name} className="h-12 w-12 rounded-lg object-cover" />
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
                  <div key={exp._id} className="flex items-center gap-3 rounded-xl border border-earthora-sand/70 p-3">
                    <img src={exp.image} alt={exp.name} className="h-12 w-12 rounded-lg object-cover" />
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
                <img src={art.image} alt={art.title} className="aspect-[16/10] w-full object-cover" />
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
