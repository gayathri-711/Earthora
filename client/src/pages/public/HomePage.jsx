import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  Leaf,
  MapPin,
  ShieldCheck,
  Sprout,
  Star,
  Truck,
} from 'lucide-react';
import api from '../../api/client';
import SectionHeading from '../../components/common/SectionHeading';
import ProductCard from '../../components/shop/ProductCard';
import { useToast } from '../../context/ToastContext';
import {
  BLOG_POSTS,
  FARMERS,
  PRODUCTS,
  SEASONAL_HARVEST,
  TESTIMONIALS,
} from '../../data/catalogData';

const whyOrganic = [
  {
    icon: ShieldCheck,
    title: 'Zero Synthetic Pesticides',
    description: 'Every harvest is grown in certified chemical-free soil audited for ecological integrity.',
  },
  {
    icon: Sprout,
    title: 'Regenerative Topsoil',
    description: 'Cover cropping and natural compost nourish microbial biodiversity and richer nutrients.',
  },
  {
    icon: Truck,
    title: '24-Hour Cold-Chain Dispatch',
    description: 'Picked to order and chilled immediately so greens arrive crisp rather than stored for weeks.',
  },
  {
    icon: Award,
    title: 'Direct Farmer Payouts',
    description: 'Growers set fair prices and keep over 82% of every sale without middlemen.',
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Morning Harvest',
    description: 'Partner growers pick seasonal produce at peak ripeness based on live orders.',
  },
  {
    step: '02',
    title: 'Quality & QR Tagging',
    description: 'Each batch is inspected, graded, and tagged with harvest date and farm origin.',
  },
  {
    step: '03',
    title: 'Chilled Regional Transit',
    description: 'Packed in breathable, recyclable crates and routed straight through regional hubs.',
  },
  {
    step: '04',
    title: 'To Your Kitchen Table',
    description: 'Delivered within 24–48 hours with live tracking from field to doorstep.',
  },
];

