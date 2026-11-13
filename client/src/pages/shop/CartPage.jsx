import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, RotateCcw, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { items = [], coupon, summary, updateQuantity, removeFromCart, clearCart, applyCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
    }
  };

  const validItems = (items || []).filter((i) => i && i.product && typeof i.product === 'object');

  if (validItems.length === 0) {
    return (
      <div className="bg-earthora-ivory min-h-screen py-24 px-4 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-earthora-sand/40 text-earthora-forest">
          <ShoppingBag className="h-8 w-8 text-earthora-forest" />
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-earthora-forest">Your Cart is Empty</h1>
        <p className="mt-2 text-xs text-earthora-muted max-w-md mx-auto">
          Explore certified heirloom seeds, biological fertilizers, precision IoT drip hardware, and fresh farm harvests in the Earthora Marketplace.
        </p>
        <Link to="/marketplace" className="btn-accent mt-6 inline-flex text-xs font-bold py-2.5 px-6">
          Explore Marketplace
        </Link>
      </div>
    );
  }

  const subtotal = summary?.subtotal ?? 0;
  const discount = summary?.discount ?? 0;
  const shipping = summary?.shipping ?? 0;
  const tax = summary?.tax ?? 0;
  const total = summary?.total ?? subtotal;
  const count = summary?.count ?? validItems.length;

  return (
    <div className="bg-earthora-ivory min-h-screen py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-earthora-olive block mb-1">
              EARTHORA ORDER DISPATCH
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-earthora-forest tracking-tight">
              Agricultural Cart
            </h1>
            <p className="mt-1.5 text-xs text-earthora-muted font-medium">
              {count} {count === 1 ? 'item' : 'items'} scheduled for order fulfillment
            </p>
          </div>

          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 text-xs font-semibold text-earthora-muted hover:text-red-600 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear Cart
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Items List */}
          <div className="space-y-4 lg:col-span-8">
            {validItems.map((item, idx) => {
              const product = item.product || {};
              const productId = product._id || product.slug || `item-${idx}`;
              const price = Number(product.price) || 0;
              const quantity = Number(item.quantity) || 1;
              const lineTotal = (price * quantity).toFixed(2);
              const image = product.image || '/assets/img/products/heirloom-tomatoes.jpg';
              const name = product.name || 'Organic Agricultural Produce';

              return (
                <div
                  key={productId}
                  className="card-surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between border border-earthora-sand/80 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={image}
                      alt={name}
                      className="h-20 w-24 rounded-2xl object-cover border border-earthora-sand/50 shadow-sm"
                      onError={(e) => {
                        e.target.src = '/assets/img/products/heirloom-tomatoes.jpg';
                      }}
                    />
                    <div>
                      <Link
                        to={`/marketplace?search=${encodeURIComponent(name)}`}
                        className="font-heading text-base font-bold text-earthora-forest hover:text-earthora-mint transition-colors"
                      >
                        {name}
                      </Link>
                      <p className="text-xs text-earthora-muted mt-0.5">
                        ₹{price.toFixed(2)} / {product.unit || 'unit'}
                      </p>
                      {product.supplierName && (
                        <p className="text-[11px] text-earthora-olive font-medium mt-0.5">
                          Producer: {product.supplierName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-6 sm:justify-end">
                    {/* Quantity Controls */}
                    <div className="inline-flex items-center rounded-xl border border-earthora-sand bg-white shadow-sm">
                      <button
                        type="button"
                        onClick={() => updateQuantity(productId, quantity - 1)}
                        className="p-2 text-earthora-charcoal hover:bg-earthora-ivory transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-earthora-forest">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(productId, quantity + 1)}
                        className="p-2 text-earthora-charcoal hover:bg-earthora-ivory transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <span className="w-24 text-right font-heading text-base font-extrabold text-earthora-forest">
                      ₹{lineTotal}
                    </span>

                    {/* Remove Item */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(productId)}
                      className="rounded-xl p-2 text-earthora-muted hover:bg-red-50 hover:text-red-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="pt-2 flex items-center justify-between">
              <Link
                to="/marketplace"
                className="text-xs font-bold text-earthora-forest hover:text-earthora-mint underline"
              >
                ← Continue Shopping in Marketplace
              </Link>
            </div>
          </div>

          {/* Summary Column */}
          <div className="lg:col-span-4">
            <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm">
              <h2 className="font-heading text-lg font-bold text-earthora-forest">Order Summary</h2>

              <dl className="mt-4 space-y-3 text-xs text-earthora-charcoal">
                <div className="flex justify-between">
                  <dt className="text-earthora-muted">Subtotal</dt>
                  <dd className="font-semibold">₹{subtotal.toFixed(2)}</dd>
                </div>

                {coupon && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <dt>Discount ({coupon.code})</dt>
                    <dd>-₹{discount.toFixed(2)}</dd>
                  </div>
                )}

                <div className="flex justify-between">
                  <dt className="text-earthora-muted">Cold-Chain Eco-Shipping</dt>
                  <dd className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-emerald-700 font-bold">Free (Over ₹999)</span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-earthora-muted">Estimated Tax (5%)</dt>
                  <dd className="font-semibold">₹{tax.toFixed(2)}</dd>
                </div>

                <div className="border-t border-earthora-sand pt-3 flex justify-between font-heading text-base font-extrabold text-earthora-forest">
                  <dt>Total Amount</dt>
                  <dd>₹{total.toFixed(2)}</dd>
                </div>
              </dl>

              {/* Coupon Form */}
              <form onSubmit={handleCouponSubmit} className="mt-6 flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Promo (ORGANIC10)"
                  className="input-field text-xs uppercase flex-1"
                />
                <button type="submit" className="btn-secondary text-xs px-3 font-bold">
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
