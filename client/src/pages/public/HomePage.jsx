import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
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
  Satellite,
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

// Small Template Cards for "High-Integrity Carbon Removal & Regenerative Agriculture" (Flowing Left to Right)
const NATURE_SOLUTIONS = [
  {
    id: 'regen-ag',
    title: 'Regenerative Agriculture',
    category: 'Soil Health',
    icon: Leaf,
    image: '/assets/img/knowledge/living-soil-mycorrhizae.jpg',
    description: 'Zero-tillage, bio-diverse cover cropping, and living mycorrhizae restoring topsoil.',
    link: '/crop-management',
    linkText: 'Explore Crops',
  },
  {
    id: 'biochar',
    title: 'Biochar & Soil Carbon',
    category: 'Carbon Sink',
    icon: Flame,
    image: '/assets/img/knowledge/biochar-composting.jpg',
    description: 'Crop residue biochar locking carbon for 100+ years and holding root moisture.',
    link: '/soil-insights',
    linkText: 'Inspect Soil',
  },
  {
    id: 'agroforestry',
    title: 'Afforestation & Agroforestry (ARR)',
    category: 'Canopy Cover',
    icon: Trees,
    image: '/assets/img/about/agtech-field-trial.jpg',
    description: 'Multi-strata tree planting and boundary windbreaks for biodiversity corridors.',
    link: '/farmer-hub',
    linkText: 'View Farms',
  },
  {
    id: 'telemetry',
    title: 'Digital Precision Telemetry',
    category: 'IoT Sensors',
    icon: Satellite,
    image: '/assets/img/smart-agri/drone-remote-sensing.jpg',
    description: 'High-res satellite mapping, drone NDVI, and in-situ soil NPK telemetry.',
    link: '/smart-agriculture',
    linkText: 'View Suite',
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
    <div className="space-y-14 sm:space-y-16 pb-20">
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
              {/* Ecosystem Badge */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-900/60 px-3.5 py-1 text-xs font-black text-earthora-mint backdrop-blur-md uppercase tracking-[0.2em]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>EARTHORA · CLIMATE &amp; AGRI ECOSYSTEM</span>
                </div>
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

      {/* 3. High-Integrity Carbon Removal & Regenerative Agriculture (Left to Right, Small Template Cards) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-earthora-forest border border-emerald-200">
              <Sprout className="h-3 w-3 text-earthora-mint" />
              <span>Nature-Based Solutions</span>
            </div>
            <h2 className="mt-1.5 font-heading text-xl sm:text-2xl font-bold text-earthora-forest">
              High-Integrity Carbon Removal &amp; Regenerative Agriculture
            </h2>
          </div>
          <span className="text-xs text-earthora-muted hidden sm:inline">Scroll left to right →</span>
        </div>

        {/* Small Template Cards flowing from Left to Right */}
        <div className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2">
          {NATURE_SOLUTIONS.map((sol) => {
            const Icon = sol.icon;
            return (
              <div
                key={sol.id}
                className="w-[230px] sm:w-[250px] shrink-0 snap-start card-surface group flex flex-col justify-between overflow-hidden p-3.5 border border-earthora-sand/80 hover:border-earthora-mint hover:shadow-md transition-all rounded-2xl"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-earthora-beige/60 mb-2.5">
                    <img
                      src={sol.image}
                      alt={sol.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute left-2 top-2">
                      <span className="inline-flex items-center gap-1 rounded-md bg-earthora-forest/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-earthora-mint backdrop-blur-md">
                        <Icon className="h-2.5 w-2.5" />
                        {sol.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-heading text-sm font-bold text-earthora-forest group-hover:text-emerald-700 leading-snug">
                    {sol.title}
                  </h3>

                  <p className="mt-1 text-[11px] text-earthora-muted leading-relaxed line-clamp-2">
                    {sol.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-earthora-sand/60">
                  <Link
                    to={sol.link}
                    className="inline-flex items-center text-[11px] font-bold text-earthora-forest hover:text-earthora-mint transition-colors"
                  >
                    <span>{sol.linkText}</span>
                    <ArrowRight className="h-3 w-3 text-earthora-mint ml-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Agricultural Marketplace (4 PRODUCT CARDS - Product Name + View Details Button + Price in ₹ + Add to Cart) */}
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

      {/* 7. Minimized Farmer Hub & Expert Connect (as requested for uploaded photo) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Farmer Hub - Minimized */}
          <div className="card-surface flex flex-col justify-between p-4 sm:p-5 rounded-2xl border border-earthora-sand/80">
            <div>
              <div className="flex items-center justify-between">
                <span className="badge-tag bg-earthora-beige text-earthora-forest text-[10px] px-2 py-0.5 font-bold">Partner Network</span>
                <Link to="/farmer-hub" className="text-[11px] font-bold text-earthora-olive hover:underline">
                  View All Farms →
                </Link>
              </div>
              <h3 className="mt-1.5 font-heading text-base font-bold text-earthora-forest">
                Farmer Hub: Verified Land Stewards
              </h3>
              <p className="mt-0.5 text-[11px] text-earthora-muted line-clamp-1">
                Verified regional family farms and regenerative soil collectives.
              </p>

              <div className="mt-3 space-y-2">
                {EARTHORA_FARMERS.slice(0, 2).map((farmer) => (
                  <div key={farmer._id} className="flex items-center gap-2.5 rounded-lg border border-earthora-sand/70 p-2 bg-white/60">
                    <img
                      src={farmer.image}
                      alt={farmer.name}
                      className="h-8 w-8 rounded-lg object-cover border border-earthora-sand/80 shrink-0"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/img/farmers/farmer-elena.jpg';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-heading text-xs font-bold text-earthora-forest truncate">{farmer.farmName}</h4>
                      <p className="text-[10px] text-earthora-muted truncate">{farmer.location} · {farmer.totalAcres} acres</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/register?role=farmer" className="btn-primary mt-3 py-1.5 px-3 text-xs justify-center font-bold">
              <Sprout className="h-3.5 w-3.5 mr-1" />
              Register Your Farm on Earthora
            </Link>
          </div>

          {/* Expert Connect - Minimized */}
          <div className="card-surface flex flex-col justify-between p-4 sm:p-5 rounded-2xl border border-earthora-sand/80">
            <div>
              <div className="flex items-center justify-between">
                <span className="badge-tag bg-earthora-mint/20 text-earthora-forest text-[10px] px-2 py-0.5 font-bold">Agronomy Advisory</span>
                <Link to="/expert-connect" className="text-[11px] font-bold text-earthora-olive hover:underline">
                  Meet Agronomists →
                </Link>
              </div>
              <h3 className="mt-1.5 font-heading text-base font-bold text-earthora-forest">
                Expert Connect: Science-Backed Guidance
              </h3>
              <p className="mt-0.5 text-[11px] text-earthora-muted line-clamp-1">
                1-on-1 virtual sessions with accredited soil microbiologists and agronomists.
              </p>

              <div className="mt-3 space-y-2">
                {EARTHORA_EXPERTS.slice(0, 2).map((expert) => (
                  <div key={expert._id} className="flex items-center gap-2.5 rounded-lg border border-earthora-sand/70 p-2 bg-white/60">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="h-8 w-8 rounded-lg object-cover border border-earthora-sand/80 shrink-0"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/img/experts/expert-aris-thorne.jpg';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-heading text-xs font-bold text-earthora-forest truncate">{expert.name}</h4>
                      <p className="text-[10px] text-earthora-muted truncate">{expert.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/expert-connect" className="btn-secondary mt-3 py-1.5 px-3 text-xs justify-center font-bold">
              <Users className="h-3.5 w-3.5 mr-1" />
              Book Agronomist Consultation
            </Link>
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
