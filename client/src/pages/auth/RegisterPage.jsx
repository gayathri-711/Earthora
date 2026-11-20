import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sprout,
  User,
  UserCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const requestedExpert = searchParams.get('role') === 'expert';
  const initialRole = requestedExpert ? 'customer' : (searchParams.get('role') || 'customer');

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState(initialRole);
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    farmName: '',
    location: '',
    specialty: '',
    totalAcres: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await register({ ...form, role });
      showToast(`Welcome to the Earthora Ecosystem, ${res.user.name}!`, 'success');
      if (res.user.role === 'farmer') navigate('/dashboard/farmer', { replace: true });
      else navigate('/dashboard/customer', { replace: true });
    } catch (err) {
      const msg = err.message || 'Registration failed';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-earthora-ivory min-h-screen py-16 flex items-center justify-center px-4">
      <div className="card-surface w-full max-w-xl border border-earthora-sand/80 p-8 shadow-xl sm:p-10">
        <div className="flex items-center gap-3.5">
          <img src="/assets/earthora/logo-icon.svg" alt="EARTHORA" className="h-12 w-12" />
          <div>
            <span className="font-heading text-3xl sm:text-4xl font-black tracking-widest text-earthora-forest leading-none">
              EARTHORA
            </span>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-earthora-olive mt-1">
              Smart Agri Ecosystem
            </p>
          </div>
        </div>

        <h1 className="mt-7 font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-earthora-forest tracking-tight">
          Create Ecosystem Account
        </h1>
        <p className="mt-1 text-xs text-earthora-muted">
          Select your ecosystem role to access dedicated agronomy tools and marketplaces.
        </p>

        {requestedExpert && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 shadow-xs">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-4.5 w-4.5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">Agriculture Expert Provisioning Notice</p>
                <p className="mt-1 text-[11px] text-amber-800 leading-relaxed">
                  Agriculture Expert / Agronomist accounts cannot be registered publicly. They are provisioned directly by Earthora administrators. If credentials were provided to you, please{' '}
                  <Link to="/login" className="font-bold underline hover:text-earthora-forest">
                    Sign In here
                  </Link>
                  . For new agronomist onboarding, contact <strong className="font-mono">admin@earthora.io</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Role Picker (Public roles: Customer & Farmer) */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => { setRole('customer'); setErrorMessage(''); }}
            className={`flex flex-col items-center rounded-2xl border p-3.5 text-center transition-all ${
              role === 'customer'
                ? 'border-earthora-forest bg-earthora-forest text-white shadow-md'
                : 'border-earthora-sand bg-white text-earthora-charcoal hover:border-earthora-forest'
            }`}
          >
            <Users className="h-5 w-5 mb-1" />
            <span className="text-xs font-bold">Customer</span>
            <span className="text-[9px] opacity-80">Produce &amp; Organic Inputs</span>
          </button>

          <button
            type="button"
            onClick={() => { setRole('farmer'); setErrorMessage(''); }}
            className={`flex flex-col items-center rounded-2xl border p-3.5 text-center transition-all ${
              role === 'farmer'
                ? 'border-earthora-forest bg-earthora-forest text-white shadow-md'
                : 'border-earthora-sand bg-white text-earthora-charcoal hover:border-earthora-forest'
            }`}
          >
            <Sprout className="h-5 w-5 mb-1" />
            <span className="text-xs font-bold">Grower / Farm</span>
            <span className="text-[9px] opacity-80">Crops &amp; Field Telemetry</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-earthora-charcoal">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Vance"
                className="input-field mt-1 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-earthora-charcoal">Email Address *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@earthora.io"
                className="input-field mt-1 text-xs"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-earthora-charcoal">Password (min 6 chars) *</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="input-field mt-1 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-earthora-charcoal">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (555) 012-3456"
                className="input-field mt-1 text-xs"
              />
            </div>
          </div>

          {/* Role-Specific Fields */}
          {role === 'customer' && (
            <div className="space-y-3 rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
              <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                Customer Location &amp; Delivery Details
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">City / District</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Pune, Maharashtra / Portland, OR"
                    className="input-field mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Delivery Address / Street</label>
                  <input
                    type="text"
                    value={form.street || ''}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                    placeholder="e.g. 742 Evergreen Terrace"
                    className="input-field mt-1 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {role === 'farmer' && (
            <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Farm Stewardship Profile
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Farm / Estate Name *</label>
                  <input
                    type="text"
                    required
                    value={form.farmName}
                    onChange={(e) => setForm({ ...form, farmName: e.target.value })}
                    placeholder="e.g. Sonoma Creek Agro-Farm"
                    className="input-field mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Total Acreage</label>
                  <input
                    type="number"
                    value={form.totalAcres}
                    onChange={(e) => setForm({ ...form, totalAcres: e.target.value })}
                    placeholder="45"
                    className="input-field mt-1 text-xs"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Farm Location (City / District)</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Pune, Maharashtra"
                    className="input-field mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Primary Crops / Specialty</label>
                  <input
                    type="text"
                    value={form.specialty}
                    onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                    placeholder="Heirloom Brassicas, Cover Crops, Stone Fruit"
                    className="input-field mt-1 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-900 shadow-sm">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-rose-900">Registration Notice</p>
                  <p className="mt-1 leading-relaxed text-rose-800">{errorMessage}</p>
                  {errorMessage.toLowerCase().includes('already exists') && (
                    <div className="mt-2.5 pt-2 border-t border-rose-200">
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 font-bold text-earthora-forest underline hover:text-earthora-mint"
                      >
                        Click here to Sign In with this email &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-accent w-full py-3 text-xs font-bold shadow-md shadow-earthora-mint/20 mt-4"
          >
            {loading ? 'Creating Ecosystem Account...' : 'Complete Earthora Registration'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-earthora-muted">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-earthora-forest underline hover:text-earthora-mint">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