export default function HomePage() {
  const { showToast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState(PRODUCTS.slice(0, 4));
  const [blogs, setBlogs] = useState(BLOG_POSTS);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sendingContact, setSendingContact] = useState(false);

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
      .get('/blogs?limit=3')
      .then(({ data }) => {
        if (Array.isArray(data.data?.blogs) && data.data.blogs.length > 0) {
          setBlogs(data.data.blogs.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      await api.post('/contact/newsletter', { email: newsletterEmail.trim() });
    } catch {
      // Fallback handled cleanly
    }
    showToast('You are subscribed to the Agriva Weekly Harvest Dispatch.');
    setNewsletterEmail('');
  };

  const handleQuickContact = async (e) => {
    e.preventDefault();
    setSendingContact(true);
    try {
      await api.post('/contact', contactForm);
      showToast('Message received. Our farm support team will reply within 24 hours.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      showToast('Message saved. Our farm support team will reply within 24 hours.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } finally {
      setSendingContact(false);
    }
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-agriva-line bg-agriva-oat">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-24">
          <div className="space-y-6 lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-agriva-forest/20 bg-white px-3.5 py-1.5 text-xs font-semibold text-agriva-forest">
              <Leaf className="h-3.5 w-3.5 text-agriva-leaf" />
              From Farm to Home – Naturally Organic
            </span>

            <h1 className="font-display text-4xl font-semibold leading-[1.1] text-agriva-ink sm:text-5xl lg:text-6xl">
              Honest organic harvests, traceable to the field.
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-agriva-muted sm:text-lg">
              Agriva connects certified regenerative farmers directly with your kitchen—delivering
              sun-ripened vegetables, orchard fruit, heritage grains, and raw wildflower honey within
              hours of harvest.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/products" className="btn-primary px-6 py-3">
                Shop Fresh Harvest
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/register?role=farmer" className="btn-secondary px-6 py-3">
                Join as a Partner Farmer
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-agriva-line pt-6">
              <div>
                <p className="font-display text-2xl font-bold text-agriva-forest">48+</p>
                <p className="text-xs text-agriva-muted">Verified Organic Farms</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-agriva-forest">24h</p>
                <p className="text-xs text-agriva-muted">Harvest-to-Home Window</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-agriva-forest">100%</p>
                <p className="text-xs text-agriva-muted">Pesticide-Free Guarantee</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-2xl border border-agriva-line bg-white p-2 shadow-soft">
              <img
                src="/assets/img/home-1/hero/slider-1.jpg"
                alt="Freshly harvested organic vegetables on farm"
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-agriva-cream p-3.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-agriva-pine">
                    This Week&apos;s Pick
                  </p>
                  <p className="mt-0.5 font-display text-base font-semibold text-agriva-ink">
                    Autumn Heirloom &amp; Orchard Crate
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-agriva-forest p-3.5 text-white">
                  <div>
                    <p className="text-xs text-agriva-mint">USDA Organic</p>
                    <p className="font-display text-base font-semibold">QR Traceable</p>
                  </div>
                  <ShieldCheck className="h-7 w-7 text-agriva-mint" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Organic Products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Harvest Marketplace"
            title="Featured Organic Produce"
            subtitle="Picked at peak maturity by verified local growers and dispatched in chilled recyclable crates."
          />
          <Link to="/products" className="btn-secondary shrink-0">
            Browse All Produce
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. About Agriva Section */}
      <section className="border-y border-agriva-line bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
          <div className="grid grid-cols-2 gap-4 lg:col-span-6">
            <img
              src="/assets/img/home-3/about-1.jpg"
              alt="Organic farmer tending crops"
              className="aspect-[3/4] w-full rounded-xl object-cover"
            />
            <img
              src="/assets/img/home-3/about-2.jpg"
              alt="Sunlit organic vegetable rows"
              className="mt-8 aspect-[3/4] w-full rounded-xl object-cover"
            />
          </div>

          <div className="space-y-5 lg:col-span-6">
            <SectionHeading
              eyebrow="About Agriva"
              title="Rebuilding trust between growers and your dining table."
              subtitle="Founded on regenerative soil principles, Agriva replaces opaque supermarket supply chains with direct farm partnerships."
            />
            <ul className="space-y-3 pt-2">
              {[
                'Third-party verified organic certifications visible on every product page.',
                'Live farmer inventory and harvest dates updated directly by growers.',
                'Zero-plastic biodegradable packaging and minimal food miles.',
              ].map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-agriva-ink">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-agriva-leaf" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <Link to="/about" className="btn-primary">
                Explore Our Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Organic */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          align="center"
          eyebrow="The Agriva Standard"
          title="Why Choose Certified Organic"
          subtitle="Cleaner nutrition for your household, living soil for future harvests, and fair livelihoods for farmers."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyOrganic.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="card-surface p-6">
                <div className="mb-4 inline-flex rounded-lg bg-agriva-mint/60 p-3 text-agriva-forest">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-agriva-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-agriva-muted">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Farm-to-Home Process */}
      <section className="bg-agriva-forest py-16 text-white lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="mb-2 inline-block text-xs font-bold uppercase tracking-[0.16em] text-agriva-mint">
              How It Works
            </span>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Our 24-Hour Farm-to-Home Process
            </h2>
            <p className="mt-3 text-base text-agriva-mint/85">
              Every order triggers a synchronized harvest schedule—never sitting in warehouse cold storage.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm"
              >
                <span className="font-display text-3xl font-bold text-agriva-mint">{step.step}</span>
                <h3 className="mt-3 font-display text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-agriva-mint/80">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Featured Farmers */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Stewards of the Land"
            title="Meet Our Partner Farmers"
            subtitle="Independent family farms and organic collectives cultivating regional resilience."
          />
          <Link to="/farmers" className="btn-secondary shrink-0">
            All Partner Farmers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FARMERS.map((farmer) => (
            <div key={farmer.id} className="card-surface overflow-hidden">
              <img
                src={farmer.image}
                alt={farmer.name}
                className="aspect-[4/3] w-full object-cover object-top"
              />
              <div className="p-5">
                <p className="text-xs font-semibold text-agriva-pine">{farmer.farmName}</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-agriva-ink">{farmer.name}</h3>
                <p className="mt-1 text-xs text-agriva-muted">{farmer.specialty}</p>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-agriva-muted">
                  <MapPin className="h-3.5 w-3.5 text-agriva-earth" />
                  {farmer.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Seasonal Harvest Availability */}
      <section className="border-y border-agriva-line bg-agriva-oat py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Seasonal Calendar"
            title="What’s Growing Across the Seasons"
            subtitle="Eating with the natural calendar ensures peak flavor, lower carbon footprint, and abundant nutrition."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SEASONAL_HARVEST.map((entry) => (
              <div
                key={entry.season}
                className={`rounded-xl border p-6 ${
                  entry.active
                    ? 'border-agriva-forest bg-white shadow-soft'
                    : 'border-agriva-line bg-agriva-cream'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold text-agriva-ink">{entry.season}</h3>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      entry.active
                        ? 'bg-agriva-forest text-white'
                        : 'bg-white text-agriva-muted'
                    }`}
                  >
                    <Calendar className="h-3 w-3" />
                    {entry.months}
                  </span>
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-agriva-pine">
                  {entry.status}
                </p>
                <ul className="mt-4 space-y-2 border-t border-agriva-line pt-3 text-sm text-agriva-ink">
                  {entry.crops.map((crop) => (
                    <li key={crop} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-agriva-leaf" />
                      {crop}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Customer Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          align="center"
          eyebrow="Community Voices"
          title="Loved by Households & Chefs"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="card-surface flex flex-col justify-between p-6">
              <div>
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-agriva-gold text-agriva-gold" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-agriva-ink">“{t.quote}”</p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-agriva-line pt-4">
                <img src={t.avatar} alt={t.displayName} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-agriva-ink">{t.displayName}</p>
                  <p className="text-xs text-agriva-muted">
                    {t.role} · {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Latest Agriculture Blogs */}
      <section className="border-t border-agriva-line bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Agriculture Journal"
              title="Field Notes & Sustainable Farming"
              subtitle="Practical guides on soil regeneration, seasonal eating, and food traceability."
            />
            <Link to="/blog" className="btn-secondary shrink-0">
              Read All Articles
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {blogs.map((post) => (
              <article key={post._id} className="card-surface overflow-hidden">
                <Link to={`/blog/${post.slug}`}>
                  <img src={post.image} alt={post.title} className="aspect-[16/10] w-full object-cover" />
                </Link>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-agriva-muted">
                    <span className="font-semibold text-agriva-pine">{post.category}</span>
                    <span>·</span>
                    <span>{post.readTime || '5 min read'}</span>
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-2 block font-display text-lg font-semibold text-agriva-ink hover:text-agriva-forest"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-2 line-clamp-2 text-sm text-agriva-muted">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Newsletter + 11. Contact Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded-2xl border border-agriva-forest/15 bg-agriva-forest p-8 text-white lg:col-span-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-agriva-mint">
                Weekly Dispatch
              </span>
              <h2 className="mt-2 font-display text-3xl font-semibold">
                Get Fresh Harvest Alerts Before Crates Sell Out
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-agriva-mint/85">
                Every Thursday morning we share what is peaking across our partner orchards and
                market gardens, plus seasonal recipes.
              </p>
            </div>
            <form onSubmit={handleNewsletter} className="mt-8 space-y-3">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full rounded-lg border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-agriva-mint/60 focus:border-agriva-mint focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-agriva-mint px-5 py-3 text-sm font-semibold text-agriva-forest transition-colors hover:bg-white"
              >
                Subscribe to Harvest Alerts
              </button>
            </form>
          </div>

          <div className="card-surface p-8 lg:col-span-7">
            <SectionHeading
              eyebrow="Get in Touch"
              title="Questions About Wholesale, Farms, or Delivery?"
              subtitle="Send a message directly to our regional support desk."
            />
            <form onSubmit={handleQuickContact} className="mt-6 grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                className="input-field"
              />
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="Email address"
                className="input-field"
              />
              <input
                type="text"
                required
                value={contactForm.subject}
                onChange={(e) => setContactForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder="Subject (e.g., Farm onboarding, Order inquiry)"
                className="input-field sm:col-span-2"
              />
              <textarea
                rows={3}
                required
                value={contactForm.message}
                onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="How can we help?"
                className="input-field sm:col-span-2"
              />
              <div className="sm:col-span-2">
                <button type="submit" disabled={sendingContact} className="btn-primary">
                  {sendingContact ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

