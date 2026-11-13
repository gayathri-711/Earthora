import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import api from '../../api/client';
import SectionHeading from '../../components/common/SectionHeading';
import ProductCard from '../../components/shop/ProductCard';
import { CATEGORIES, PRODUCTS } from '../../data/catalogData';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(PRODUCTS);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [maxPrice, setMaxPrice] = useState(25);
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    api
      .get('/products?limit=100')
      .then(({ data }) => {
        if (Array.isArray(data.data?.products) && data.data.products.length > 0) {
          setProducts(data.data.products);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = products.filter((p) => {
      const catSlug = typeof p.category === 'object' ? p.category.slug : p.category;
      const matchesCat = category === 'all' || catSlug === category;
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.shortDescription || '').toLowerCase().includes(q) ||
        (p.farmer?.farmName || '').toLowerCase().includes(q);
      const matchesPrice = Number(p.price) <= maxPrice;
      const matchesStock = !inStockOnly || p.stock > 0;
      return matchesCat && matchesSearch && matchesPrice && matchesStock;
    });

    if (sortBy === 'price-asc') return [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') return [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [products, category, search, maxPrice, sortBy, inStockOnly]);

  const handleCategoryChange = (slug) => {
    setCategory(slug);
    const next = new URLSearchParams(searchParams);
    if (slug === 'all') next.delete('category');
    else next.set('category', slug);
    setSearchParams(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Organic Marketplace"
        title="Fresh Seasonal Harvest Catalog"
        subtitle="Filter by category, price, availability, and grower—every item is certified organic and traceable."
      />

      {/* Filter & Search Bar */}
      <div className="card-surface mt-8 grid gap-4 p-4 lg:grid-cols-12 lg:items-center">
        <div className="relative lg:col-span-4">
          <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-agriva-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search produce or farm..."
            className="input-field pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:col-span-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleCategoryChange(cat.slug)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                category === cat.slug
                  ? 'bg-agriva-forest text-white'
                  : 'border border-agriva-line bg-agriva-cream text-agriva-muted hover:text-agriva-ink'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 lg:col-span-3 lg:justify-end">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-agriva-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field py-2 text-xs"
              aria-label="Sort products"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-agriva-line pt-3 lg:col-span-12">
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-agriva-pine" />
            <label className="text-xs font-semibold text-agriva-ink">
              Max Price: <span className="text-agriva-forest">${maxPrice}</span>
            </label>
            <input
              type="range"
              min="4"
              max="30"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-agriva-forest"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-agriva-ink">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 rounded accent-agriva-forest"
              />
              In stock only
            </label>
            <span className="text-xs text-agriva-muted">
              Showing <strong>{filtered.length}</strong> items
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-80 animate-pulse rounded-xl bg-agriva-oat" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-surface mt-10 p-12 text-center">
          <p className="font-display text-xl font-semibold text-agriva-ink">No matching produce found</p>
          <p className="mt-2 text-sm text-agriva-muted">
            Try clearing your search filter or raising the maximum price range.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCategory('all');
              setMaxPrice(30);
              setInStockOnly(false);
            }}
            className="btn-secondary mt-5"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

