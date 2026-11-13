import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Package, Search, Sprout, Truck } from 'lucide-react';
import api from '../../api/client';
import SectionHeading from '../../components/common/SectionHeading';
import { useToast } from '../../context/ToastContext';

const STAGES = [
  { key: 'pending', label: 'Order Confirmed', icon: Package },
  { key: 'harvested', label: 'Harvested & Tested', icon: Sprout },
  { key: 'shipped', label: 'In Cold-Chain Transit', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [code, setCode] = useState(searchParams.get('code') || 'ETH-2026-1001');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const lookup = async (orderNumber) => {
    const trimmed = orderNumber.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/track/${encodeURIComponent(trimmed)}`);
      setOrder(data.data.order);
    } catch (err) {
      setOrder(null);
      showToast(err.message || 'Order not found. Check your order code.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initial = searchParams.get('code');
    if (initial) {
      lookup(initial);
    } else {
      lookup('ETH-2026-1001');
    }
  }, [searchParams]);

  const currentStageIndex = order
    ? Math.max(
        0,
        STAGES.findIndex((s) => s.key === order.status)
      )
    : 1;

  return (
    <div className="bg-earthora-ivory min-h-screen py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          centered
          eyebrow="Cold-Chain Telemetry"
          title="Track Your Farm Order"
          description="Enter your Earthora tracking code (e.g. ETH-2026-1001) to view real-time harvest and dispatch status."
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            lookup(code);
          }}
          className="mx-auto mt-8 flex max-w-xl gap-2"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-earthora-muted" />
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ETH-2026-1001"
              className="input-field pl-10 text-xs font-mono"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-accent shrink-0 text-xs font-bold">
            {loading ? 'Tracking...' : 'Track Dispatch'}
          </button>
        </form>

        {order && (
          <div className="card-surface mt-10 p-6 sm:p-8 border border-earthora-sand/80 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-earthora-sand/60 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-earthora-forest font-mono">
                  Tracking Code: #{order.orderNumber}
                </p>
                <p className="text-xs text-earthora-muted mt-0.5">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} · Total{' '}
                  <strong className="text-earthora-forest">₹{Number(order.totalAmount).toFixed(2)}</strong>
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-800">
                {order.status}
              </span>
            </div>

            {/* Stages Pipeline */}
            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              {STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const done = idx <= currentStageIndex;
                const current = idx === currentStageIndex;

                return (
                  <div
                    key={stage.key}
                    className={`rounded-2xl border p-4 text-center transition-all ${
                      current
                        ? 'border-earthora-forest bg-earthora-forest/5 shadow-sm'
                        : done
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : 'border-earthora-sand/50 bg-earthora-ivory/40 opacity-50'
                    }`}
                  >
                    <div
                      className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${
                        done ? 'bg-earthora-forest text-white' : 'bg-earthora-sand/60 text-earthora-muted'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-earthora-forest">{stage.label}</p>
                    <p className="mt-1 text-[10px] text-earthora-muted">
                      {done ? (current ? 'In Progress' : 'Completed') : 'Pending'}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Shipping Destination */}
            {order.shippingAddress && (
              <div className="mt-8 rounded-2xl bg-earthora-ivory/60 p-5 text-xs border border-earthora-sand/50">
                <span className="font-bold uppercase tracking-wider text-earthora-forest">
                  Destination Coordinates
                </span>
                <p className="mt-1 font-semibold text-earthora-charcoal">
                  {order.shippingAddress.fullName} · {order.shippingAddress.phone}
                </p>
                <p className="text-earthora-muted">
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
