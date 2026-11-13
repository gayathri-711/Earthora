import { Link, useLocation, useParams } from 'react-router-dom';
import { CheckCircle2, Package, Sprout } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="bg-earthora-ivory min-h-screen py-20 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="card-surface p-8 text-center sm:p-12 border border-earthora-sand/80 shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-earthora-olive">
            Dispatch Scheduled
          </span>
          <h1 className="mt-2 font-heading text-3xl font-extrabold text-earthora-forest sm:text-4xl">
            Thank You for Supporting Living Soil!
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-earthora-muted max-w-md mx-auto">
            Your tracking code is{' '}
            <strong className="rounded-lg bg-earthora-sand/40 px-2.5 py-1 text-earthora-forest font-mono">
              {orderNumber}
            </strong>
            . Partner farms have received your fulfillment ticket and begun cold-chain packing.
          </p>

          {order && (
            <div className="mt-6 rounded-2xl border border-earthora-sand/60 bg-earthora-sand/20 p-5 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-earthora-muted">Total Amount</span>
                <strong className="text-earthora-forest text-sm font-bold">
                  ₹{Number(order.totalAmount).toFixed(2)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-earthora-muted">Payment Method &amp; Status</span>
                <strong className="capitalize text-emerald-800">
                  {order.paymentMethod} · {order.paymentStatus}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-earthora-muted">Fulfillment Stage</span>
                <strong className="capitalize text-earthora-charcoal">{order.status}</strong>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to={`/track-order?code=${encodeURIComponent(orderNumber)}`}
              className="btn-accent flex items-center gap-2 text-xs shadow-md shadow-earthora-mint/20"
            >
              <Package className="h-4 w-4" />
              Track Cold-Chain Dispatch
            </Link>
            <Link to="/marketplace" className="btn-secondary text-xs">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
