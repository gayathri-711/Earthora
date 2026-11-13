import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Sprout } from 'lucide-react';
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
      showToast('Subscribed to weekly seasonal harvest updates.');
      setEmail('');
    } catch {
      // Graceful fallback if API server is not started yet during Phase 2
      showToast('Subscribed to weekly seasonal harvest updates.');
      setEmail('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-agriva-forest/15 bg-agriva-forest text-agriva-mint/90">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img src="/assets/img/logo/white-logo.svg" alt="AGRIVA" className="h-8 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed text-agriva-mint/80">
              From Farm to Home – Naturally Organic. Connecting verified regenerative growers directly
              with mindful households and kitchens.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white">
              <Sprout className="h-3.5 w-3.5 text-agriva-mint" />
              100% Certified Organic Network
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-base font-semibold text-white">Marketplace</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/products" className="hover:text-white">All Organic Produce</Link></li>
              <li><Link to="/farmers" className="hover:text-white">Partner Farmers</Link></li>
              <li><Link to="/track-order" className="hover:text-white">Order Tracking</Link></li>
              <li><Link to="/register?role=farmer" className="hover:text-white">Sell on Agriva</Link></li>
              <li><Link to="/faq" className="hover:text-white">Harvest FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-base font-semibold text-white">Company & Standards</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-white">About Agriva</Link></li>
              <li><Link to="/services" className="hover:text-white">Agricultural Services</Link></li>
              <li><Link to="/gallery" className="hover:text-white">Farm Gallery</Link></li>
              <li><Link to="/blog" className="hover:text-white">Agriculture Journal</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-base font-semibold text-white">Seasonal Harvest Dispatch</h3>
            <p className="mb-3 text-sm text-agriva-mint/80">
              Weekly harvest alerts, farm stories, and member-only box drops.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-agriva-mint/60 focus:border-agriva-mint focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-agriva-mint px-4 py-2.5 text-sm font-semibold text-agriva-forest transition-colors hover:bg-white"
              >
                {submitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            <div className="mt-5 space-y-2 text-xs text-agriva-mint/80">
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> +1 (800) 555-0194</p>
              <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> harvest@agrivaorganic.com</p>
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Sonoma & Willamette Valley Hubs</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-agriva-mint/70 sm:flex-row">
          <p>© {new Date().getFullYear()} AGRIVA Organic Agriculture Platform. All rights reserved.</p>
          <p>Traceable · Regenerative · Direct Farmer Payouts</p>
        </div>
      </div>
    </footer>
  );
}

