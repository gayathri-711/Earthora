import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sprout, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'farmer' ? 'farmer' : 'customer';

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
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register({ ...form, role });
      showToast('Account created! Welcome to Agriva.');
      navigate(user.role === 'farmer' ? '/farmer' : '/customer', { replace: true });
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-14">
      <div className="card-surface p-8">
        <span className="text-xs font-bold uppercase tracking-widest text-agriva-pine">
          Join the Community
        </span>
        <h1 className="mt-1 font-display text-3xl font-semibold text-agriva-ink">
          Create Your Agriva Account
        </h1>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold ${
              role === 'customer'
                ? 'border-agriva-forest bg-agriva-forest text-white'
                : 'border-agriva-line bg-white text-agriva-muted'
            }`}
          >
            <User className="h-4 w-4" />
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold ${
              role === 'farmer'
                ? 'border-agriva-forest bg-agriva-forest text-white'
                : 'border-agriva-line bg-white text-agriva-muted'
            }`}
          >
            <Sprout className="h-4 w-4" />
            Partner Farmer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold">Password (min 6 chars)</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="input-field"
            />
          </div>

          {role === 'farmer' && (
            <div className="space-y-4 rounded-xl border border-agriva-line bg-agriva-cream p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-agriva-pine">
                Farm Details
              </p>
              <div>
                <label className="mb-1 block text-xs font-semibold">Farm / Collective Name</label>
                <input
                  type="text"
                  required
                  value={form.farmName}
                  onChange={(e) => setForm((f) => ({ ...f, farmName: e.target.value }))}
                  placeholder="Sunridge Organic Acres"
                  className="input-field"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold">Location</label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="Sonoma, CA"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Specialty</label>
                  <input
                    type="text"
                    value={form.specialty}
                    onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
                    placeholder="Heirloom Greens"
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Creating account...' : `Register as ${role === 'farmer' ? 'Partner Farmer' : 'Customer'}`}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-agriva-muted">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-agriva-forest hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

