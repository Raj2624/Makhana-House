'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const ProductCard = ({ product }) => {
  const { user, toggleWishlist } = useAuth();
  const { addToCart } = useCart();

  // Determine if item is in user wishlist
  const isWishlisted = user?.wishlist?.includes(product._id);

  // Calculate discount percentage
  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-brand-sage/10 bg-white shadow-sm hover:border-brand-sage/35 hover:shadow-md transition-all duration-300">
      
      {/* Upper image area */}
      <Link href={`/shop/${product._id}`} className="relative block overflow-hidden bg-brand-cream/20 aspect-square">
        
        {/* Wishlist Button upper right */}
        <button
          onClick={handleWishlistToggle}
          className="absolute right-3 top-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-brand-dark shadow-sm border border-brand-sage/5 hover:bg-brand-gold hover:text-brand-dark hover:scale-105 transition-all duration-200"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            size={16} 
            className={isWishlisted ? "fill-red-600 text-red-600" : "text-brand-dark"} 
          />
        </button>

        {/* Discount Badge upper left */}
        {discountPercent > 0 && (
          <span className="absolute left-3 top-3 z-10 bg-brand-gold text-brand-dark text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        {/* Stock Status Badge */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-brand-dark/50 z-10 flex items-center justify-center text-brand-light font-black tracking-widest text-xs uppercase">
            Out of Stock
          </div>
        )}

        {/* Product Image with scaling on hover */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover quick add overlay bar */}
        {product.stock > 0 && (
          <div className="absolute inset-x-0 bottom-0 bg-brand-dark/90 backdrop-blur-sm p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out hidden sm:flex items-center justify-center space-x-2">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center space-x-2 bg-brand-gold text-brand-dark hover:bg-brand-light hover:text-brand-dark py-2 px-4 rounded-full font-bold text-xs uppercase transition-colors"
            >
              <ShoppingCart size={13} />
              <span>Add To Cart</span>
            </button>
          </div>
        )}
      </Link>

      {/* Info Details Section */}
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-sage">
          {product.category}
        </span>
        
        <Link href={`/shop/${product._id}`} className="mt-1 block">
          <h3 className="text-sm font-bold text-brand-dark leading-tight line-clamp-2 hover:text-brand-gold transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Star Rating summary */}
        <div className="flex items-center space-x-1.5 mt-2">
          <div className="flex text-brand-gold">
            <Star size={12} className="fill-brand-gold text-brand-gold" />
          </div>
          <span className="text-[11px] font-bold text-brand-dark">
            {product.rating}
          </span>
          <span className="text-[10px] font-medium text-brand-charcoal/50">
            ({product.reviewsCount} reviews)
          </span>
        </div>

        {/* Pricing tag block */}
        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-base font-black text-brand-dark">
              ₹{product.price}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs font-medium text-brand-charcoal/40 line-through">
                ₹{product.compareAtPrice}
              </span>
            )}
          </div>
        </div>

        {/* Mobile quick add button - always visible on mobile */}
        {product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="w-full mt-4 sm:hidden flex items-center justify-center space-x-1.5 bg-brand-dark text-brand-light py-2.5 rounded-xl text-xs font-bold uppercase transition-colors"
          >
            <ShoppingCart size={12} />
            <span>Add To Cart</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
