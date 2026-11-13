import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ProductCard from '../../components/shop/ProductCard';
import { useWishlist } from '../../context/WishlistContext';

export default function WishlistPage() {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-agriva-oat text-agriva-earth">
          <Heart className="h-7 w-7" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-agriva-ink">Your Wishlist is Empty</h1>
        <p className="mt-2 text-sm text-agriva-muted">
          Save seasonal produce and favorite farm harvests here for quick reordering.
        </p>
        <Link to="/products" className="btn-primary mt-6">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-agriva-ink">Saved Harvests</h1>
      <p className="mt-1 text-sm text-agriva-muted">{items.length} saved organic items</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

