import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Clock,
  Lock,
  Mail,
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

  return (
    <div className="bg-earthora-ivory min-h-screen py-16 flex items-center justify-center px-4">
      <div className="card-surface w-full max-w-md border border-earthora-sand/80 p-8 shadow-xl sm:p-10">
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

        <h1 className="mt-7 font-heading text-3xl sm:text-4xl font-black text-earthora-forest tracking-tight">
          Sign In to Portal
        </h1>
        <p className="mt-1 text-xs text-earthora-muted">
          Access your farm telemetry, customer orders, expert consultations, or admin console.
        </p>

        {/* Quick Demo Fill Buttons for 1-Click Login */}
        <div className="mt-5 rounded-2xl border border-earthora-sand/70 bg-earthora-ivory/60 p-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-earthora-olive mb-2">
            Quick 1-Click Demo Credentials:
          </p>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@earthora.io');
                setPassword('Earthora123!');
              }}
              className="rounded-lg border border-earthora-forest/20 bg-white py-1.5 px-2 text-[11px] font-bold text-earthora-forest hover:bg-earthora-forest hover:text-white transition-all shadow-2xs text-center"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('farmer@earthora.io');
                setPassword('Earthora123!');
              }}
              className="rounded-lg border border-earthora-forest/20 bg-white py-1.5 px-2 text-[11px] font-bold text-earthora-forest hover:bg-earthora-forest hover:text-white transition-all shadow-2xs text-center"
            >
              🌱 Farmer
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('expert@earthora.io');
                setPassword('Earthora123!');
              }}
              className="rounded-lg border border-earthora-forest/20 bg-white py-1.5 px-2 text-[11px] font-bold text-earthora-forest hover:bg-earthora-forest hover:text-white transition-all shadow-2xs text-center"
            >
              🔬 Expert
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('customer@earthora.io');
                setPassword('Earthora123!');
              }}
              className="rounded-lg border border-earthora-forest/20 bg-white py-1.5 px-2 text-[11px] font-bold text-earthora-forest hover:bg-earthora-forest hover:text-white transition-all shadow-2xs text-center"
            >
              🛒 Customer
            </button>
          </div>
        </div>

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
