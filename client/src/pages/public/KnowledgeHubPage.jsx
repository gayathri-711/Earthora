import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Layers,
  Search,
  Sparkles,
  Tag,
  User,
} from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import { EARTHORA_ARTICLES } from '../../data/catalogData';
import { useToast } from '../../context/ToastContext';

export default function KnowledgeHubPage() {
  const [articles] = useState(EARTHORA_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailSub, setEmailSub] = useState('');
  const { showToast } = useToast();

  const categories = ['All', 'Smart Irrigation', 'Soil Regeneration', 'Precision Farming'];

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchCat =
        selectedCategory === 'All' || art.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.tags && art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCat && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailSub) return;
    showToast('Subscribed to the weekly Earthora Agronomy Dispatch!', 'success');
    setEmailSub('');
  };

  return (
    <div className="bg-earthora-ivory min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-earthora-forest py-20 text-white lg:py-24">
        <div className="absolute inset-0 opacity-15">
          <img
            src="/assets/img/home-1/hero/slider-3.jpg"
            alt="Knowledge Hub"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-earthora-forest via-earthora-forest/90 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-earthora-mint/40 bg-earthora-mint/15 px-4 py-1.5 text-xs sm:text-sm font-black tracking-[0.2em] text-earthora-mint uppercase shadow-xs">
              <BookOpen className="h-4.5 w-4.5" />
              EARTHORA AGRONOMIC REPOSITORY
            </div>
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
              Knowledge Hub &amp; Field Research
            </h1>
            <p className="mt-4 text-base leading-relaxed text-earthora-sand/90 sm:text-lg">
              Peer-reviewed technical guides, precision IoT installation benchmarks, living soil
              case studies, and organic yield optimization whitepapers.
            </p>
          </div>

          {/* Search Box in Hero */}
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-earthora-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles on mycorrhizae, drip telemetry, NDVI drones..."
                className="w-full rounded-2xl border border-white/20 bg-white/95 py-3.5 pl-12 pr-4 text-xs font-medium text-earthora-charcoal placeholder-earthora-muted shadow-xl focus:outline-none focus:ring-2 focus:ring-earthora-mint"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Articles Area */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-earthora-forest text-white shadow-md'
                  : 'border border-earthora-sand bg-white text-earthora-charcoal hover:border-earthora-forest'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((art) => (
            <article
              key={art._id}
              className="card-surface group flex flex-col overflow-hidden border border-earthora-sand/80 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-52 w-full overflow-hidden bg-earthora-forest">
                <img
                  src={art.image}
                  alt={art.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="rounded-full bg-earthora-forest/90 px-3 py-1 text-[11px] font-bold text-earthora-mint backdrop-blur-sm">
                    {art.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-xs text-earthora-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {art.readTime}
                  </span>
                  <span>·</span>
                  <span>{art.publishedAt}</span>
                </div>

                <h3 className="mt-3 font-heading text-lg font-bold text-earthora-forest group-hover:text-earthora-olive transition-colors">
                  <Link to={`/knowledge-hub/${art.slug}`}>{art.title}</Link>
                </h3>

                <p className="mt-3 text-xs leading-relaxed text-earthora-muted line-clamp-3">
                  {art.excerpt}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {art.tags?.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-earthora-sand/40 px-2 py-0.5 text-[10px] font-semibold text-earthora-forest"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="mt-auto border-t border-earthora-sand/50 pt-4 mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-earthora-forest text-[11px] font-bold text-white">
                      {art.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-earthora-charcoal">{art.author}</p>
                      <p className="text-[10px] text-earthora-muted">{art.authorTitle}</p>
                    </div>
                  </div>

                  <Link
                    to={`/knowledge-hub/${art.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-earthora-forest hover:text-earthora-mint"
                  >
                    Read <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Subscription Banner */}
        <div className="mt-20 overflow-hidden rounded-3xl bg-earthora-forest p-8 text-white sm:p-12 relative">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-white to-transparent pointer-events-none" />
          <div className="relative max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-earthora-mint">
              Weekly Agronomy Briefing
            </span>
            <h3 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">
              Get the Earthora Regenerative Dispatch
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-earthora-sand/90 sm:text-sm">
              Sent every Thursday: Soil health research summaries, upcoming frost forecasts, and bio-input application guides.
            </p>

            <form onSubmit={handleSubscribe} className="mt-6 flex flex-col gap-3 sm:flex-row max-w-md">
              <input
                type="email"
                required
                value={emailSub}
                onChange={(e) => setEmailSub(e.target.value)}
                placeholder="grower@farm.org"
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs text-white placeholder-earthora-sand/60 focus:border-earthora-mint focus:bg-white/20 focus:outline-none"
              />
              <button type="submit" className="btn-accent text-xs whitespace-nowrap">
                Subscribe Free
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

