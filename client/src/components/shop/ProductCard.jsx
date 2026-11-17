import { Link } from 'react-router-dom';
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product._id);
  const outOfStock = product.stock <= 0;

  const categoryColorMap = {
    seeds: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    fertilizers: 'bg-amber-100 text-amber-800 border-amber-200',
    equipment: 'bg-blue-100 text-blue-800 border-blue-200',
    irrigation: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    produce: 'bg-green-100 text-green-800 border-green-200',
  };

  const badgeClass = categoryColorMap[product.category] || 'bg-earthora-beige text-earthora-forest border-earthora-sand';

  return (
    <article className="card-surface group flex flex-col overflow-hidden hover:shadow-elevated">
      <div className="relative aspect-[4/3] overflow-hidden bg-earthora-beige/60">
        <Link to={`/marketplace/${product.slug || product._id}`} className="block h-full w-full">
          <img
            src={product.image || '/assets/img/products/heirloom-tomatoes.jpg'}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/assets/img/products/heirloom-tomatoes.jpg';
            }}
          />
        </Link>

        {/* Category Badge */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md ${badgeClass}`}>
            {product.categoryLabel || product.category}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute right-3 top-3 rounded-xl border p-2 transition-all ${
            wishlisted
              ? 'border-earthora-olive bg-earthora-olive text-white'
              : 'border-white/80 bg-white/90 text-earthora-charcoal hover:bg-white'
          }`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Only Product Name */}
        <Link
          to={`/marketplace/${product.slug || product._id}`}
          className="font-heading text-base font-bold text-earthora-forest transition-colors hover:text-emerald-700 leading-snug line-clamp-2"
        >
          {product.name}
        </Link>

        {/* View Details Option to Learn About the Product */}
        <div className="mt-2.5">
          <Link
            to={`/marketplace/${product.slug || product._id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-earthora-olive hover:text-earthora-forest transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-earthora-sand/70 pt-4 mt-4">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-earthora-forest">
                ₹{Number(product.price).toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-earthora-muted line-through">
                  ₹{Number(product.compareAtPrice).toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-earthora-muted">{product.unit || '1 unit'}</span>
          </div>

          <button
            type="button"
            disabled={outOfStock}
            onClick={() => addToCart(product, 1)}
            className="btn-primary px-3.5 py-2 text-xs"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
