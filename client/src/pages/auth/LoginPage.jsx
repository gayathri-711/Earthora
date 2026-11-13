import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Clock,
  KeyRound,
  Lock,
  Mail,
  Shield,
  Sparkles,
  Sprout,
  UserCheck,
  Users,
} from 'lucide-react';
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
  const [approvalNotice, setApprovalNotice] = useState(null);

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
    setApprovalNotice(null);
    try {
      const loggedIn = await login(email, password);
      showToast(`Welcome back, ${loggedIn.name}!`, 'success');
      navigate(redirectForRole(loggedIn.role), { replace: true });
    } catch (err) {
      const msg = err.message || 'Invalid credentials';
      if (msg.toLowerCase().includes('pending administrator approval') || msg.toLowerCase().includes('approval')) {
        setApprovalNotice(msg);
      } else {
        showToast(msg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setApprovalNotice(null);
  };

  return (
    <div className="bg-earthora-ivory min-h-screen py-16 flex items-center justify-center px-4">
      <div className="card-surface w-full max-w-md border border-earthora-sand/80 p-8 shadow-xl sm:p-10">
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

        {/* Approval notice banner if expert is awaiting admin acceptance */}
        {approvalNotice && (
          <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 shadow-sm animate-fade-in">
            <div className="flex items-start gap-2.5">
              <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">Expert Approval Pending</p>
                <p className="mt-1 text-[11px] text-amber-800 leading-relaxed">
                  {approvalNotice}
                </p>
              </div>
            </div>
          </div>
        )}

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

        {/* Fixed Administrator Notice & 1-Click Fill */}
        <div className="mt-8 rounded-2xl border border-purple-200 bg-purple-50/70 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-purple-700" />
              <span className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                Fixed Admin Credentials
              </span>
            </div>
            <span className="rounded-full bg-purple-200/80 px-2 py-0.5 text-[9px] font-extrabold uppercase text-purple-900">
              System Fixed
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="font-mono text-[11px] text-purple-900">
              <span className="font-semibold text-purple-950">admin@earthora.io</span> / <span className="text-purple-700 font-semibold">Earthora123!</span>
            </div>
            <button
              type="button"
              onClick={() => fillDemo('admin@earthora.io', 'Earthora123!')}
              className="rounded-lg bg-purple-700 px-3 py-1 text-[11px] font-bold text-white transition hover:bg-purple-800 shadow-sm"
            >
              Autofill Admin
            </button>
          </div>
        </div>

        {/* Normal Roles Demo Logins */}
        <div className="mt-4 rounded-2xl border border-earthora-sand/80 bg-earthora-sand/20 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-earthora-forest">
            <Sparkles className="h-3.5 w-3.5 text-earthora-gold" />
            Ecosystem Portals (1-Click Fill)
          </div>
          <p className="mt-1 text-[11px] text-earthora-muted">
            Prefill credentials for verified farmers, agronomists, or customer shoppers:
          </p>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('customer@earthora.io', 'Earthora123!')}
              className="flex flex-col items-center rounded-xl border border-earthora-sand bg-white p-2 text-center hover:border-earthora-forest hover:bg-earthora-ivory transition-colors"
            >
              <Users className="h-4 w-4 text-blue-600 mb-1" />
              <span className="text-[11px] font-bold text-earthora-forest">Customer</span>
              <span className="text-[9px] text-earthora-muted">Shopper</span>
            </button>

            <button
              type="button"
              onClick={() => fillDemo('farmer@earthora.io', 'Earthora123!')}
              className="flex flex-col items-center rounded-xl border border-earthora-sand bg-white p-2 text-center hover:border-earthora-forest hover:bg-earthora-ivory transition-colors"
            >
              <Sprout className="h-4 w-4 text-emerald-600 mb-1" />
              <span className="text-[11px] font-bold text-earthora-forest">Farmer</span>
              <span className="text-[9px] text-earthora-muted">Grower Hub</span>
            </button>

            <button
              type="button"
              onClick={() => fillDemo('expert@earthora.io', 'Earthora123!')}
              className="flex flex-col items-center rounded-xl border border-earthora-sand bg-white p-2 text-center hover:border-earthora-forest hover:bg-earthora-ivory transition-colors"
            >
              <UserCheck className="h-4 w-4 text-earthora-olive mb-1" />
              <span className="text-[11px] font-bold text-earthora-forest">Agronomist</span>
              <span className="text-[9px] text-earthora-muted">Approved</span>
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
