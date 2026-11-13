import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Share2,
  Sparkles,
  Tag,
  User,
} from 'lucide-react';
import { EARTHORA_ARTICLES } from '../../data/catalogData';
import { useToast } from '../../context/ToastContext';

export default function ArticleDetailsPage() {
  const { slug } = useParams();
  const { showToast } = useToast();

  const article =
    EARTHORA_ARTICLES.find((a) => a.slug === slug) || EARTHORA_ARTICLES[0];

  const relatedArticles = EARTHORA_ARTICLES.filter((a) => a._id !== article._id).slice(0, 2);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="bg-earthora-ivory min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Back */}
        <div className="flex items-center justify-between">
          <Link
            to="/knowledge-hub"
            className="inline-flex items-center gap-2 text-xs font-bold text-earthora-forest hover:text-earthora-mint"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Knowledge Hub
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-xl border border-earthora-sand bg-white px-3 py-1.5 text-xs font-semibold text-earthora-charcoal hover:bg-earthora-sand/20"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share Article
          </button>
        </div>

        {/* Article Header */}
        <header className="mt-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-earthora-forest px-3.5 py-1 text-xs font-bold text-earthora-mint">
            {article.category}
          </div>
          <h1 className="mt-4 font-heading text-3xl font-extrabold text-earthora-forest sm:text-4xl lg:text-5xl leading-tight">
            {article.title}
          </h1>

          {/* Author Byline */}
          <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-earthora-sand/60 pb-6 text-xs text-earthora-muted">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-earthora-forest font-bold text-white">
                {article.author.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-earthora-charcoal">{article.author}</p>
                <p className="text-[11px] text-earthora-muted">{article.authorTitle}</p>
              </div>
            </div>
            <span className="hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Published {article.publishedAt}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-earthora-sand shadow-lg">
          <img
            src={article.image}
            alt={article.title}
            className="h-96 w-full object-cover"
          />
        </div>

        {/* Key Takeaways Box */}
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            Executive Agronomy Takeaways
          </div>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-emerald-950">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Continuous root-zone tension feedback (LoRaWAN probes) saves on average 42% water volume compared to timer-based valves.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Maintaining soil matric potential between 25 and 35 kPa maximizes plant nutrient absorption without inducing hypoxia.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Zero synthetic inputs coupled with bio-active humic compounds preserve mycorrhizal hyphae during dry spells.
              </span>
            </li>
          </ul>
        </div>

        {/* Body Content */}
        <div className="mt-10 space-y-6 text-sm leading-relaxed text-earthora-charcoal">
          <p className="text-base font-medium text-earthora-forest leading-relaxed">
            {article.excerpt}
          </p>

          <p>
            {article.content}
          </p>

          <h3 className="font-heading text-xl font-bold text-earthora-forest pt-4">
            1. The Limitation of Traditional Timer Irrigation
          </h3>
          <p>
            Most legacy agricultural setups operate on scheduled clock valves. Whether it rains or ambient humidity spikes to 90%, these timers release a fixed volume of water. The consequences are two-fold: waterlogged topsoil promotes root-rot pathogens such as Pythium, while leaching valuable organic nitrates beyond root access depth.
          </p>

          <div className="rounded-2xl border-l-4 border-earthora-forest bg-earthora-sand/20 p-5 italic text-earthora-forest font-serif">
            "When irrigation is calibrated to the physiological tension of living soil rather than an arbitrary wall clock, crops develop deeper, more resilient root crowns and require 35% less supplementary fertilization."
          </div>

          <h3 className="font-heading text-xl font-bold text-earthora-forest pt-4">
            2. IoT Probe Deployment &amp; LoRaWAN Architecture
          </h3>
          <p>
            In Earthora partner plots, dual-depth capacitive sensors are sunk at 15cm (feeder roots) and 45cm (taproot threshold). Operating on battery-efficient LoRaWAN frequencies, these probes transmit matric potential data every 10 minutes to the central Earthora Smart Dashboard, triggering solar solenoid actuators precisely when crop coefficients dictate.
          </p>

          {/* Tags */}
          <div className="mt-10 border-t border-earthora-sand/60 pt-6">
            <span className="text-xs font-bold text-earthora-charcoal uppercase tracking-wider">
              Categorized Topics:
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {article.tags?.map((t) => (
                <span
                  key={t}
                  className="rounded-lg bg-earthora-sand/50 px-3 py-1 text-xs font-semibold text-earthora-forest"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Related Guides */}
        <div className="mt-16 border-t border-earthora-sand/60 pt-12">
          <h3 className="font-heading text-2xl font-bold text-earthora-forest">
            Related Field Research
          </h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {relatedArticles.map((rel) => (
              <Link
                key={rel._id}
                to={`/knowledge-hub/${rel.slug}`}
                className="card-surface group flex flex-col p-5 border border-earthora-sand/80 transition-all hover:border-earthora-forest hover:shadow-md"
              >
                <span className="text-[11px] font-bold text-earthora-olive uppercase">
                  {rel.category}
                </span>
                <h4 className="mt-2 font-heading text-base font-bold text-earthora-forest group-hover:text-earthora-mint transition-colors">
                  {rel.title}
                </h4>
                <p className="mt-2 text-xs text-earthora-muted line-clamp-2">{rel.excerpt}</p>
                <span className="mt-4 text-xs font-bold text-earthora-forest underline">
                  Read Guide →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
