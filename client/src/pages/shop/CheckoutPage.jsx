import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, Truck } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuth();
  const { items, coupon, summary, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    deliverySlot: 'Morning (7am – 11am)',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold text-agriva-ink">Nothing to Checkout</h1>
        <p className="mt-2 text-sm text-agriva-muted">Add fresh produce to your cart before checking out.</p>
        <Link to="/products" className="btn-primary mt-6">
          Shop Produce
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      items: items.map((i) => ({
        productId: i.product._id,
        slug: i.product.slug,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image,
      })),
      shippingAddress: shipping,
      paymentMethod,
      couponCode: coupon?.code || null,
      subtotal: summary.subtotal,
      discount: summary.discount,
      shippingFee: summary.shipping,
      totalAmount: summary.total,
    };

    try {
      const { data } = await api.post('/orders', payload);
      const created = data.data?.order;
      await clearCart();
      showToast('Order placed successfully!');
      navigate(`/order-confirmation/${created.orderNumber}`, { state: { order: created } });
    } catch (err) {
      if (!isAuthenticated) {
        showToast('Please sign in first to complete checkout.', 'error');
        navigate('/login', { state: { from: '/checkout' } });
      } else {
        showToast(err.message || 'Unable to place order. Please verify fields.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-agriva-ink">Checkout</h1>
      <p className="mt-1 text-sm text-agriva-muted">
        Complete your delivery details and payment method to schedule farm harvest dispatch.
      </p>

      {!isAuthenticated && (
        <div className="mt-4 rounded-xl border border-agriva-gold/40 bg-amber-50 p-4 text-sm text-amber-900">
          Please{' '}
          <Link to="/login" state={{ from: '/checkout' }} className="font-bold underline">
            sign in
          </Link>{' '}
          or{' '}
          <Link to="/register" className="font-bold underline">
            create an account
          </Link>{' '}
          to save your order history and live delivery tracking.
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="card-surface space-y-4 p-6">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-agriva-ink">
              <Truck className="h-5 w-5 text-agriva-forest" />
              Delivery Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  value={shipping.fullName}
                  onChange={(e) => setShipping((s) => ({ ...s, fullName: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Email</label>
                <input
                  type="email"
                  required
                  value={shipping.email}
                  onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Phone</label>
                <input
                  type="tel"
                  required
                  value={shipping.phone}
                  onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Preferred Delivery Window</label>
                <select
                  value={shipping.deliverySlot}
                  onChange={(e) => setShipping((s) => ({ ...s, deliverySlot: e.target.value }))}
                  className="input-field"
                >
                  <option>Morning (7am – 11am)</option>
                  <option>Afternoon (12pm – 4pm)</option>
                  <option>Evening (5pm – 8pm)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold">Street Address</label>
                <input
                  type="text"
                  required
                  value={shipping.street}
                  onChange={(e) => setShipping((s) => ({ ...s, street: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">City</label>
                <input
                  type="text"
                  required
                  value={shipping.city}
                  onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold">State</label>
                  <input
                    type="text"
                    required
                    value={shipping.state}
                    onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">ZIP</label>
                  <input
                    type="text"
                    required
                    value={shipping.postalCode}
                    onChange={(e) => setShipping((s) => ({ ...s, postalCode: e.target.value }))}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card-surface space-y-4 p-6">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-agriva-ink">
              <CreditCard className="h-5 w-5 text-agriva-forest" />
              Payment Method
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
                  paymentMethod === 'card'
                    ? 'border-agriva-forest bg-agriva-mint/25'
                    : 'border-agriva-line bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="accent-agriva-forest"
                />
                <div>
                  <p className="text-sm font-semibold text-agriva-ink">Online Card Payment</p>
                  <p className="text-xs text-agriva-muted">Instant verified sandbox checkout</p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
                  paymentMethod === 'cod'
                    ? 'border-agriva-forest bg-agriva-mint/25'
                    : 'border-agriva-line bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-agriva-forest"
                />
                <div>
                  <p className="text-sm font-semibold text-agriva-ink">Pay on Delivery</p>
                  <p className="text-xs text-agriva-muted">Cash or contactless terminal at door</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <aside className="card-surface h-fit space-y-4 p-6 lg:col-span-5">
          <h2 className="font-display text-xl font-semibold text-agriva-ink">Crate Summary</h2>
          <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
            {items.map(({ product, quantity }) => (
              <div key={product._id} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <img src={product.image} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div>
                    <p className="font-medium text-agriva-ink">{product.name}</p>
                    <p className="text-xs text-agriva-muted">Qty {quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-agriva-ink">
                  ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-agriva-line pt-4 text-sm">
            <div className="flex justify-between text-agriva-muted">
              <span>Subtotal</span>
              <span>${summary.subtotal.toFixed(2)}</span>
            </div>
            {summary.discount > 0 && (
              <div className="flex justify-between text-agriva-pine">
                <span>Coupon Discount</span>
                <span>-${summary.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-agriva-muted">
              <span>Delivery</span>
              <span>{summary.shipping === 0 ? 'Free' : `$${summary.shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between border-t border-agriva-line pt-3 text-base font-bold text-agriva-ink">
              <span>Total Due</span>
              <span className="text-agriva-forest">${summary.total.toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
            <Lock className="h-4 w-4" />
            {submitting ? 'Processing Order...' : `Confirm Order · $${summary.total.toFixed(2)}`}
          </button>
        </aside>
      </form>
    </div>
  );
}
