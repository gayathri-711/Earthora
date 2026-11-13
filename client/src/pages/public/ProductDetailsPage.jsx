import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft,
  Calendar,
  Heart,
  MapPin,
  Minus,
  Plus,
  QrCode,
  ShieldCheck,
  ShoppingBasket,
  Star,
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useWishlist } from '../../context/WishlistContext';
import { PRODUCTS } from '../../data/catalogData';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState(
    () => PRODUCTS.find((p) => p.slug === id || p._id === id) || PRODUCTS[0]
  );
  const [activeImage, setActiveImage] = useState(product?.image);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([
    {
      _id: 'r1',
      userName: 'Claire Bennett',
      rating: 5,
      comment: 'Arrived still cool from the morning harvest—incredible flavor and zero bruising.',
      createdAt: '2026-11-08',
    },
  ]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        if (data.data?.product) {
          setProduct(data.data.product);
          setActiveImage(data.data.product.image);
        }
        if (Array.isArray(data.data?.reviews)) {
          setReviews(data.data.reviews);
        }
      })
      .catch(() => {
        const local = PRODUCTS.find((p) => p.slug === id || p._id === id);
        if (local) {
          setProduct(local);
          setActiveImage(local.image);
        }
      });
  }, [id]);

  if (!product) return null;

  const wishlisted = isWishlisted(product._id);
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const originPayload = JSON.stringify({
    brand: 'AGRIVA',
    product: product.name,
    originCode: product.originCode || product._id,
    farm: product.farmer?.farmName || 'Agriva Partner Farm',
    harvestDate: product.harvestDate || '2026-11-11',
    certifications: product.certifications || ['USDA Organic'],
  });

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) return;
    try {
      const { data } = await api.post(`/products/${product._id}/reviews`, reviewForm);
      if (data.data?.review) {
        setReviews((prev) => [data.data.review, ...prev]);
      }
      showToast('Thank you! Your review has been published.');
      setReviewForm({ rating: 5, comment: '' });
    } catch {
      setReviews((prev) => [
        {
          _id: `rev-${Date.now()}`,
          userName: user?.name || 'Verified Customer',
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ]);
      showToast('Review added.');
      setReviewForm({ rating: 5, comment: '' });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-agriva-forest hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Marketplace
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-12">
        {/* Images */}
        <div className="space-y-3 lg:col-span-6">
          <div className="overflow-hidden rounded-2xl border border-agriva-line bg-white">
            <img
              src={activeImage || product.image}
              alt={product.name}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-3">
              {gallery.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`overflow-hidden rounded-lg border-2 ${
                    activeImage === img ? 'border-agriva-forest' : 'border-agriva-line'
                  }`}
                >
                  <img src={img} alt={product.name} className="h-16 w-20 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6 lg:col-span-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-agriva-mint/60 px-3 py-1 text-xs font-semibold text-agriva-forest">
                {product.categoryLabel || 'Certified Organic'}
              </span>
              {(product.certifications || ['USDA Organic']).map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center gap-1 rounded-full border border-agriva-line bg-white px-2.5 py-1 text-xs font-medium text-agriva-ink"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-agriva-leaf" />
                  {cert}
                </span>
              ))}
            </div>

            <h1 className="mt-3 font-display text-3xl font-semibold text-agriva-ink sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1 font-semibold text-agriva-ink">
                <Star className="h-4 w-4 fill-agriva-gold text-agriva-gold" />
                {(product.rating || 4.8).toFixed(1)} ({reviews.length} reviews)
              </span>
              <span className="text-agriva-muted">·</span>
              <span className={product.stock > 0 ? 'font-medium text-agriva-pine' : 'font-medium text-red-700'}>
                {product.stock > 0 ? `${product.stock} units in stock` : 'Currently Sold Out'}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-agriva-forest">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-base text-agriva-muted line-through">
                ${Number(product.compareAtPrice).toFixed(2)}
              </span>
            )}
            <span className="text-sm text-agriva-muted">/ {product.unit || '1 kg'}</span>
          </div>

          <p className="text-sm leading-relaxed text-agriva-muted">
            {product.description || product.shortDescription}
          </p>

          {/* Quantity & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-lg border border-agriva-line bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 text-agriva-ink hover:bg-agriva-oat"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                className="p-3 text-agriva-ink hover:bg-agriva-oat"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              disabled={product.stock <= 0}
              onClick={() => addToCart(product, quantity)}
              className="btn-primary flex-1 py-3"
            >
              <ShoppingBasket className="h-4 w-4" />
              Add to Cart
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`btn-secondary py-3 ${wishlisted ? 'border-agriva-earth text-agriva-earth' : ''}`}
              aria-label="Toggle wishlist"
            >
              <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Farmer + Origin QR Traceability */}
          <div className="grid gap-4 rounded-xl border border-agriva-line bg-white p-5 sm:grid-cols-12 sm:items-center">
            <div className="space-y-2 sm:col-span-8">
              <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-agriva-pine">
                <QrCode className="h-3.5 w-3.5" />
                Verified Farm Origin
              </p>
              <p className="font-display text-lg font-semibold text-agriva-ink">
                {product.farmer?.farmName || 'Agriva Partner Farm'}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-agriva-muted">
                <MapPin className="h-3.5 w-3.5 text-agriva-earth" />
                {product.farmer?.location || 'Regional Organic Hub'} · Grown by{' '}
                {product.farmer?.name || 'Partner Grower'}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-agriva-muted">
                <Calendar className="h-3.5 w-3.5 text-agriva-pine" />
                Harvested: <strong>{product.harvestDate?.slice(0, 10) || '2026-11-11'}</strong> · Batch{' '}
                <code className="rounded bg-agriva-oat px-1.5 py-0.5 text-[11px]">
                  {product.originCode || 'AGR-ORG-001'}
                </code>
              </p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border border-agriva-line bg-agriva-cream p-3 sm:col-span-4">
              <QRCodeSVG value={originPayload} size={88} fgColor="#1B4332" bgColor="#FBF8F1" />
              <span className="mt-1.5 text-[10px] font-medium text-agriva-muted">Scan Origin Passport</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16 border-t border-agriva-line pt-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <h2 className="font-display text-2xl font-semibold text-agriva-ink">
              Customer Reviews ({reviews.length})
            </h2>
            {reviews.map((rev) => (
              <div key={rev._id} className="card-surface p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-agriva-ink">{rev.userName || rev.user?.name}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} className="h-3.5 w-3.5 fill-agriva-gold text-agriva-gold" />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-agriva-muted">{rev.comment}</p>
                <p className="mt-2 text-[11px] text-agriva-muted">{rev.createdAt?.slice(0, 10)}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleReviewSubmit} className="card-surface h-fit space-y-4 p-6 lg:col-span-5">
            <h3 className="font-display text-xl font-semibold text-agriva-ink">Leave a Review</h3>
            {!isAuthenticated && (
              <p className="text-xs text-agriva-muted">
                <Link to="/login" className="font-semibold text-agriva-forest underline">
                  Sign in
                </Link>{' '}
                to link your review to your verified order profile.
              </p>
            )}
            <div>
              <label className="mb-1 block text-xs font-semibold text-agriva-ink">Rating</label>
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                className="input-field"
              >
                <option value={5}>5 Stars — Exceptional</option>
                <option value={4}>4 Stars — Very Fresh</option>
                <option value={3}>3 Stars — Good</option>
                <option value={2}>2 Stars — Fair</option>
                <option value={1}>1 Star — Needs Improvement</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-agriva-ink">Your Feedback</label>
              <textarea
                rows={4}
                required
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                placeholder="Share freshness, taste, and packaging feedback..."
                className="input-field"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Publish Review
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

