import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, Sparkles, Sprout, UserCheck, Users } from 'lucide-react';
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
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'farmer') return '/dashboard/farmer';
    if (role === 'expert') return '/dashboard/expert';
    return '/dashboard/customer';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedIn = await login(email, password);
      showToast(`Welcome back, ${loggedIn.name}!`, 'success');
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
    <div className="bg-earthora-ivory min-h-screen py-16 flex items-center justify-center px-4">
      <div className="card-surface w-full max-w-md border border-earthora-sand/80 p-8 shadow-xl">
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

        <h1 className="mt-6 font-heading text-2xl font-extrabold text-earthora-forest">
          Sign In to Earthora
        </h1>
        <p className="mt-1 text-xs text-earthora-muted">
          Access your farm telemetry, customer orders, expert consultations, or admin console.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-earthora-charcoal">Email Address</label>
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-earthora-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="grower@earthora.io"
                className="input-field pl-10 text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-earthora-charcoal">Password</label>
              <span className="text-[11px] text-earthora-muted cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>
            <div className="relative mt-1">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-earthora-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-10 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-accent w-full py-3 text-xs font-bold shadow-md shadow-earthora-mint/20"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        {/* 4 Demo Roles Auto-fill */}
        <div className="mt-8 rounded-2xl border border-earthora-sand/80 bg-earthora-sand/20 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-earthora-forest">
            <Sparkles className="h-3.5 w-3.5 text-earthora-gold" />
            Quick Demo Logins (All 4 Roles)
          </div>
          <p className="mt-1 text-[11px] text-earthora-muted">
            Click any role below to prefill demo credentials:
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('farmer@earthora.io', 'Earthora123!')}
              className="flex items-center gap-2 rounded-xl border border-earthora-sand bg-white p-2 text-left hover:border-earthora-forest hover:bg-earthora-ivory"
            >
              <Sprout className="h-4 w-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-earthora-forest">Farmer</p>
                <p className="text-[9px] text-earthora-muted">Crops &amp; Harvest</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => fillDemo('expert@earthora.io', 'Earthora123!')}
              className="flex items-center gap-2 rounded-xl border border-earthora-sand bg-white p-2 text-left hover:border-earthora-forest hover:bg-earthora-ivory"
            >
              <UserCheck className="h-4 w-4 text-earthora-olive shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-earthora-forest">Agronomist</p>
                <p className="text-[9px] text-earthora-muted">Advisory &amp; Q&amp;A</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => fillDemo('customer@earthora.io', 'Earthora123!')}
              className="flex items-center gap-2 rounded-xl border border-earthora-sand bg-white p-2 text-left hover:border-earthora-forest hover:bg-earthora-ivory"
            >
              <Users className="h-4 w-4 text-blue-600 shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-earthora-forest">Customer</p>
                <p className="text-[9px] text-earthora-muted">Shop &amp; Bookings</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => fillDemo('admin@earthora.io', 'Earthora123!')}
              className="flex items-center gap-2 rounded-xl border border-earthora-sand bg-white p-2 text-left hover:border-earthora-forest hover:bg-earthora-ivory"
            >
              <Shield className="h-4 w-4 text-purple-600 shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-earthora-forest">Admin</p>
                <p className="text-[9px] text-earthora-muted">Full Ecosystem</p>
              </div>
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-earthora-muted">
          Don't have an Earthora account?{' '}
          <Link to="/register" className="font-bold text-earthora-forest underline hover:text-earthora-mint">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
