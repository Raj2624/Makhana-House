'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CheckCircle2, Loader2, ArrowLeft, CreditCard, Landmark } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Link from "next/link";
import API from '@/utils/api';

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const {
    cartItems,
    cartSubtotal,
    shippingPrice,
    discountAmount,
    couponApplied,
    cartTotal,
    clearCart
  } = useCart();

  // Prefill shipping info if user is logged in
  const [shippingForm, setShippingForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  useEffect(() => {
    if (user) {
      setShippingForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingForm({ ...shippingForm, [name]: value });
  };

  const validateForm = () => {
    const { name, email, phone, address, city, state, zip } = shippingForm;
    return name && email && phone && address && city && state && zip;
  };

  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Please fill out all shipping details before proceeding!');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your shopping cart is empty!');
      return;
    }

    if (paymentMethod === 'Razorpay') {
      // Open simulated Razorpay iframe gateway popup
      setShowRazorpayModal(true);
    } else {
      // Cash on Delivery - Complete instantly
      await createFinalOrder();
    }
  };

  const createFinalOrder = async (payId = '') => {
    setPlacingOrder(true);
    try {
      const orderPayload = {
        items: cartItems,
        shippingAddress: shippingForm,
        paymentMethod: paymentMethod,
        couponApplied: couponApplied || '',
        discountAmount: discountAmount,
        shippingPrice: shippingPrice,
        totalAmount: cartTotal,
        userId: user ? user.id : 'guest'
      };

      const res = await API.post('/orders', orderPayload);
      setSuccessOrder(res.data);
      clearCart();
    } catch (err) {
      console.error('Order creation failed:', err.message);
      alert('Checkout error: ' + (err.response?.data?.message || err.message));
    } finally {
      setPlacingOrder(false);
      setShowRazorpayModal(false);
    }
  };

  const handleRazorpaySimulateSuccess = async () => {
    await createFinalOrder('pay_rzp_mock_' + Math.random().toString(36).substr(2, 9));
  };

  // If order is completed successfully, render custom success view!
  if (successOrder) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center space-y-8">
        <div className="flex justify-center text-brand-gold animate-bounce">
          <CheckCircle2 size={72} className="fill-brand-dark" />
        </div>
        
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-black tracking-widest text-brand-gold bg-brand-dark px-3 py-1.5 rounded-full">
            Order Confirmed Successfully!
          </span>
          <h1 className="text-3xl font-black font-display text-brand-dark">
            Thank You For Shopping!
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoal/60 leading-relaxed font-light">
            Your order **{successOrder._id}** has been recorded in our system. A fresh batch of premium healthy snacks will be handpacked and shipped shortly!
          </p>
        </div>

        <div className="bg-brand-cream/30 p-6 rounded-3xl border border-brand-sage/10 text-left space-y-4 text-xs">
          <h4 className="font-display font-bold text-brand-dark uppercase tracking-wider">Shipping Summary</h4>
          <div className="space-y-1.5 font-medium text-brand-charcoal/70">
            <p><span className="font-bold text-brand-dark">Recipient:</span> {successOrder.shippingAddress.name}</p>
            <p><span className="font-bold text-brand-dark">Destination:</span> {successOrder.shippingAddress.address}, {successOrder.shippingAddress.city}, {successOrder.shippingAddress.state} - {successOrder.shippingAddress.zip}</p>
            <p><span className="font-bold text-brand-dark">Amount Charged:</span> ₹{successOrder.totalAmount} via {successOrder.paymentMethod}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/shop')}
            className="bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark py-4 px-8 rounded-full font-black tracking-widest text-xs uppercase shadow transition-all duration-300"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="flex items-center space-x-3 border-b border-brand-sage/10 pb-6">
        <Link href="/cart" className="text-brand-charcoal/50 hover:text-brand-dark transition-colors">
          <ArrowLeft size={22} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-brand-dark">Secure Checkout</h1>
          <p className="text-[11px] text-brand-sage font-semibold uppercase tracking-wider mt-0.5">Enter shipping details and finalize payment</p>
        </div>
      </div>

      <form onSubmit={handlePlaceOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Shipping details forms */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="bg-white border border-brand-sage/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-base text-brand-dark uppercase tracking-widest border-b border-brand-sage/10 pb-4">
              1. Shipping Information
            </h3>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-brand-dark tracking-wide">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Receiver's name"
                  value={shippingForm.name}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4 py-3 bg-brand-light border border-brand-sage/15 rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-brand-dark tracking-wide">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="For order verification"
                  value={shippingForm.email}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4 py-3 bg-brand-light border border-brand-sage/15 rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                  required
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] uppercase font-bold text-brand-dark tracking-wide">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="For shipping updates (+91)"
                  value={shippingForm.phone}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4 py-3 bg-brand-light border border-brand-sage/15 rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                  required
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] uppercase font-bold text-brand-dark tracking-wide">Complete Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Apt, suite, floor, street details"
                  value={shippingForm.address}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4 py-3 bg-brand-light border border-brand-sage/15 rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-brand-dark tracking-wide">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shippingForm.city}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4 py-3 bg-brand-light border border-brand-sage/15 rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-brand-dark tracking-wide">State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={shippingForm.state}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4 py-3 bg-brand-light border border-brand-sage/15 rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-brand-dark tracking-wide">Postal Code (ZIP)</label>
                <input
                  type="text"
                  name="zip"
                  placeholder="6 digit PIN code"
                  value={shippingForm.zip}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4 py-3 bg-brand-light border border-brand-sage/15 rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment selector */}
          <div className="bg-white border border-brand-sage/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-base text-brand-dark uppercase tracking-widest border-b border-brand-sage/10 pb-4">
              2. Select Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* COD */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all duration-200 ${
                  paymentMethod === 'COD' 
                    ? 'border-brand-dark bg-brand-dark/5' 
                    : 'border-brand-sage/15 bg-brand-light hover:border-brand-sage/40'
                }`}
              >
                <div className="flex items-center space-x-3 text-brand-dark">
                  <Landmark size={20} />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Cash On Delivery</h4>
                    <p className="text-[10px] text-brand-charcoal/50 mt-0.5 font-medium">Pay with cash upon package receipt</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-brand-dark bg-brand-dark' : 'border-brand-sage/20 bg-white'}`}>
                  {paymentMethod === 'COD' && <span className="w-1.5 h-1.5 rounded-full bg-brand-light" />}
                </div>
              </div>

              {/* Razorpay Online */}
              <div
                onClick={() => setPaymentMethod('Razorpay')}
                className={`p-5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all duration-200 ${
                  paymentMethod === 'Razorpay' 
                    ? 'border-brand-dark bg-brand-dark/5' 
                    : 'border-brand-sage/15 bg-brand-light hover:border-brand-sage/40'
                }`}
              >
                <div className="flex items-center space-x-3 text-brand-dark">
                  <CreditCard size={20} />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Online Payment</h4>
                    <p className="text-[10px] text-brand-charcoal/50 mt-0.5 font-medium">UPI, Cards, Netbanking via Razorpay</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Razorpay' ? 'border-brand-dark bg-brand-dark' : 'border-brand-sage/20 bg-white'}`}>
                  {paymentMethod === 'Razorpay' && <span className="w-1.5 h-1.5 rounded-full bg-brand-light" />}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Order summary and CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-brand-sage/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-base text-brand-dark uppercase tracking-widest border-b border-brand-sage/10 pb-4">
              Review Selected Items
            </h3>

            {/* List */}
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex items-center space-x-3 justify-between text-xs">
                  <div className="flex items-center space-x-3 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-brand-sage/5 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-brand-dark truncate">{item.name}</h4>
                      <span className="text-[10px] text-brand-charcoal/50">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-black text-brand-dark text-right flex-shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <hr className="border-brand-sage/10" />

            {/* Cost Details */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-brand-charcoal/70 font-medium">
                <span>Items Subtotal</span>
                <span>₹{cartSubtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-brand-dark font-bold">
                  <span>Coupon discount ({couponApplied})</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-brand-charcoal/70 font-medium">
                <span>Shipping Fee</span>
                <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
              </div>
              <hr className="my-1.5 border-brand-sage/10" />
              <div className="flex justify-between text-sm font-black text-brand-dark">
                <span>Total Charge Amount</span>
                <span className="text-base font-black">₹{cartTotal}</span>
              </div>
            </div>

            {/* Submit Place Order Button */}
            <button
              type="submit"
              disabled={placingOrder}
              className="w-full flex items-center justify-center space-x-2 bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark py-4 px-6 rounded-full font-black tracking-widest text-xs uppercase shadow transition-all duration-300 disabled:opacity-50"
            >
              {placingOrder ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  <span>PLACING ORDER...</span>
                </>
              ) : (
                <span>PLACE SECURE ORDER</span>
              )}
            </button>
          </div>

          {/* Secure transaction badges */}
          <div className="bg-brand-cream/30 p-6 rounded-3xl border border-brand-sage/10 flex items-center space-x-3 text-xs">
            <ShieldCheck className="text-brand-gold flex-shrink-0" size={18} />
            <p className="text-[10px] text-brand-charcoal/60 leading-relaxed font-light">
              Makhana House uses secure payment integrations. All card details are fully encrypted. Sandbox payments require simple click approval.
            </p>
          </div>
        </div>

      </form>

      {/* Simulated Razorpay Overlay Modal */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/70 backdrop-blur-sm">
          <div className="bg-brand-light border border-brand-sage/20 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center space-y-6">
            <div className="flex justify-center text-brand-dark">
              <Loader2 className="animate-spin text-brand-gold" size={32} />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display font-black text-lg text-brand-dark uppercase tracking-wider">
                Simulating Secure Gateway
              </h3>
              <p className="text-xs text-brand-charcoal/60 leading-relaxed font-light">
                Razorpay Checkout Secure API Sandbox Mode.
                Choose standard simulation outcomes:
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleRazorpaySimulateSuccess}
                className="w-full bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark py-3.5 px-4 rounded-xl text-xs font-black tracking-wider uppercase transition-colors"
              >
                SIMULATE SUCCESSFUL PAYMENT
              </button>
              <button
                onClick={() => setShowRazorpayModal(false)}
                className="w-full border border-brand-sage/20 text-brand-charcoal/70 hover:bg-red-50 hover:text-red-600 py-3.5 px-4 rounded-xl text-xs font-bold uppercase transition-colors"
              >
                CANCEL &amp; ABORT TRANSACTION
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CheckoutPage;
