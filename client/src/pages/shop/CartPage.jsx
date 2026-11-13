import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingBasket, Trash2 } from 'lucide-react';
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
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-agriva-oat text-agriva-forest">
          <ShoppingBasket className="h-7 w-7" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-agriva-ink">Your Harvest Basket is Empty</h1>
        <p className="mt-2 text-sm text-agriva-muted">
          Explore freshly picked organic vegetables, orchard fruits, raw honey, and heritage grains.
        </p>
        <Link to="/products" className="btn-primary mt-6">
          Browse Organic Produce
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-agriva-ink">Your Shopping Cart</h1>
      <p className="mt-1 text-sm text-agriva-muted">
        {summary.count} {summary.count === 1 ? 'item' : 'items'} harvested to order
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          {items.map(({ product, quantity }) => (
            <div
              key={product._id}
              className="card-surface flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-20 w-24 rounded-lg object-cover"
                />
                <div>
                  <Link
                    to={`/products/${product.slug || product._id}`}
                    className="font-display text-lg font-semibold text-agriva-ink hover:text-agriva-forest"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-agriva-muted">
                    ${Number(product.price).toFixed(2)} / {product.unit || '1 kg'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 sm:justify-end">
                <div className="inline-flex items-center rounded-lg border border-agriva-line bg-agriva-cream">
                  <button
                    type="button"
                    onClick={() => updateQuantity(product._id, quantity - 1)}
                    className="p-2 text-agriva-ink hover:bg-white"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(product._id, quantity + 1)}
                    className="p-2 text-agriva-ink hover:bg-white"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <span className="w-20 text-right font-semibold text-agriva-forest">
                  ${(product.price * quantity).toFixed(2)}
                </span>

                <button
                  type="button"
                  onClick={() => removeFromCart(product._id)}
                  className="rounded-lg p-2 text-agriva-muted hover:bg-red-50 hover:text-red-700"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="card-surface h-fit space-y-5 p-6 lg:col-span-4">
          <h2 className="font-display text-xl font-semibold text-agriva-ink">Order Summary</h2>

          <form onSubmit={handleCouponSubmit} className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Coupon (e.g. ORGANIC10)"
              className="input-field"
            />
            <button type="submit" className="btn-secondary shrink-0 px-4">
              Apply
            </button>
          </form>

          <div className="space-y-2.5 border-t border-agriva-line pt-4 text-sm">
            <div className="flex justify-between text-agriva-muted">
              <span>Subtotal</span>
              <span className="font-medium text-agriva-ink">${summary.subtotal.toFixed(2)}</span>
            </div>
            {coupon && (
              <div className="flex justify-between text-agriva-pine">
                <span>Discount ({coupon.code})</span>
                <span>-${summary.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-agriva-muted">
              <span>Chilled Delivery</span>
              <span className="font-medium text-agriva-ink">
                {summary.shipping === 0 ? 'Free' : `$${summary.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-agriva-line pt-3 text-base font-bold text-agriva-ink">
              <span>Total</span>
              <span className="text-agriva-forest">${summary.total.toFixed(2)}</span>
            </div>
          </div>

          <Link to="/checkout" className="btn-primary w-full py-3">
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>
    </div>
  );
}

