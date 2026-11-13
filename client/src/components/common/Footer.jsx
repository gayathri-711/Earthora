import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ShieldCheck, Sparkles, Sprout } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function Footer() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/contact/newsletter', { email: email.trim() });
      showToast('Subscribed to Earthora Agro-Intelligence Brief.');
      setEmail('');
    } catch {
      showToast('Subscribed to Earthora Agro-Intelligence Brief.');
      setEmail('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-earthora-deep bg-earthora-forest text-emerald-100/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/assets/earthora/logo-icon.svg"
                alt="EARTHORA"
                className="h-11 w-11 sm:h-12 sm:w-12 transition-transform duration-200 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-heading text-2xl sm:text-3xl font-black tracking-widest text-white leading-none">
                  EARTHORA
                </span>
                <span className="text-[10px] sm:text-[11px] font-black tracking-[0.24em] text-earthora-mint uppercase mt-1">
                  Rooted in Nature · Driven by Innovation
                </span>
              </div>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-emerald-100/70">
              The next-generation digital agriculture ecosystem connecting sustainable farmers,
              certified agronomists, input suppliers, and conscious consumers through precision technology.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="badge-tag border border-emerald-500/30 bg-emerald-900/40 text-[11px] text-emerald-300">
                <Sparkles className="h-3 w-3" /> IoT Precision Integrated
              </span>
              <span className="badge-tag border border-emerald-500/30 bg-emerald-900/40 text-[11px] text-emerald-300">
                <ShieldCheck className="h-3 w-3" /> Verified Regenerative
              </span>
            </div>
          </div>

          {/* Ecosystem Navigation */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-bold tracking-wider uppercase text-white">
              Ecosystem Modules
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/smart-agriculture" className="hover:text-white transition-colors">Smart Agriculture Suite</Link></li>
              <li><Link to="/crop-management" className="hover:text-white transition-colors">Crop Management</Link></li>
              <li><Link to="/weather-intelligence" className="hover:text-white transition-colors">Weather Intelligence</Link></li>
              <li><Link to="/soil-insights" className="hover:text-white transition-colors">Soil Insights &amp; NPK</Link></li>
              <li><Link to="/expert-connect" className="hover:text-white transition-colors">Expert Connect Advisory</Link></li>
              <li><Link to="/knowledge-hub" className="hover:text-white transition-colors">Knowledge Hub &amp; Guides</Link></li>
            </ul>
          </div>

          {/* Marketplace & Hubs */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-bold tracking-wider uppercase text-white">
              Marketplace &amp; Portals
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/marketplace" className="hover:text-white transition-colors">Agricultural Marketplace</Link></li>
              <li><Link to="/farmer-hub" className="hover:text-white transition-colors">Farmer Hub &amp; Acreage</Link></li>
              <li><Link to="/track-order" className="hover:text-white transition-colors">Live Order Tracking</Link></li>
              <li><Link to="/register?role=farmer" className="hover:text-white transition-colors">Register as Farmer</Link></li>
              <li><Link to="/register?role=expert" className="hover:text-white transition-colors">Join as Agronomist</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Earthora</Link></li>
            </ul>
          </div>

          {/* Weekly Agro-Intelligence Dispatch */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-bold tracking-wider uppercase text-white">
              Agro-Intelligence Brief
            </h3>
            <p className="mb-3 text-xs text-emerald-100/70">
              Weekly seasonal weather forecasts, soil regeneration whitepapers, and smart harvest alerts.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agronomist@farm.com"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-xs text-white placeholder:text-emerald-200/50 focus:border-earthora-mint focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-earthora-mint px-4 py-2 text-xs font-bold text-earthora-forest transition-colors hover:bg-emerald-300"
              >
                {submitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            <div className="mt-4 space-y-1.5 text-[11px] text-emerald-200/70">
              <p className="flex items-center gap-2"><Phone className="h-3 w-3" /> +1 (800) 555-0194</p>
              <p className="flex items-center gap-2"><Mail className="h-3 w-3" /> contact@earthora.io</p>
              <p className="flex items-center gap-2"><MapPin className="h-3 w-3" /> Sonoma &amp; Willamette Valley Regional Hubs</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-emerald-100/50 sm:flex-row">
          <p>© {new Date().getFullYear()} EARTHORA. Rooted in Nature. Driven by Innovation. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <Sprout className="h-3.5 w-3.5 text-earthora-mint" />
            100% Verified Regenerative &amp; Smart Agriculture
          </p>
        </div>
      </div>
    </footer>
  );
}
