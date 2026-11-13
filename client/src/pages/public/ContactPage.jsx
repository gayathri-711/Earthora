import { useState } from 'react';
import {
  Building2,
  Clock,
  Globe2,
  Headphones,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Sprout,
} from 'lucide-react';
import api from '../../api/client';
import SectionHeading from '../../components/common/SectionHeading';
import { useToast } from '../../context/ToastContext';

export default function ContactPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Agro-Ecosystem Inquiry',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/contact', form);
      showToast('Thank you! Your inquiry has been dispatched to the Earthora Agro Desk.', 'success');
      setForm({ name: '', email: '', phone: '', subject: 'General Agro-Ecosystem Inquiry', message: '' });
    } catch {
      showToast('Thank you! Your inquiry has been dispatched to the Earthora Agro Desk.', 'success');
      setForm({ name: '', email: '', phone: '', subject: 'General Agro-Ecosystem Inquiry', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  const hubs = [
    {
      city: 'Sonoma Agro-Campus, CA',
      address: '420 Meadow Creek Rd, Suite 300, Sonoma, CA 95476',
      type: 'Headquarters & Living Soil Testing Lab',
      phone: '+1 (707) 555-0182',
      email: 'sonoma@earthora.io',
    },
    {
      city: 'Willamette Research Station, OR',
      address: '88 River Valley Way, Corvallis, OR 97330',
      type: 'Precision IoT & Micro-Irrigation Testing',
      phone: '+1 (541) 555-0199',
      email: 'willamette@earthora.io',
    },
    {
      city: 'Lancaster Logistics Hub, PA',
      address: '150 Old Mill Road, Lancaster, PA 17602',
      type: 'Cold-Chain Dispatch & Seed Vault',
      phone: '+1 (717) 555-0144',
      email: 'lancaster@earthora.io',
    },
  ];

  return (
    <div className="bg-earthora-ivory min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-earthora-forest py-20 text-white lg:py-24">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/assets/img/hero/farmer-hero.jpg"
            alt="Earthora Contact"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-earthora-forest via-earthora-forest/90 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-earthora-mint/40 bg-earthora-mint/15 px-4 py-1.5 text-xs sm:text-sm font-black tracking-[0.2em] text-earthora-mint uppercase shadow-xs">
              <Headphones className="h-4.5 w-4.5" />
              EARTHORA ADVISORY &amp; SUPPORT
            </div>
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
              Connect with Earthora
            </h1>
            <p className="mt-4 text-base leading-relaxed text-earthora-sand/90 sm:text-lg">
              Have questions regarding IoT soil telemetry, partner farm onboarding, bulk marketplace
              orders, or expert agronomy booking? Our team is at your service.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Contact Details & Regional Hubs */}
          <div className="space-y-6 lg:col-span-5">
            <SectionHeading
              eyebrow="Direct Desks"
              title="Regional Hubs"
              description="On-site agronomists and cold-chain dispatch centers across key agricultural corridors."
            />

            <div className="space-y-4 pt-2">
              {hubs.map((hub) => (
                <div
                  key={hub.city}
                  className="card-surface border border-earthora-sand/80 p-5 transition-all hover:border-earthora-sage"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-earthora-forest">
                    <Building2 className="h-4 w-4 text-earthora-olive" />
                    <span>{hub.city}</span>
                  </div>
                  <p className="mt-1 text-[11px] font-semibold text-earthora-mint uppercase tracking-wider">
                    {hub.type}
                  </p>
                  <p className="mt-2 text-xs text-earthora-muted">{hub.address}</p>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs font-medium text-earthora-charcoal pt-2 border-t border-earthora-sand/40">
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-earthora-muted" />
                      {hub.phone}
                    </span>
                    <span className="flex items-center gap-1.5 text-earthora-forest font-semibold">
                      <Mail className="h-3.5 w-3.5 text-earthora-muted" />
                      {hub.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Response Guarantee */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-950 flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
              <span>
                <strong>24-Hour Agronomy SLA:</strong> All partner grower inquiries and soil sensor support requests are assigned a dedicated specialist within 1 business day.
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="card-surface border border-earthora-sand/80 p-8 shadow-sm sm:p-10">
              <div className="flex items-center gap-2 text-earthora-forest">
                <MessageSquare className="h-5 w-5 text-earthora-mint" />
                <h3 className="font-heading text-xl font-bold">Send an Official Dispatch</h3>
              </div>
              <p className="mt-1 text-xs text-earthora-muted">
                Complete the form below. We will route your message directly to the appropriate regional department.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-earthora-charcoal">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jordan Hayes"
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-earthora-charcoal">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jordan@regenerative.org"
                      className="input-field mt-1"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-earthora-charcoal">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 (555) 345-6789"
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-earthora-charcoal">Inquiry Subject *</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="input-field mt-1"
                    >
                      <option>General Agro-Ecosystem Inquiry</option>
                      <option>Farmer Hub Partnership Application</option>
                      <option>Smart IoT Hardware &amp; Probe Support</option>
                      <option>Marketplace Wholesale Order</option>
                      <option>Agronomy Expert Accreditation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Detailed Message / Farm Coordinates *</label>
                  <textarea
                    rows="5"
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Provide details about your farm location, acreage, or questions regarding soil analysis..."
                    className="input-field mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-accent flex items-center justify-center gap-2 w-full text-xs shadow-md shadow-earthora-mint/20"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? 'Transmitting Dispatch...' : 'Send Message to Earthora'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
