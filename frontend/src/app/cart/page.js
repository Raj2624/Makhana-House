'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Plus, Minus, Ticket, Check, ChevronRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const CartPage = () => {
  const router = useRouter();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
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
  const [promoSuccessMsg, setPromoSuccessMsg] = useState('');

  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    if (!promoCode) return;
    setLoadingCoupon(true);
    setPromoSuccessMsg('');
    try {
      await applyCoupon(promoCode);
      setPromoSuccessMsg('Promo code applied successfully!');
      setPromoCode('');
    } catch (err) {
      setPromoSuccessMsg('');
    } finally {
      setLoadingCoupon(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="flex items-center space-x-3 border-b border-brand-sage/10 pb-6">
        <div className="h-10 w-10 rounded-full bg-brand-dark flex items-center justify-center text-brand-gold text-sm font-bold">
          🛒
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-brand-dark">Shopping Cart</h1>
          <p className="text-[11px] text-brand-sage font-semibold uppercase tracking-wider mt-0.5">Manage your selected snack treasures</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="py-20 text-center space-y-6 max-w-md mx-auto">
          <div className="h-28 w-28 rounded-full bg-brand-cream/60 flex items-center justify-center text-5xl mx-auto animate-bounce">
            🍪
          </div>
          <div>
            <h2 className="font-display font-black text-2xl text-brand-dark">Your Cart is Puffy-Light!</h2>
            <p className="text-xs sm:text-sm text-brand-charcoal/60 mt-1.5 leading-relaxed font-light">
              It looks like you haven&apos;t added any roasted foxnuts, nutrient-rich seed blends, or protein bars yet. Let&apos;s find your favorite desk crunch!
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark px-8 py-4 rounded-full font-black tracking-widest text-xs uppercase shadow transition-all duration-300"
          >
            <ShoppingBag size={14} />
            <span>EXPLORE SNACK CATALOG</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Column: Cart items table */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Labels desktop */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-4 border-b border-brand-sage/10 text-xs font-black uppercase tracking-wider text-brand-sage">
              <span className="col-span-6">Product Details</span>
              <span className="col-span-2 text-center">Unit Price</span>
              <span className="col-span-2 text-center">Quantity</span>
              <span className="col-span-2 text-right">Subtotal</span>
            </div>

            {/* List */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.productId}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-4 bg-white border border-brand-sage/10 rounded-2xl shadow-sm hover:border-brand-sage/30 transition-colors"
                >
                  {/* Photo & Name */}
                  <div className="sm:col-span-6 flex items-center space-x-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-xl border border-brand-sage/5 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <Link 
                        href={`/shop/${item.productId}`}
                        className="text-xs sm:text-sm font-bold text-brand-dark hover:text-brand-gold transition-colors leading-tight line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-[10px] text-red-600 font-semibold hover:underline flex items-center space-x-1 mt-1"
                      >
                        <Trash2 size={10} />
                        <span>Remove Item</span>
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="sm:col-span-2 text-center">
                    <span className="text-xs text-brand-charcoal/50 sm:hidden mr-1">Unit Price:</span>
                    <span className="text-xs sm:text-sm font-black text-brand-dark">₹{item.price}</span>
                  </div>

                  {/* Qty Selector */}
                  <div className="sm:col-span-2 flex justify-center">
                    <div className="flex items-center border border-brand-sage/20 rounded-xl bg-brand-light p-0.5">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1.5 text-brand-dark hover:text-brand-gold transition-colors focus:outline-none"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="px-2 font-bold text-brand-dark text-xs w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1.5 text-brand-dark hover:text-brand-gold transition-colors focus:outline-none"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>

                  {/* Total amount */}
                  <div className="sm:col-span-2 text-right">
                    <span className="text-xs text-brand-charcoal/50 sm:hidden mr-1">Subtotal:</span>
                    <span className="text-xs sm:text-sm font-black text-brand-dark">₹{item.price * item.quantity}</span>
                  </div>

                </div>
              ))}
            </div>

            {/* Core Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-brand-sage/10 text-xs font-bold">
              <Link 
                href="/shop"
                className="flex items-center space-x-1 text-brand-dark hover:text-brand-gold transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Continue Snacky Sourcing</span>
              </Link>
              <button
                onClick={clearCart}
                className="text-brand-charcoal/50 hover:text-red-600 transition-colors uppercase tracking-wider text-[11px]"
              >
                Purge All Selected Items
              </button>
            </div>

          </div>

          {/* Right Column: Pricing Summary */}
          <div className="space-y-6">
            
            <div className="bg-white border border-brand-sage/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-base text-brand-dark uppercase tracking-widest border-b border-brand-sage/10 pb-4">
                Order Bill Summary
              </h3>

              {/* Promo input code form */}
              {!couponApplied ? (
                <form onSubmit={handlePromoSubmit} className="space-y-2">
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Ticket className="absolute left-3 top-2.5 text-brand-sage" size={14} />
                      <input
                        type="text"
                        placeholder="PROMO CODE (e.g. WELCOME10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="w-full text-xs font-bold uppercase tracking-wider pl-9 pr-3 py-2.5 bg-brand-light border border-brand-sage/20 rounded-lg focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loadingCoupon || !promoCode}
                      className="bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark px-4 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all duration-300 disabled:opacity-50"
                    >
                      APPLY
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-600 font-semibold">{couponError}</p>}
                </form>
              ) : (
                <div className="flex items-center justify-between p-3.5 bg-brand-dark/5 border border-brand-sage/10 rounded-xl">
                  <div className="flex items-center space-x-2 text-brand-dark text-xs font-black">
                    <Check size={14} />
                    <span>COUPON &ldquo;{couponApplied}&rdquo; COMMITTED</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-xs text-red-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {promoSuccessMsg && <p className="text-[10px] text-brand-dark font-semibold">{promoSuccessMsg}</p>}

              {/* pricing breakdown details */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-xs font-medium text-brand-charcoal/70">
                  <span>Bag Subtotal</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs font-bold text-brand-dark">
                    <span>Discount Deduction</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-medium text-brand-charcoal/70">
                  <span>Estimated Delivery</span>
                  <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
                </div>
                {shippingPrice > 0 && (
                  <p className="text-[9px] text-brand-sage font-medium text-right bg-brand-sage/5 p-1 rounded">
                    💡 Spend ₹{500 - cartSubtotal} more to unlock FREE delivery!
                  </p>
                )}
                <hr className="my-2 border-brand-sage/10" />
                <div className="flex justify-between text-sm font-black text-brand-dark">
                  <span>Total Bill Amount</span>
                  <span className="text-lg text-brand-dark font-black">₹{cartTotal}</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full flex items-center justify-center space-x-2 bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark py-4 px-6 rounded-full font-black tracking-widest text-xs uppercase shadow transition-all duration-300"
              >
                <span>PROCEED TO SECURE CHECKOUT</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Premium Guarantee Badging */}
            <div className="bg-brand-cream/30 p-6 rounded-3xl border border-brand-sage/10 space-y-4">
              <div className="flex items-start space-x-3">
                <ShieldCheck size={18} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-display font-bold text-xs text-brand-dark uppercase tracking-wider">
                    Secure checkout guaranteed
                  </h4>
                  <p className="text-[10px] text-brand-charcoal/60 leading-relaxed font-light mt-0.5">
                    Your transactions are protected by industry-grade 256-bit encryption. Safe checkout via simulated Razorpay card / UPI and COD options.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default CartPage;
