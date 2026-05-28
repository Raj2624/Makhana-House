'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '@/utils/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [couponApplied, setCouponApplied] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (e) {
          console.error('Error parsing cart items', e);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  const saveCart = (items) => {
    setCartItems(items);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  };

  const addToCart = (product, quantity = 1) => {
    const existingIndex = cartItems.findIndex((item) => item.productId === product._id);
    const updated = [...cartItems];

    if (existingIndex !== -1) {
      updated[existingIndex].quantity += quantity;
    } else {
      updated.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
      });
    }

    saveCart(updated);
    // Reset coupon if cart changes to re-evaluate minimum amount rules
    removeCoupon();
  };

  const removeFromCart = (productId) => {
    const updated = cartItems.filter((item) => item.productId !== productId);
    saveCart(updated);
    removeCoupon();
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    saveCart(updated);
    removeCoupon();
  };

  const clearCart = () => {
    saveCart([]);
    removeCoupon();
  };

  // Calculations
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Shipping: Free shipping over ₹500, otherwise ₹50
  const shippingPrice = cartSubtotal > 500 || cartSubtotal === 0 ? 0 : 50;
  
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingPrice);

  const applyCoupon = async (code) => {
    setCouponError('');
    if (!code) return;

    try {
      const res = await API.post('/coupons/validate', {
        code,
        amount: cartSubtotal,
      });

      if (res.data.valid) {
        setCouponApplied(res.data.code);
        setDiscountAmount(res.data.discountAmount);
        return res.data;
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid coupon code';
      setCouponError(errMsg);
      setCouponApplied('');
      setDiscountAmount(0);
      throw new Error(errMsg);
    }
  };

  const removeCoupon = () => {
    setCouponApplied('');
    setDiscountAmount(0);
    setCouponError('');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingPrice,
        discountAmount,
        couponApplied,
        couponError,
        cartTotal,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
