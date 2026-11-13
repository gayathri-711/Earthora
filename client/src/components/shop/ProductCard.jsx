import { Link } from 'react-router-dom';
import { Heart, ShoppingBasket, Star, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product._id);
  const outOfStock = product.stock <= 0;

  return (
    <article className="card-surface group flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-soft">
      <div className="relative aspect-[4/3] overflow-hidden bg-agriva-oat">
        <Link to={`/products/${product.slug || product._id}`} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-[11px] font-semibold text-agriva-forest shadow-sm">
            <ShieldCheck className="h-3 w-3 text-agriva-leaf" />
            {product.certifications?.[0] || 'USDA Organic'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute right-3 top-3 rounded-lg border p-2 transition-colors ${
            wishlisted
              ? 'border-agriva-earth bg-agriva-earth text-white'
              : 'border-white/70 bg-white/90 text-agriva-ink hover:bg-white'
          }`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-agriva-muted">
          <span className="font-medium text-agriva-pine">{product.categoryLabel || product.category}</span>
          <span className="inline-flex items-center gap-1 font-medium text-agriva-ink">
            <Star className="h-3.5 w-3.5 fill-agriva-gold text-agriva-gold" />
            {(product.rating || 4.8).toFixed(1)}
          </span>
        </div>

        <Link
          to={`/products/${product.slug || product._id}`}
          className="mt-1.5 font-display text-lg font-semibold text-agriva-ink transition-colors hover:text-agriva-forest"
        >
          {product.name}
        </Link>

        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-agriva-muted">
          {product.shortDescription}
        </p>

        <p className="mt-2 text-xs text-agriva-muted">
          Grower:{' '}
          <span className="font-medium text-agriva-ink">
            {product.farmer?.farmName || product.farmerName || 'Agriva Partner Farm'}
          </span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-agriva-line/70 pt-3.5">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-agriva-forest">${Number(product.price).toFixed(2)}</span>
              {product.compareAtPrice && (
                <span className="text-xs text-agriva-muted line-through">
                  ${Number(product.compareAtPrice).toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-agriva-muted">{product.unit || '1 kg'}</span>
          </div>

          <button
            type="button"
            disabled={outOfStock}
            onClick={() => addToCart(product, 1)}
            className="btn-primary px-3.5 py-2 text-xs"
          >
            <ShoppingBasket className="h-3.5 w-3.5" />
            {outOfStock ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  );
}

