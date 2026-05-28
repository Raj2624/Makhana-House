'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Heart, ShoppingBag, Plus, Minus, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';
import API from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

const ProductDetail = ({ params }) => {
  const productId = params.id;
  const router = useRouter();
  
  const { user, toggleWishlist } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('benefits');
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/${productId}`);
        setProduct(res.data);
        setActiveImage(res.data.image);

        // Fetch related products of same category
        const catalogRes = await API.get('/products', {
          params: { category: res.data.category }
        });
        setRelatedProducts(catalogRes.data.filter(p => p._id !== productId).slice(0, 4));
      } catch (err) {
        console.error('Error fetching product details:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-dark"></div>
        <p className="text-xs text-brand-sage font-bold tracking-wider uppercase animate-pulse">Loading super crunch...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-black text-2xl text-brand-dark">Superfood Not Found</h2>
        <p className="text-sm text-brand-charcoal/60">The product you are trying to view does not exist or has been removed.</p>
        <button
          onClick={() => router.push('/shop')}
          className="bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark py-3 px-6 rounded-full font-bold text-xs uppercase transition-all duration-300"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const isWishlisted = user?.wishlist?.includes(product._id);
  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleWishlistToggle = async () => {
    if (!user) {
      alert('Please log in to add items to your wishlist!');
      return;
    }
    try {
      await toggleWishlist(product._id);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Breadcrumb navigation */}
      <div className="flex items-center space-x-2 text-xs font-bold text-brand-charcoal/50">
        <span className="hover:text-brand-dark cursor-pointer" onClick={() => router.push('/')}>Home</span>
        <ChevronRight size={10} />
        <span className="hover:text-brand-dark cursor-pointer" onClick={() => router.push('/shop')}>Shop</span>
        <ChevronRight size={10} />
        <span className="text-brand-dark truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* Main product gallery and purchase grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* Left Side: Images Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-brand-sage/10 shadow-sm">
            {discountPercent > 0 && (
              <span className="absolute left-4 top-4 z-10 bg-brand-gold text-brand-dark text-xs font-black px-3 py-1.5 rounded-full shadow">
                {discountPercent}% SAVINGS
              </span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Gallery thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto py-1">
              {product.images.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === imgUrl ? 'border-brand-dark shadow-sm' : 'border-brand-sage/10 hover:border-brand-sage/35'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgUrl} alt={`${product.name} gallery image ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-black tracking-widest text-brand-gold">
              {product.category} SUPERFOOD
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-display text-brand-dark leading-tight">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex text-brand-gold">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < Math.floor(product.rating) ? "fill-brand-gold text-brand-gold" : "text-brand-sage/20"} 
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-brand-dark">{product.rating}</span>
              <span className="text-xs text-brand-charcoal/40 font-medium">({product.reviewsCount} verified customer reviews)</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Price Block */}
          <div className="p-4 bg-brand-cream/30 rounded-2xl border border-brand-sage/10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-brand-charcoal/50 block font-medium">Price (Inclusive of all taxes)</span>
              <div className="flex items-baseline space-x-2.5">
                <span className="text-2xl font-black text-brand-dark">₹{product.price}</span>
                {product.compareAtPrice && (
                  <span className="text-sm font-semibold text-brand-charcoal/40 line-through">₹{product.compareAtPrice}</span>
                )}
              </div>
            </div>
            {discountPercent > 0 && (
              <span className="text-xs uppercase font-black tracking-wider text-brand-dark bg-brand-gold px-3 py-1.5 rounded-full shadow">
                Save ₹{product.compareAtPrice - product.price}
              </span>
            )}
          </div>

          {/* Quick Core Benefits Bullet list */}
          {product.benefits && product.benefits.length > 0 && (
            <ul className="space-y-2 text-xs font-medium text-brand-dark">
              {product.benefits.slice(0, 3).map((ben, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0" />
                  <span>{ben}</span>
                </li>
              ))}
            </ul>
          )}

          <hr className="border-brand-sage/10" />

          {/* Quantity selector and Cart buttons */}
          {product.stock > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-brand-sage/20 rounded-xl bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-brand-dark hover:text-brand-gold transition-colors focus:outline-none"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 font-bold text-brand-dark text-sm w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 text-brand-dark hover:text-brand-gold transition-colors focus:outline-none"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-[10px] text-brand-sage font-medium">({product.stock} units available in stock)</span>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center space-x-2 border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-light py-4 px-6 rounded-full font-black tracking-widest text-xs uppercase transition-all duration-300"
                >
                  <ShoppingBag size={14} />
                  <span>ADD TO CART</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark py-4 px-6 rounded-full font-black tracking-widest text-xs uppercase shadow-md transition-all duration-300"
                >
                  BUY IT NOW
                </button>
                
                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 ${
                    isWishlisted 
                      ? 'border-red-100 bg-red-50 text-red-600' 
                      : 'border-brand-sage/20 text-brand-dark hover:border-brand-dark'
                  }`}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={20} className={isWishlisted ? "fill-red-600" : ""} />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-800">
              <ShieldAlert size={20} />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider">Out of Stock</h4>
                <p className="text-[10px] leading-relaxed mt-0.5">We are currently roasting a fresh batch. Check back in a few days or subscribe to notifications!</p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Tabs detailed panel segment: benefits, nutrition, ingredients */}
      <div className="bg-white border border-brand-sage/10 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Tab triggers */}
        <div className="flex border-b border-brand-sage/15 overflow-x-auto">
          {[
            { id: 'benefits', name: 'HEALTH BENEFITS' },
            { id: 'nutrition', name: 'NUTRITION FACTS' },
            { id: 'ingredients', name: '100% INGREDIENTS' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-6 text-xs font-black tracking-widest uppercase transition-all duration-200 border-b-2 flex-shrink-0 ${
                activeTab === tab.id
                  ? 'border-brand-dark text-brand-dark font-extrabold'
                  : 'border-transparent text-brand-charcoal/40 hover:text-brand-dark'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab contents */}
        <div className="min-h-[150px]">
          {activeTab === 'benefits' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.benefits && product.benefits.map((ben, i) => (
                <div key={i} className="flex items-start space-x-3 p-4 bg-brand-light/50 rounded-2xl border border-brand-sage/5">
                  <div className="w-5 h-5 rounded-full bg-brand-dark text-brand-gold flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed font-light">{ben}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'nutrition' && product.nutritionFacts && (
            <div className="max-w-md bg-brand-light p-6 rounded-2xl border border-brand-sage/10">
              <h3 className="font-display font-bold text-sm text-brand-dark uppercase tracking-widest border-b border-brand-sage/15 pb-2">
                Nutrition Information (per serving)
              </h3>
              
              <div className="mt-4 space-y-3">
                {Object.entries(product.nutritionFacts).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-xs py-1 border-b border-brand-sage/5 last:border-0 capitalize font-medium">
                    <span className="text-brand-charcoal/70">{key}</span>
                    <span className="text-brand-dark font-black">{val}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-brand-sage/75 mt-6 font-medium leading-relaxed">
                *Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
              </p>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-4 max-w-xl">
              <span className="inline-flex items-center space-x-1.5 bg-brand-sage/10 text-brand-dark font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                <Sparkles size={10} className="text-brand-gold" />
                <span>CLEAN LABEL GUARANTEE</span>
              </span>
              <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed font-light">
                {product.ingredients && product.ingredients.join(', ')}.
              </p>
              <p className="text-xs text-brand-sage font-medium mt-2 leading-relaxed">
                No added chemical preservatives, synthetic fillers, MSG or artificial colors. Contains only genuine high-grade superfoods and pure cooking elements.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Related Products catalog list */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8">
          <div className="text-center md:text-left space-y-1">
            <span className="text-xs uppercase font-black tracking-widest text-brand-gold">
              Complete Your Break
            </span>
            <h2 className="text-2xl font-black font-display text-brand-dark">
              You May Also Like
            </h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;
