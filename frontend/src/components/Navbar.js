'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, User, Menu, X, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const navLinks = [
    { name: 'Shop All', href: '/shop' },
    { name: 'Our Story', href: '/about' },
    { name: 'Organic Blog', href: '/blog' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleCartClick = (e) => {
    e.preventDefault();
    setCartDrawerOpen(true);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full transition-all duration-300 glass-effect border-b border-brand-sage/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <span className="font-display text-2xl font-bold tracking-tight text-brand-dark">
                  MAKHANA<span className="text-brand-gold">HOUSE</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-sans text-sm font-medium tracking-wide transition-colors duration-200 animated-underline ${
                      isActive ? 'text-brand-gold font-semibold' : 'text-brand-dark hover:text-brand-gold'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Icons Actions Panel */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Admin Panel Quick Access */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center space-x-1 text-xs uppercase font-bold tracking-widest text-brand-gold bg-brand-dark px-3 py-1.5 rounded-full border border-brand-gold/20 hover:bg-brand-gold hover:text-brand-dark transition-all duration-200"
                  title="Admin Dashboard"
                >
                  <ShieldAlert size={14} />
                  <span>Admin</span>
                </Link>
              )}

              {/* Wishlist Icon */}
              <Link
                href={user ? "/shop?filter=wishlist" : "/login"}
                className="text-brand-dark hover:text-brand-gold transition-colors duration-200 relative"
                title="Wishlist"
              >
                <Heart size={22} />
                {user?.wishlist?.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-brand-dark">
                    {user.wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <button
                onClick={handleCartClick}
                className="text-brand-dark hover:text-brand-gold transition-colors duration-200 relative flex items-center"
                title="Shopping Bag"
              >
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-dark text-[10px] font-bold text-brand-light">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Account / Profile */}
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1.5">
                    <User size={18} className="text-brand-sage" />
                    <span className="text-sm font-medium text-brand-dark truncate max-w-[100px]" title={user.name}>
                      Hi, {user.name.split(' ')[0]}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-brand-dark hover:text-red-600 transition-colors duration-200"
                    title="Log Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-1 text-brand-dark hover:text-brand-gold transition-colors duration-200 text-sm font-semibold"
                >
                  <User size={18} />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile menu trigger button */}
            <div className="flex md:hidden items-center space-x-4">
              {/* Mobile Cart Trigger */}
              <button
                onClick={handleCartClick}
                className="text-brand-dark hover:text-brand-gold transition-colors duration-200 relative"
              >
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-dark text-[10px] font-bold text-brand-light">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-brand-dark focus:outline-none"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-effect border-t border-brand-sage/10 absolute left-0 w-full shadow-lg">
            <div className="space-y-1 px-4 py-4 sm:px-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-3 text-base font-semibold transition-colors ${
                      isActive ? 'text-brand-gold border-l-2 border-brand-gold pl-2' : 'text-brand-dark hover:text-brand-gold'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              
              <hr className="my-4 border-brand-sage/10" />

              {/* Admin quick access mobile */}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 py-3 text-brand-gold font-bold uppercase tracking-wider text-sm"
                >
                  <ShieldAlert size={18} />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              {/* Wishlist Link Mobile */}
              <Link
                href={user ? "/shop?filter=wishlist" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 py-3 text-base font-semibold text-brand-dark hover:text-brand-gold"
              >
                <Heart size={18} />
                <span>My Wishlist ({user?.wishlist?.length || 0})</span>
              </Link>

              {/* Auth Mobile Links */}
              {user ? (
                <div className="pt-2">
                  <div className="flex items-center space-x-2 py-2 text-sm text-brand-sage font-semibold">
                    <User size={16} />
                    <span>Logged in as {user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center space-x-2 py-3 text-left text-base font-semibold text-red-600"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 py-3 text-base font-semibold text-brand-dark hover:text-brand-gold"
                >
                  <User size={18} />
                  <span>Log In / Sign Up</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Cart Drawer Sliding Component */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  );
};

export default Navbar;
