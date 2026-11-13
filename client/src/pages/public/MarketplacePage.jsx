import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/client';
import {
  Apple,
  Check,
  Droplets,
  Filter,
  Layers,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Tractor,
  Truck,
} from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import ProductCard from '../../components/shop/ProductCard';
import { EARTHORA_PRODUCTS, MARKETPLACE_CATEGORIES } from '../../data/catalogData';

export default function MarketplacePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [productsList, setProductsList] = useState(EARTHORA_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [certifiedOnly, setCertifiedOnly] = useState(false);

  useEffect(() => {
    api
      .get('/products?limit=100')
      .then(({ data }) => {
        if (Array.isArray(data.data?.products) && data.data.products.length > 0) {
          setProductsList(data.data.products);
        }
      })
      .catch(() => {
        // Fallback to initial EARTHORA_PRODUCTS
      });
  }, []);

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'seeds':
        return <Sprout className="h-4 w-4" />;
      case 'fertilizers':
        return <Sparkles className="h-4 w-4" />;
      case 'equipment':
        return <Tractor className="h-4 w-4" />;
      case 'irrigation':
        return <Droplets className="h-4 w-4" />;
      case 'produce':
        return <Apple className="h-4 w-4" />;
      default:
        return <Layers className="h-4 w-4" />;
    }
  };

  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price <= maxPrice;
      const matchesCert =
        !certifiedOnly ||
        (product.certifications &&
          product.certifications.some((c) =>
            c.toLowerCase().includes('organic') || c.toLowerCase().includes('omri')
          ));

      return matchesCategory && matchesSearch && matchesPrice && matchesCert;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, maxPrice, certifiedOnly, sortBy]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMaxPrice(250);
    setCertifiedOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="bg-earthora-ivory min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-earthora-forest py-16 text-white sm:py-20">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/assets/img/hero/marketplace-hero.jpg"
            alt="Marketplace"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-earthora-forest via-earthora-forest/90 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-earthora-mint/40 bg-earthora-mint/15 px-4 py-1.5 text-xs sm:text-sm font-black tracking-[0.2em] text-earthora-mint uppercase shadow-xs">
              <Sprout className="h-4.5 w-4.5" />
              EARTHORA AGRICULTURAL MARKETPLACE
            </div>
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
              Agricultural Marketplace
            </h1>
            <p className="mt-4 text-base leading-relaxed text-earthora-sand/90 sm:text-lg">
              Direct-from-source agricultural inputs: certified non-hybrid seeds, biological fertilizers,
              precision IoT drip hardware, and nutrient-dense farm harvests.
            </p>
          </div>

          {/* Guarantee Badges */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <ShieldCheck className="h-5 w-5 text-earthora-mint shrink-0" />
              <span className="text-xs font-medium text-white">100% Tested Germination</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-earthora-gold shrink-0" />
              <span className="text-xs font-medium text-white">OMRI &amp; USDA Organic</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <Tractor className="h-5 w-5 text-emerald-300 shrink-0" />
              <span className="text-xs font-medium text-white">Direct Farm Revenue</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <Truck className="h-5 w-5 text-blue-300 shrink-0" />
              <span className="text-xs font-medium text-white">Cold-Chain Dispatch</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Area */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          {MARKETPLACE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-earthora-forest text-white shadow-lg shadow-earthora-forest/20'
                  : 'border border-earthora-sand bg-white text-earthora-charcoal hover:border-earthora-forest hover:bg-earthora-sand/20'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-8 rounded-2xl border border-earthora-sand/80 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-earthora-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search seeds, compost, IoT drip hardware, or fresh harvest..."
                className="w-full rounded-xl border border-earthora-sand bg-earthora-ivory/50 py-2.5 pl-10 pr-4 text-xs text-earthora-charcoal placeholder-earthora-muted focus:border-earthora-forest focus:bg-white focus:outline-none"
              />
            </div>

            {/* Price Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-earthora-charcoal whitespace-nowrap">
                Max Price: <strong className="text-earthora-forest">₹{maxPrice.toLocaleString('en-IN')}</strong>
              </span>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-32 accent-earthora-forest"
              />
            </div>

            {/* Certified Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={certifiedOnly}
                onChange={(e) => setCertifiedOnly(e.target.checked)}
                className="h-4 w-4 rounded border-earthora-sand text-earthora-forest focus:ring-earthora-forest"
              />
              <span className="text-xs font-semibold text-earthora-charcoal">
                Organic Certified Only
              </span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-earthora-muted">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-earthora-sand bg-white px-3 py-2 text-xs font-semibold text-earthora-charcoal focus:border-earthora-forest focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Reset Button */}
            {(selectedCategory !== 'all' || searchQuery || maxPrice < 250 || certifiedOnly) && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="mt-8 flex items-center justify-between text-xs font-semibold text-earthora-muted">
          <span>
            Showing <strong className="text-earthora-forest">{filteredProducts.length}</strong> verified agricultural items
          </span>
          {selectedCategory !== 'all' && (
            <span className="text-earthora-forest">
              Category: <strong>{MARKETPLACE_CATEGORIES.find((c) => c.id === selectedCategory)?.name}</strong>
            </span>
          )}
        </div>

        {/* Products Grid */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-earthora-sand bg-white p-16 text-center">
            <Sprout className="mx-auto h-12 w-12 text-earthora-muted/60" />
            <h4 className="mt-4 font-heading text-lg font-bold text-earthora-charcoal">
              No products found
            </h4>
            <p className="mt-1 text-xs text-earthora-muted">
              We couldn't find any products matching your active filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 rounded-xl bg-earthora-forest px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-earthora-olive"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

