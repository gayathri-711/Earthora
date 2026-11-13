import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectForRole = (role) => {
    if (location.state?.from) return location.state.from;
    if (role === 'admin') return '/admin';
    if (role === 'farmer') return '/farmer';
    return '/customer';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedIn = await login(email, password);
      showToast(`Welcome back, ${loggedIn.name}!`);
      navigate(redirectForRole(loggedIn.role), { replace: true });
    } catch (err) {
      showToast(err.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="card-surface p-8">
        <span className="text-xs font-bold uppercase tracking-widest text-agriva-pine">
          Account Access
        </span>
        <h1 className="mt-1 font-display text-3xl font-semibold text-agriva-ink">Sign In to Agriva</h1>
        <p className="mt-1 text-sm text-agriva-muted">
          Access your customer orders, farmer harvest portal, or admin dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-agriva-ink">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-agriva-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field pl-9"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-agriva-ink">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-agriva-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-9"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 rounded-xl border border-agriva-line bg-agriva-cream p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-agriva-pine">
            Quick Demo Accounts
          </p>
          <div className="mt-2.5 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('customer@agriva.com', 'Agriva123!')}
              className="rounded-md border border-agriva-line bg-white px-2 py-1.5 text-xs font-medium text-agriva-ink hover:border-agriva-forest"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => fillDemo('farmer@agriva.com', 'Agriva123!')}
              className="rounded-md border border-agriva-line bg-white px-2 py-1.5 text-xs font-medium text-agriva-ink hover:border-agriva-forest"
            >
              Farmer
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@agriva.com', 'Agriva123!')}
              className="rounded-md border border-agriva-line bg-white px-2 py-1.5 text-xs font-medium text-agriva-ink hover:border-agriva-forest"
            >
              Admin
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-agriva-muted">
          New to Agriva?{' '}
          <Link to="/register" className="font-semibold text-agriva-forest hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

