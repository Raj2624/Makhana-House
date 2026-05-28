'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, Ticket, Check, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    shippingPrice,
    discountAmount,
    couponApplied,
    couponError,
    cartTotal,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [promoMsg, setPromoMsg] = useState('');

  if (!isOpen) return null;

  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    if (!promoCode) return;
    setLoadingCoupon(true);
    setPromoMsg('');
    try {
      await applyCoupon(promoCode);
      setPromoMsg('Promo code applied successfully!');
      setPromoCode('');
    } catch (err) {
      setPromoMsg('');
    } finally {
      setLoadingCoupon(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        {/* Drawer Panel */}
        <div className="pointer-events-auto w-screen max-w-md bg-brand-light flex flex-col shadow-2xl border-l border-brand-sage/10">
          
          {/* Header */}
          <div className="px-6 py-6 border-b border-brand-sage/10 flex items-center justify-between bg-brand-dark text-brand-light">
            <h2 className="text-lg font-bold font-display uppercase tracking-wide flex items-center space-x-2">
              <span>Your Shopping Cart</span>
              <span className="text-xs bg-brand-gold text-brand-dark font-black px-2 py-0.5 rounded-full">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} Items
              </span>
            </h2>
            <button 
              onClick={onClose} 
              className="text-brand-light/80 hover:text-brand-gold transition-colors focus:outline-none"
            >
              <X size={22} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="h-24 w-24 rounded-full bg-brand-cream flex items-center justify-center text-brand-sage animate-pulse">
                  🛒
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-brand-dark">Your Cart is Puffy-Light!</h3>
                  <p className="text-sm text-brand-charcoal/70 mt-1 max-w-xs">
                    It looks like you haven&apos;t added any premium roasted snacks or seeds yet. Let&apos;s find some crunch!
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="inline-flex items-center space-x-1 bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark text-sm font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-md"
                >
                  <span>Explore Catalog</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.productId} 
                  className="flex items-center space-x-4 p-3 bg-white rounded-xl border border-brand-sage/10 shadow-sm hover:border-brand-sage/35 transition-all duration-200"
                >
                  {/* Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-lg border border-brand-sage/5 flex-shrink-0"
                  />

                  {/* Info details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-brand-dark truncate pr-2" title={item.name}>
                      {item.name}
                    </h4>
                    <p className="text-sm font-black text-brand-dark mt-0.5">
                      ₹{item.price}
                    </p>

                    {/* Quantity Selector controls */}
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center border border-brand-sage/20 rounded-md bg-brand-light">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 text-brand-dark hover:text-brand-gold transition-colors focus:outline-none"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-brand-dark">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 text-brand-dark hover:text-brand-gold transition-colors focus:outline-none"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-brand-charcoal/40 hover:text-red-600 transition-colors p-1.5"
                        title="Remove product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing Calculations & Coupon Form */}
          {cartItems.length > 0 && (
            <div className="border-t border-brand-sage/15 bg-brand-cream/40 px-6 py-6 space-y-6 flex-shrink-0">
              
              {/* Promo code form */}
              {!couponApplied ? (
                <form onSubmit={handlePromoSubmit} className="flex space-x-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-2.5 text-brand-sage" size={16} />
                    <input
                      type="text"
                      placeholder="ENTER PROMO CODE (e.g. WELCOME10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="w-full text-xs font-bold uppercase tracking-wider pl-9 pr-3 py-2.5 bg-white border border-brand-sage/20 rounded-lg focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loadingCoupon || !promoCode}
                    className="bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark px-4 py-2.5 rounded-lg text-xs font-black tracking-widest uppercase transition-all duration-300 disabled:opacity-50"
                  >
                    {loadingCoupon ? '...' : 'APPLY'}
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between p-3 bg-brand-dark/5 border border-brand-sage/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-brand-dark text-xs font-black">
                    <Check size={14} className="text-brand-dark" />
                    <span>COUPON &ldquo;{couponApplied}&rdquo; APPLIED</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-xs text-red-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Coupon messages */}
              {couponError && <p className="text-[11px] text-red-600 font-semibold">{couponError}</p>}
              {promoMsg && <p className="text-[11px] text-brand-dark font-semibold">{promoMsg}</p>}

              {/* Bill Details */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-brand-charcoal/70">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs font-semibold text-brand-dark">
                    <span>Discount</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-medium text-brand-charcoal/70">
                  <span>Shipping Fee</span>
                  <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
                </div>
                {shippingPrice > 0 && (
                  <p className="text-[10px] text-brand-sage font-medium text-right">
                    Add ₹{500 - cartSubtotal} more for FREE shipping!
                  </p>
                )}
                <hr className="my-2 border-brand-sage/15" />
                <div className="flex justify-between text-sm font-black text-brand-dark">
                  <span>Total Amount</span>
                  <span className="text-base text-brand-dark font-black">₹{cartTotal}</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full flex items-center justify-center space-x-2 bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark py-3.5 px-6 rounded-full font-black tracking-widest text-xs uppercase shadow-md transition-all duration-300"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
