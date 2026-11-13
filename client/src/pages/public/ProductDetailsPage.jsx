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
  ShoppingBag,
  Sparkles,
  Sprout,
  Star,
  Truck,
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useWishlist } from '../../context/WishlistContext';
import { EARTHORA_PRODUCTS } from '../../data/catalogData';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState(
    () => EARTHORA_PRODUCTS.find((p) => p.slug === id || p._id === id) || EARTHORA_PRODUCTS[0]
  );
  const [activeImage, setActiveImage] = useState(product?.image);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([
    {
      _id: 'r1',
      userName: 'Claire Bennett',
      rating: 5,
      comment: 'Top-tier quality and vigorous germination. Arrived securely packed in eco-insulated compostable lining.',
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
        const local = EARTHORA_PRODUCTS.find((p) => p.slug === id || p._id === id);
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
    brand: 'EARTHORA',
    product: product.name,
    originCode: product.originCode || product._id,
    supplier: product.supplierName || 'Earthora Verified Partner Farm',
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
      showToast('Thank you! Your verified grower review has been published.', 'success');
      setReviewForm({ rating: 5, comment: '' });
    } catch {
      setReviews((prev) => [
        {
          _id: `rev-${Date.now()}`,
          userName: user?.name || 'Verified Grower',
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ]);
      showToast('Review recorded.', 'success');
      setReviewForm({ rating: 5, comment: '' });
    }
  };

  return (
    <div className="bg-earthora-ivory min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-earthora-forest hover:text-earthora-mint mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Images */}
          <div className="space-y-4 lg:col-span-6">
            <div className="overflow-hidden rounded-3xl border border-earthora-sand/80 bg-white shadow-md">
              <img
                src={activeImage || product.image || '/assets/img/products/heirloom-tomatoes.jpg'}
                alt={product.name}
                className="aspect-[4/3] w-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/assets/img/products/heirloom-tomatoes.jpg';
                }}
              />
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-3">
                {gallery.map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`overflow-hidden rounded-xl border-2 ${
                      activeImage === img ? 'border-earthora-forest' : 'border-earthora-sand'
                    }`}
                  >
                    <img src={img} alt={product.name} className="h-16 w-20 object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* QR Origin Code Traceability Box */}
            <div className="rounded-2xl border border-earthora-sand/60 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-earthora-forest">
                <QrCode className="h-4 w-4 text-earthora-olive" />
                <span>On-Field Traceability QR</span>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="rounded-xl border border-earthora-sand/50 bg-white p-2">
                  <QRCodeSVG value={originPayload} size={80} fgColor="#0D2B1D" />
                </div>
                <div className="text-xs text-earthora-muted">
                  <p className="font-bold text-earthora-forest font-mono">{product.originCode || 'ETH-VERIFIED'}</p>
                  <p className="text-[11px] mt-0.5">Scanned by cold-chain inspectors before departure.</p>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1">100% Zero Synthetic Inputs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6 lg:col-span-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-earthora-forest px-3 py-1 text-xs font-bold text-earthora-mint">
                  {product.categoryLabel || 'Marketplace Item'}
                </span>
                {(product.certifications || ['USDA Organic']).map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1 rounded-full border border-earthora-sand bg-white px-2.5 py-0.5 text-xs font-medium text-emerald-800"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    {cert}
                  </span>
                ))}
              </div>

              <h1 className="mt-4 font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-earthora-forest tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="mt-3 flex items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1 font-bold text-earthora-forest">
                  <Star className="h-4 w-4 fill-earthora-gold text-earthora-gold" />
                  {(product.rating || 4.9).toFixed(1)} ({reviews.length} verified reviews)
                </span>
                <span className="text-earthora-sand">·</span>
                <span className={product.stock > 0 ? 'font-semibold text-emerald-700' : 'font-semibold text-red-600'}>
                  {product.stock > 0 ? `${product.stock} units available` : 'Currently Sold Out'}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-heading text-3xl font-extrabold text-earthora-forest">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-earthora-muted line-through">
                  ${Number(product.compareAtPrice).toFixed(2)}
                </span>
              )}
              <span className="text-xs text-earthora-muted">/ {product.unit || 'unit'}</span>
            </div>

            <p className="text-xs leading-relaxed text-earthora-muted">
              {product.description || product.shortDescription}
            </p>

            {/* Source info */}
            {product.supplierName && (
              <div className="rounded-2xl border border-earthora-sand/60 bg-earthora-sand/20 p-4 text-xs">
                <span className="text-earthora-muted">Ecosystem Producer:</span>
                <p className="font-bold text-earthora-forest mt-0.5">{product.supplierName}</p>
                <p className="text-[11px] text-earthora-olive mt-0.5">82% of sale proceeds distributed directly to grower account.</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center rounded-xl border border-earthora-sand bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 text-earthora-charcoal hover:bg-earthora-ivory"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-xs font-bold text-earthora-forest">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 text-earthora-charcoal hover:bg-earthora-ivory"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(product, quantity);
                  showToast(`Added ${quantity} × ${product.name} to cart.`, 'success');
                }}
                className="btn-accent flex items-center gap-2 text-xs font-bold py-3 px-6 shadow-md shadow-earthora-mint/20"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Agricultural Cart
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleWishlist(product);
                  showToast(wishlisted ? 'Removed from saved items.' : 'Saved to wishlist.', 'info');
                }}
                className={`rounded-xl border p-3 transition-colors ${
                  wishlisted
                    ? 'border-rose-400 bg-rose-50 text-rose-600'
                    : 'border-earthora-sand bg-white text-earthora-charcoal hover:bg-earthora-ivory'
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`h-5 w-5 ${wishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t border-earthora-sand/60 pt-12">
          <h2 className="font-heading text-2xl font-bold text-earthora-forest">Grower Reviews &amp; Field Trials</h2>

          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            {/* Reviews List */}
            <div className="space-y-4 lg:col-span-7">
              {reviews.map((rev) => (
                <div key={rev._id} className="card-surface p-5 border border-earthora-sand/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-earthora-forest">{rev.userName}</span>
                    <span className="text-[10px] text-earthora-muted">{rev.createdAt}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-earthora-gold">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-earthora-gold" />
                    ))}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-earthora-charcoal">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Leave Review Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleReviewSubmit} className="card-surface p-6 border border-earthora-sand/80 shadow-sm space-y-4">
                <h3 className="font-heading text-sm font-bold text-earthora-forest">Write Field Review</h3>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Rating (1 to 5 Stars)</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                    className="input-field mt-1 text-xs"
                  >
                    <option value={5}>5 Stars - Exceptional</option>
                    <option value={4}>4 Stars - Great Results</option>
                    <option value={3}>3 Stars - Standard</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Field Observation Notes *</label>
                  <textarea
                    rows="3"
                    required
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="Describe crop response, soil moisture integration, or germination rate..."
                    className="input-field mt-1 text-xs"
                  />
                </div>

                <button type="submit" className="btn-accent text-xs font-bold w-full py-2.5">
                  Submit Field Review
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
