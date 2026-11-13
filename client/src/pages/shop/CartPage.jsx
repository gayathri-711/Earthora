import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { items, coupon, summary, updateQuantity, removeFromCart, applyCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-earthora-ivory min-h-screen py-24 px-4 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-earthora-sand/40 text-earthora-forest">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-earthora-forest">Your Cart is Empty</h1>
        <p className="mt-2 text-xs text-earthora-muted max-w-md mx-auto">
          Explore certified heirloom seeds, biological compost, smart LoRaWAN drip controllers, and fresh farm harvests in the Earthora Marketplace.
        </p>
        <Link to="/marketplace" className="btn-accent mt-6 inline-flex text-xs">
          Explore Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-earthora-ivory min-h-screen py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-extrabold text-earthora-forest">Agricultural Cart</h1>
        <p className="mt-1 text-xs text-earthora-muted">
          {summary.count} {summary.count === 1 ? 'item' : 'items'} scheduled for order fulfillment
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Items List */}
          <div className="space-y-4 lg:col-span-8">
            {items.map(({ product, quantity }) => (
              <div
                key={product._id}
                className="card-surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between border border-earthora-sand/80"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-20 w-24 rounded-xl object-cover border border-earthora-sand/50"
                  />
                  <div>
                    <Link
                      to={`/marketplace?search=${encodeURIComponent(product.name)}`}
                      className="font-heading text-base font-bold text-earthora-forest hover:text-earthora-mint"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-earthora-muted">
                      ${Number(product.price).toFixed(2)} / {product.unit || 'unit'}
                    </p>
                    {product.supplierName && (
                      <p className="text-[11px] text-earthora-olive font-medium mt-0.5">
                        Source: {product.supplierName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  <div className="inline-flex items-center rounded-xl border border-earthora-sand bg-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product._id, quantity - 1)}
                      className="p-2 text-earthora-charcoal hover:bg-earthora-ivory"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-earthora-forest">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product._id, quantity + 1)}
                      className="p-2 text-earthora-charcoal hover:bg-earthora-ivory"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="w-20 text-right font-heading text-base font-bold text-earthora-forest">
                    ${(product.price * quantity).toFixed(2)}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFromCart(product._id)}
                    className="rounded-xl p-2 text-earthora-muted hover:bg-red-50 hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Column */}
          <div className="lg:col-span-4">
            <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm">
              <h2 className="font-heading text-lg font-bold text-earthora-forest">Order Summary</h2>

              <dl className="mt-4 space-y-3 text-xs text-earthora-charcoal">
                <div className="flex justify-between">
                  <dt className="text-earthora-muted">Subtotal</dt>
                  <dd className="font-semibold">${summary.subtotal.toFixed(2)}</dd>
                </div>

                {coupon && (
                  <div className="flex justify-between text-emerald-700">
                    <dt>Discount ({coupon.code})</dt>
                    <dd className="font-semibold">-${summary.discount.toFixed(2)}</dd>
                  </div>
                )}

                <div className="flex justify-between">
                  <dt className="text-earthora-muted">Cold-Chain Eco-Shipping</dt>
                  <dd className="font-semibold">
                    {summary.shipping === 0 ? (
                      <span className="text-emerald-700 font-bold">Free (Over $50)</span>
                    ) : (
                      `$${summary.shipping.toFixed(2)}`
                    )}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-earthora-muted">Estimated Tax</dt>
                  <dd className="font-semibold">${summary.tax.toFixed(2)}</dd>
                </div>

                <div className="border-t border-earthora-sand pt-3 flex justify-between font-heading text-base font-extrabold text-earthora-forest">
                  <dt>Total</dt>
                  <dd>${summary.total.toFixed(2)}</dd>
                </div>
              </dl>

              {/* Coupon Form */}
              <form onSubmit={handleCouponSubmit} className="mt-6 flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Promo (e.g. ORGANIC10)"
                  className="input-field text-xs uppercase flex-1"
                />
                <button type="submit" className="btn-secondary text-xs px-3">
                  Apply
                </button>
              </form>

              <Link
                to="/checkout"
                className="btn-accent mt-6 flex w-full items-center justify-center gap-2 text-xs font-bold py-3 shadow-md shadow-earthora-mint/20"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
