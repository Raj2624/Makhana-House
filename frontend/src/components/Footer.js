'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-brand-darker text-brand-light border-t border-brand-sage/10">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Info Column */}
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold tracking-tight text-brand-light">
              MAKHANA<span className="text-brand-gold">HOUSE</span>
            </h2>
            <p className="text-sm text-brand-light/70 font-light leading-relaxed">
              Superfoods for the Mindful Soul. We harvest and slow-roast premium foxnuts and ancient super seeds sustainably to bring organic, guilt-free luxury snacks directly to your active desk.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              {['Instagram', 'Facebook', 'WhatsApp', 'X'].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="w-8 h-8 rounded-full border border-brand-sage/20 flex items-center justify-center text-brand-light/60 hover:text-brand-gold hover:border-brand-gold transition-colors duration-200 text-xs font-bold"
                  title={`Follow us on ${platform}`}
                >
                  {platform[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold mb-6">
              Quick Connections
            </h3>
            <ul className="space-y-4 text-sm text-brand-light/75 font-medium">
              <li>
                <Link href="/shop" className="hover:text-brand-gold transition-colors">
                  Shop Snacks Catalog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-gold transition-colors">
                  Our Organic Sourcing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-gold transition-colors">
                  Healthy Eating Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-gold transition-colors">
                  Help & FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-gold transition-colors">
                  Get In Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold mb-6">
              Shop Categories
            </h3>
            <ul className="space-y-4 text-sm text-brand-light/75 font-medium">
              <li>
                <Link href="/shop?category=Makhana" className="hover:text-brand-gold transition-colors">
                  Roasted Makhana (Foxnuts)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Seeds" className="hover:text-brand-gold transition-colors">
                  Organic Super Seeds
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Trail%20Mixes" className="hover:text-brand-gold transition-colors">
                  Nutritious Trail Mixes
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Dry%20Fruits" className="hover:text-brand-gold transition-colors">
                  Honey Glazed Dry Fruits
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Protein%20Snacks" className="hover:text-brand-gold transition-colors">
                  Whey Protein Bites
                </Link>
              </li>
            </ul>
          </div>

          {/* Slogan & Newsletter Subscription */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold mb-6">
              Makhana Digest
            </h3>
            <p className="text-sm text-brand-light/70 font-light leading-relaxed">
              Subscribe to unlock 10% off your first checkout and receive curated recipes and health guides.
            </p>
            <form onSubmit={handleSubscribe} className="flex space-x-2">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-semibold px-4 py-3 bg-brand-dark border border-brand-sage/20 rounded-lg text-brand-light placeholder-brand-light/40 focus:outline-none focus:border-brand-gold"
                required
              />
              <button
                type="submit"
                className="bg-brand-gold text-brand-dark hover:bg-brand-light hover:text-brand-dark px-4 py-3 rounded-lg flex items-center justify-center transition-all duration-300"
              >
                <Send size={16} />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-brand-gold font-bold">
                Welcome to the crunch club! 10% off coupon code WELCOME10 applied automatically!
              </p>
            )}
          </div>
        </div>

        <hr className="my-12 border-brand-sage/10" />

        {/* Contact Info Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-brand-light/50 font-medium">
          <div className="flex items-center space-x-2">
            <MapPin size={14} className="text-brand-gold" />
            <span>ChandraVihar Colony, Rajeev Nagar, Patna, BIHAR - 800025</span>
          </div>
          <div className="flex items-center space-x-2 md:justify-center">
            <Phone size={14} className="text-brand-gold" />
            <span>Support: +91 8252702076, +91 9693288676 (Mon - Sat: 9 AM - 7 PM)</span>
          </div>
          <div className="flex items-center space-x-2 md:justify-end">
            <Mail size={14} className="text-brand-gold" />
            <span>contactmakhanahouse@gmail.com</span>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] text-brand-light/35 font-light">
          &copy; {new Date().getFullYear()} Makhana House Organic Pvt. Ltd. All rights reserved. Sourced sustainably, packaged beautifully, served minded.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
