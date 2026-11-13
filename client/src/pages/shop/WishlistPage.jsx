import { Link } from 'react-router-dom';
import { Heart, Sprout } from 'lucide-react';
import ProductCard from '../../components/shop/ProductCard';
import { useWishlist } from '../../context/WishlistContext';

export default function WishlistPage() {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="bg-earthora-ivory min-h-screen py-24 px-4 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-earthora-sand/40 text-earthora-forest">
          <Heart className="h-8 w-8 text-rose-500" />
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-earthora-forest">Your Wishlist is Empty</h1>
        <p className="mt-2 text-xs text-earthora-muted max-w-md mx-auto">
          Save favorite heirloom seeds, organic amendments, IoT hardware, and fresh harvest produce for easy access.
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
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-earthora-olive block mb-1">
          EARTHORA SAVED FAVORITES
        </span>
        <div className="flex items-center gap-3">
          <Heart className="h-7 w-7 text-rose-500 fill-rose-500" />
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-earthora-forest tracking-tight">
            Saved Agricultural Items
          </h1>
        </div>
        <p className="mt-1.5 text-xs text-earthora-muted font-medium">{items.length} saved marketplace items</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
