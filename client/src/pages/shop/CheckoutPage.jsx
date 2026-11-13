import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ShieldCheck, Truck } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuth();
  const { items = [], coupon, summary, clearCart } = useCart();
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

  const validItems = (items || []).filter((i) => i && i.product && typeof i.product === 'object');

  if (validItems.length === 0) {
    return (
      <div className="bg-earthora-ivory min-h-screen py-24 px-4 text-center">
        <h1 className="font-heading text-3xl font-extrabold text-earthora-forest">Nothing to Checkout</h1>
        <p className="mt-2 text-xs text-earthora-muted">Add agricultural inputs or fresh harvests to your cart first.</p>
        <Link to="/marketplace" className="btn-accent mt-6 inline-flex text-xs font-bold py-2.5 px-6">
          Explore Marketplace
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      items: validItems.map((i) => ({
        productId: i.product._id || i.product.slug,
        slug: i.product.slug || '',
        name: i.product.name,
        price: Number(i.product.price) || 0,
        quantity: Number(i.quantity) || 1,
        image: i.product.image || '',
      })),
      shippingAddress: shipping,
      paymentMethod,
      couponCode: coupon?.code || null,
      subtotal: summary?.subtotal ?? 0,
      discount: summary?.discount ?? 0,
      shippingFee: summary?.shipping ?? 0,
      totalAmount: summary?.total ?? 0,
    };

    try {
      const { data } = await api.post('/orders', payload);
      const created = data.data?.order;
      await clearCart();
      showToast('Order confirmed! Cold-chain dispatch scheduled.', 'success');
      navigate(`/order-confirmation/${created.orderNumber}`, { state: { order: created } });
    } catch (err) {
      if (!isAuthenticated) {
        showToast('Please sign in first to complete checkout.', 'error');
        navigate('/login', { state: { from: '/checkout' } });
      } else {
        showToast(err.message || 'Unable to place order. Please verify required fields.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const subtotal = summary?.subtotal ?? 0;
  const discount = summary?.discount ?? 0;
  const shippingFee = summary?.shipping ?? 0;
  const tax = summary?.tax ?? 0;
  const total = summary?.total ?? subtotal;

  return (
    <div className="bg-earthora-ivory min-h-screen py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-earthora-olive block mb-1">
          EARTHORA DIRECT-TRADE FULFILLMENT
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-earthora-forest tracking-tight">
          Order Checkout
        </h1>
        <p className="mt-1.5 text-xs text-earthora-muted font-medium">
          Complete delivery destination and secure payment to schedule direct farm fulfillment.
        </p>

        {!isAuthenticated && (
          <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900">
            Please{' '}
            <Link to="/login" state={{ from: '/checkout' }} className="font-bold underline text-earthora-forest">
              sign in
            </Link>{' '}
            or{' '}
            <Link to="/register" className="font-bold underline text-earthora-forest">
              create an account
            </Link>{' '}
            to preserve your order telemetry and live shipment tracking.
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Shipping Details */}
          <div className="space-y-6 lg:col-span-7">
            <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm space-y-4">
              <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-earthora-forest">
                <Truck className="h-5 w-5 text-earthora-olive" />
                Cold-Chain Delivery Address
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={shipping.fullName}
                    onChange={(e) => setShipping((s) => ({ ...s, fullName: e.target.value }))}
                    className="input-field mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={shipping.email}
                    onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))}
                    className="input-field mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={shipping.phone}
                    onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                    className="input-field mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Preferred Dispatch Window</label>
                  <select
                    value={shipping.deliverySlot}
                    onChange={(e) => setShipping((s) => ({ ...s, deliverySlot: e.target.value }))}
                    className="input-field mt-1 text-xs"
                  >
                    <option>Morning (7am – 11am)</option>
                    <option>Afternoon (12pm – 4pm)</option>
                    <option>Evening (5pm – 8pm)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-earthora-charcoal">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={shipping.street}
                    onChange={(e) => setShipping((s) => ({ ...s, street: e.target.value }))}
                    className="input-field mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">City *</label>
                  <input
                    type="text"
                    required
                    value={shipping.city}
                    onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                    className="input-field mt-1 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-earthora-charcoal">State *</label>
                    <input
                      type="text"
                      required
                      value={shipping.state}
                      onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value }))}
                      className="input-field mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-earthora-charcoal">ZIP Code *</label>
                    <input
                      type="text"
                      required
                      value={shipping.postalCode}
                      onChange={(e) => setShipping((s) => ({ ...s, postalCode: e.target.value }))}
                      className="input-field mt-1 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm space-y-4">
              <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-earthora-forest">
                <CreditCard className="h-5 w-5 text-earthora-olive" />
                Payment Method
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-earthora-forest bg-earthora-forest/5'
                      : 'border-earthora-sand bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-earthora-forest"
                  />
                  <div>
                    <p className="text-xs font-bold text-earthora-forest">Credit / Debit Card</p>
                    <p className="text-[10px] text-earthora-muted">Encrypted via Stripe / SSL</p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-earthora-forest bg-earthora-forest/5'
                      : 'border-earthora-sand bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-earthora-forest"
                  />
                  <div>
                    <p className="text-xs font-bold text-earthora-forest">Pay on Delivery</p>
                    <p className="text-[10px] text-earthora-muted">Cash / Card on arrival</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Cart Review Column */}
          <div className="space-y-6 lg:col-span-5">
            <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm">
              <h2 className="font-heading text-lg font-bold text-earthora-forest">Items in Order</h2>

              <div className="mt-4 max-h-60 space-y-3 overflow-y-auto divide-y divide-earthora-sand/40">
                {validItems.map((item, idx) => {
                  const product = item.product || {};
                  const price = Number(product.price) || 0;
                  const qty = Number(item.quantity) || 1;
                  const line = (price * qty).toFixed(2);
                  const image = product.image || '/assets/img/products/heirloom-tomatoes.jpg';
                  const name = product.name || 'Organic Produce';

                  return (
                    <div key={product._id || idx} className="flex items-center justify-between pt-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={image} alt={name} className="h-10 w-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-earthora-forest line-clamp-1">{name}</p>
                          <p className="text-[10px] text-earthora-muted">Qty: {qty} × ₹{price.toFixed(2)}</p>
                        </div>
                      </div>
                      <span className="font-bold text-earthora-forest">
                        ₹{line}
                      </span>
                    </div>
                  );
                })}
              </div>

              <dl className="mt-6 space-y-2 border-t border-earthora-sand/60 pt-4 text-xs text-earthora-charcoal">
                <div className="flex justify-between">
                  <dt className="text-earthora-muted">Subtotal</dt>
                  <dd className="font-semibold">₹{subtotal.toFixed(2)}</dd>
                </div>
                {coupon && (
                  <div className="flex justify-between text-emerald-700">
                    <dt>Discount ({coupon.code})</dt>
                    <dd className="font-semibold">-₹{discount.toFixed(2)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-earthora-muted">Cold-Chain Shipping</dt>
                  <dd className="font-semibold">₹{shippingFee.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-earthora-muted">Estimated Tax</dt>
                  <dd className="font-semibold">₹{tax.toFixed(2)}</dd>
                </div>
                <div className="border-t border-earthora-sand pt-3 flex justify-between font-heading text-base font-extrabold text-earthora-forest">
                  <dt>Total Amount</dt>
                  <dd>₹{total.toFixed(2)}</dd>
                </div>
              </dl>

              <button
                type="submit"
                disabled={submitting}
                className="btn-accent mt-6 w-full py-3 text-xs font-bold shadow-md shadow-earthora-mint/20"
              >
                {submitting ? 'Confirming Dispatch...' : 'Place Agricultural Order'}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-earthora-muted">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>256-bit encrypted checkout &amp; Earthora Verified Guarantee</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
