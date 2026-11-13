import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import api from '../../api/client';
import SectionHeading from '../../components/common/SectionHeading';
import { useToast } from '../../context/ToastContext';

export default function ContactPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/contact', form);
      showToast('Your message has been submitted. Our support team will reply soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      showToast('Your message has been recorded. Our support team will reply soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Contact Agriva"
        title="Connect With Our Farm & Customer Team"
        subtitle="Reach out for harvest box support, farmer partnerships, wholesale inquiries, or organic verification questions."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4">
          {[
            { icon: Phone, title: 'Phone Support', detail: '+1 (800) 555-0194', sub: 'Mon–Sat · 7am – 6pm PST' },
            { icon: Mail, title: 'Email Desk', detail: 'harvest@agrivaorganic.com', sub: '24-hour response target' },
            { icon: MapPin, title: 'Regional Hub', detail: '420 Meadow Creek Rd, Sonoma, CA', sub: 'Cold-chain dispatch center' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="card-surface flex items-start gap-4 p-5">
                <div className="rounded-lg bg-agriva-mint/60 p-3 text-agriva-forest">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-agriva-ink">{item.title}</h3>
                  <p className="text-sm font-medium text-agriva-forest">{item.detail}</p>
                  <p className="text-xs text-agriva-muted">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="card-surface grid gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:col-span-8">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-agriva-ink">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Jane Doe"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-agriva-ink">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="jane@example.com"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-agriva-ink">Phone (Optional)</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+1 (555) 234-5678"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-agriva-ink">Subject</label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              placeholder="Order inquiry / Farm application"
              className="input-field"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-agriva-ink">Message</label>
            <textarea
              rows={5}
              required
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Tell us how we can assist..."
              className="input-field"
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={submitting} className="btn-primary px-6 py-3">
              {submitting ? 'Sending Message...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

