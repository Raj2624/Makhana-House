'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, Heart, RotateCcw } from 'lucide-react';
import API from '@/utils/api';
import ProductCard from '@/components/ProductCard';
import { useAuth } from '@/context/AuthContext';

const ShopContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  const categories = ['All', 'Makhana', 'Seeds', 'Trail Mixes', 'Dry Fruits', 'Protein Snacks'];

  // Read URL parameters on mount
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setActiveCategory(catParam);
    }
    const filterParam = searchParams.get('filter');
    if (filterParam === 'wishlist') {
      setShowWishlistOnly(true);
    }
  }, [searchParams]);

  // Fetch products from backend based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeCategory !== 'All') {
          params.category = activeCategory;
        }
        if (searchQuery) {
          params.search = searchQuery;
        }
        
        const res = await API.get('/products', { params });
        let list = res.data;

        // Apply local wishlist filtering if toggled
        if (showWishlistOnly) {
          list = list.filter(p => user?.wishlist?.includes(p._id));
        }

        // Apply local sorting
        if (sortBy === 'price-low') {
          list.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
          list.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
          list.sort((a, b) => b.rating - a.rating);
        }

        setProducts(list);
      } catch (err) {
        console.error('Failed to fetch products:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, searchQuery, sortBy, showWishlistOnly, user?.wishlist]);

  const handleClearFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setSortBy('default');
    setShowWishlistOnly(false);
    router.push('/shop');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black font-display text-brand-dark">
          {showWishlistOnly ? 'My Snack Wishlist' : 'Shop Premium Healthy Snacks'}
        </h1>
        <p className="text-xs sm:text-sm text-brand-charcoal/60 font-light">
          {showWishlistOnly 
            ? 'Your handpicked favorites ready to fuel your next nutritious snacking break.' 
            : 'Explore roasted foxnuts, power mixes, raw organic seeds, and rich protein clusters.'}
        </p>
      </div>

      {/* Interactive Controls Row */}
      <div className="bg-white border border-brand-sage/10 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-3.5 top-3 text-brand-sage" size={16} />
          <input
            type="text"
            placeholder="Search healthy snacks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold pl-10 pr-4 py-3 bg-brand-light border border-brand-sage/20 rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
          />
        </div>

        {/* Categories Tabs Row */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full lg:w-auto py-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setShowWishlistOnly(false);
              }}
              className={`flex-shrink-0 text-xs font-bold px-4 py-2.5 rounded-full border transition-all duration-200 ${
                activeCategory === cat && !showWishlistOnly
                  ? 'bg-brand-dark text-brand-light border-brand-dark shadow-sm'
                  : 'bg-brand-light text-brand-dark border-brand-sage/15 hover:border-brand-dark'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown & Wishlist toggle */}
        <div className="flex items-center space-x-4 w-full lg:w-auto justify-end">
          {/* Wishlist only button */}
          {user && (
            <button
              onClick={() => {
                setShowWishlistOnly(!showWishlistOnly);
                if (!showWishlistOnly) setActiveCategory('All');
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors ${
                showWishlistOnly 
                  ? 'bg-red-550 border-red-200 text-red-700 bg-red-50' 
                  : 'bg-white border-brand-sage/15 text-brand-charcoal hover:border-brand-dark'
              }`}
              title="Show wishlisted items only"
            >
              <Heart size={14} className={showWishlistOnly ? "fill-red-600 text-red-600" : ""} />
              <span>Wishlist</span>
            </button>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <SlidersHorizontal size={14} className="text-brand-sage" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold text-brand-dark border border-brand-sage/20 rounded-xl px-3 py-2.5 bg-brand-light focus:outline-none focus:border-brand-dark cursor-pointer"
            >
              <option value="default">Default Sort</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active filters display tags */}
      {(activeCategory !== 'All' || searchQuery || sortBy !== 'default' || showWishlistOnly) && (
        <div className="flex flex-wrap gap-2 items-center text-xs font-bold text-brand-charcoal/70">
          <span>Active Filters:</span>
          {activeCategory !== 'All' && (
            <span className="bg-brand-cream text-brand-dark px-3 py-1 rounded-full border border-brand-sage/10">
              Category: {activeCategory}
            </span>
          )}
          {searchQuery && (
            <span className="bg-brand-cream text-brand-dark px-3 py-1 rounded-full border border-brand-sage/10">
              Query: &ldquo;{searchQuery}&rdquo;
            </span>
          )}
          {showWishlistOnly && (
            <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-100">
              Wishlist Only
            </span>
          )}
          {sortBy !== 'default' && (
            <span className="bg-brand-cream text-brand-dark px-3 py-1 rounded-full border border-brand-sage/10">
              Sort: {sortBy}
            </span>
          )}
          <button
            onClick={handleClearFilters}
            className="flex items-center space-x-1 text-brand-gold hover:underline text-xs"
          >
            <RotateCcw size={12} />
            <span>Reset Filters</span>
          </button>
        </div>
      )}

      {/* Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-96 rounded-2xl bg-brand-cream/40 animate-pulse border border-brand-sage/5" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-brand-cream/25 border border-brand-sage/10 rounded-3xl space-y-4">
          <div className="text-4xl text-brand-sage">🍂</div>
          <h3 className="font-display font-bold text-xl text-brand-dark">No Snack Found</h3>
          <p className="text-xs text-brand-charcoal/60 max-w-sm mx-auto">
            We couldn&apos;t find any snacks matching your filter configurations. Try adjusting your keywords or clearing the active filters!
          </p>
          <button
            onClick={handleClearFilters}
            className="bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark text-xs font-black tracking-widest uppercase px-6 py-3 rounded-full shadow transition-all duration-300"
          >
            CLEAR SEARCH FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};

const Shop = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-dark"></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
};

export default Shop;
