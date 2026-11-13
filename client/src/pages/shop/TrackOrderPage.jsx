import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Package, Search, Sprout, Truck } from 'lucide-react';
import api from '../../api/client';
import SectionHeading from '../../components/common/SectionHeading';
import { useToast } from '../../context/ToastContext';

const STAGES = [
  { key: 'pending', label: 'Order Placed', icon: Package },
  { key: 'harvested', label: 'Harvested & Packed', icon: Sprout },
  { key: 'shipped', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [code, setCode] = useState(searchParams.get('code') || '');
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
      showToast(err.message || 'Order not found. Check your order number.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initial = searchParams.get('code');
    if (initial) {
      lookup(initial);
    }
  }, [searchParams]);

  const currentStageIndex = order
    ? Math.max(
        0,
        STAGES.findIndex((s) => s.key === order.status)
      )
    : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        align="center"
        eyebrow="Live Cold-Chain Tracking"
        title="Track Your Organic Harvest"
        subtitle="Enter your Agriva order number (e.g., AGR-2026-1001) to view real-time harvest and delivery milestones."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup(code);
        }}
        className="mx-auto mt-8 flex max-w-xl gap-2"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-agriva-muted" />
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="AGR-2026-1001"
            className="input-field pl-10"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary shrink-0">
          {loading ? 'Searching...' : 'Track Order'}
        </button>
      </form>

      {order && (
        <div className="card-surface mt-10 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-agriva-line pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-agriva-pine">
                Order #{order.orderNumber}
              </p>
              <p className="text-sm text-agriva-muted">
                Placed on {new Date(order.createdAt).toLocaleDateString()} · Total{' '}
                <strong className="text-agriva-ink">${Number(order.totalAmount).toFixed(2)}</strong>
              </p>
            </div>
            <span className="rounded-full bg-agriva-mint px-3 py-1 text-xs font-bold uppercase text-agriva-forest">
              {order.status}
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const active = idx <= currentStageIndex;
              return (
                <div
                  key={stage.key}
                  className={`rounded-xl border p-4 text-center ${
                    active
                      ? 'border-agriva-forest bg-agriva-mint/25 text-agriva-forest'
                      : 'border-agriva-line bg-agriva-cream text-agriva-muted'
                  }`}
                >
                  <Icon className="mx-auto h-6 w-6" />
                  <p className="mt-2 text-xs font-semibold">{stage.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

