import { Link, useLocation, useParams } from 'react-router-dom';
import { CheckCircle2, Package } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="card-surface p-8 text-center sm:p-10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-agriva-mint text-agriva-forest">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-agriva-pine">
          Harvest Order Confirmed
        </span>
        <h1 className="mt-2 font-display text-3xl font-semibold text-agriva-ink">
          Thank You for Supporting Organic Farmers!
        </h1>
        <p className="mt-2 text-sm text-agriva-muted">
          Your order number is{' '}
          <strong className="rounded bg-agriva-oat px-2 py-0.5 text-agriva-forest">
            {orderNumber}
          </strong>
          . Our partner growers have received your harvest schedule.
        </p>

        {order && (
          <div className="mt-6 rounded-xl border border-agriva-line bg-agriva-cream p-4 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-agriva-muted">Total Paid</span>
              <strong className="text-agriva-ink">${Number(order.totalAmount).toFixed(2)}</strong>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-agriva-muted">Payment Status</span>
              <strong className="capitalize text-agriva-pine">{order.paymentStatus}</strong>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-agriva-muted">Current Stage</span>
              <strong className="capitalize text-agriva-ink">{order.status}</strong>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to={`/track-order?code=${encodeURIComponent(orderNumber)}`} className="btn-primary">
            <Package className="h-4 w-4" />
            Track Order Status
          </Link>
          <Link to="/products" className="btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

