import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Award, Lock, Mail, Phone, ShieldCheck, Sprout, User, UserCheck, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'customer';

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    farmName: '',
    location: '',
    specialty: '',
    totalAcres: '',
    fieldOfStudy: '',
    organization: '',
    experienceYears: '',
    consultationFee: 75,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register({ ...form, role });
      showToast(`Welcome to the Earthora Ecosystem, ${user.name}!`, 'success');
      if (user.role === 'farmer') navigate('/dashboard/farmer', { replace: true });
      else if (user.role === 'expert') navigate('/dashboard/expert', { replace: true });
      else navigate('/dashboard/customer', { replace: true });
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-earthora-ivory min-h-screen py-16 flex items-center justify-center px-4">
      <div className="card-surface w-full max-w-xl border border-earthora-sand/80 p-8 shadow-xl sm:p-10">
        <div className="flex items-center gap-2.5">
          <img src="/assets/earthora/logo-icon.svg" alt="EARTHORA" className="h-9 w-9" />
          <div>
            <span className="font-heading text-lg font-extrabold tracking-wider text-earthora-forest">
              EARTHORA
            </span>
            <p className="text-[10px] font-bold uppercase tracking-wider text-earthora-olive">
              Smart Agri Ecosystem
            </p>
          </div>
        </div>

        <h1 className="mt-6 font-heading text-2xl font-extrabold text-earthora-forest sm:text-3xl">
          Create Your Earthora Account
        </h1>
        <p className="mt-1 text-xs text-earthora-muted">
          Select your ecosystem role to access dedicated agronomy tools and marketplaces.
        </p>

        {/* Role Picker (3 user-facing roles) */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex flex-col items-center rounded-2xl border p-3 text-center transition-all ${
              role === 'customer'
                ? 'border-earthora-forest bg-earthora-forest text-white shadow-md'
                : 'border-earthora-sand bg-white text-earthora-charcoal hover:border-earthora-forest'
            }`}
          >
            <Users className="h-5 w-5 mb-1" />
            <span className="text-xs font-bold">Customer</span>
            <span className="text-[9px] opacity-80">Produce &amp; Inputs</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`flex flex-col items-center rounded-2xl border p-3 text-center transition-all ${
              role === 'farmer'
                ? 'border-earthora-forest bg-earthora-forest text-white shadow-md'
                : 'border-earthora-sand bg-white text-earthora-charcoal hover:border-earthora-forest'
            }`}
          >
            <Sprout className="h-5 w-5 mb-1" />
            <span className="text-xs font-bold">Grower / Farm</span>
            <span className="text-[9px] opacity-80">Crops &amp; Harvest</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('expert')}
            className={`flex flex-col items-center rounded-2xl border p-3 text-center transition-all ${
              role === 'expert'
                ? 'border-earthora-forest bg-earthora-forest text-white shadow-md'
                : 'border-earthora-sand bg-white text-earthora-charcoal hover:border-earthora-forest'
            }`}
          >
            <UserCheck className="h-5 w-5 mb-1" />
            <span className="text-xs font-bold">Agronomist</span>
            <span className="text-[9px] opacity-80">Expert Advisory</span>
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
          )}

          {role === 'expert' && (
            <div className="space-y-3 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Agronomic Accreditation Profile
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Field of Study / Discipline *</label>
                  <input
                    type="text"
                    required
                    value={form.fieldOfStudy}
                    onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
                    placeholder="Soil Microbiology &amp; Rhizosphere"
                    className="input-field mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Institution / Advisory Firm</label>
                  <input
                    type="text"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    placeholder="University of California, Davis"
                    className="input-field mt-1 text-xs"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Years of Experience</label>
                  <input
                    type="number"
                    value={form.experienceYears}
                    onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                    placeholder="12"
                    className="input-field mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Consultation Fee ($/session)</label>
                  <input
                    type="number"
                    value={form.consultationFee}
                    onChange={(e) => setForm({ ...form, consultationFee: e.target.value })}
                    className="input-field mt-1 text-xs"
                  />
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
