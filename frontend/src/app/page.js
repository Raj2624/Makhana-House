'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, Heart, Sparkles, ChevronRight, Activity, ArrowRight } from 'lucide-react';
import API from '@/utils/api';
import ProductCard from '@/components/ProductCard';
import BenefitSection from '@/components/BenefitSection';

const Homepage = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await API.get('/products');
        // Filter by tags includes 'Best Seller' or average rating >= 4.7
        const filtered = res.data
          .filter(p => p.tags?.includes('Best Seller') || p.rating >= 4.7)
          .slice(0, 4);
        setBestSellers(filtered);
      } catch (err) {
        console.error('Failed to fetch best sellers:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  const categories = [
    { name: 'Makhana', count: '3 Flavors', bg: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&auto=format&fit=crop' },
    { name: 'Seeds', count: '3 Super Seeds', bg: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&auto=format&fit=crop' },
    { name: 'Trail Mixes', count: 'Royal Blend', bg: 'https://images.unsplash.com/photo-1511124699504-7625ec3a2428?w=400&auto=format&fit=crop' },
    { name: 'Dry Fruits', count: 'Honey Glazed', bg: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=400&auto=format&fit=crop' },
  ];

  const reviews = [
    {
      name: "Dr. Kavita Malhotra",
      role: "Clinical Dietician",
      comment: "Makhana House has completely elevated the snacking game. Standard commercial snacks are loaded with palm oil and synthetic spices. Their salt-roasted foxnuts cooked in pure ghee are exceptionally healthy, mineral-rich, and standard-compliant.",
      rating: 5,
    },
    {
      name: "Arjun Verma",
      role: "Marathon Runner & Athlete",
      comment: "The Ancient 5-Seed Boost Mix has become my standard pre-run snack. It is dense with Omega-3 fats, raw plant proteins, and digests perfectly without bloat. Absolutely love the clean packaging too!",
      rating: 5,
    },
    {
      name: "Priyanka Sen",
      role: "IT Professional & Mother",
      comment: "My 4 PM workspace sugar crashes are finally gone. I subscribe to their monthly Crunch Box and it delivers fresh, satisfying roasted packs directly to my office desk. Zero guilt, amazing flavors!",
      rating: 5,
    }
  ];

  const instagramPhotos = [
    "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511124699504-7625ec3a2428?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1621939514649-280e2ee37f6a?w=300&auto=format&fit=crop"
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark to-brand-darker text-brand-light py-24 sm:py-32 border-b border-brand-sage/10">
        {/* Subtle organic background lines overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8EA89C_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <span className="inline-flex items-center space-x-2 bg-brand-gold/10 border border-brand-gold/25 text-brand-gold px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
              <Sparkles size={12} />
              <span>100% ORGANIC &amp; SLOW-ROASTED</span>
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-brand-light leading-[1.1]">
              Healthy Snacking, <br />
              <span className="text-brand-gold">Reimagined.</span>
            </h1>

            <p className="text-sm sm:text-base text-brand-light/80 leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
              Indulge in premium hand-harvested foxnuts (makhana) slow-roasted in pure ghee, and ancient super seeds loaded with clean plant proteins. Sourced from nature, crafted for luxury wellness.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                href="/shop"
                className="bg-brand-gold text-brand-dark hover:bg-brand-light hover:text-brand-dark py-4 px-8 rounded-full font-black tracking-widest text-xs uppercase shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                SHOP FRESH SNACKS
              </Link>
              <Link
                href="/about"
                className="border border-brand-light/35 text-brand-light hover:border-brand-gold hover:text-brand-gold py-4 px-8 rounded-full font-black tracking-widest text-xs uppercase transition-all duration-300"
              >
                OUR SOURCING STORY
              </Link>
            </div>
          </div>

          {/* Featured Hero Product Banner Mock */}
          <div className="relative flex justify-center">
            {/* Absolute visual glows */}
            <div className="absolute w-72 h-72 bg-brand-sage/20 rounded-full filter blur-3xl -top-10 -left-10" />
            <div className="absolute w-72 h-72 bg-brand-gold/10 rounded-full filter blur-3xl -bottom-10 -right-10" />

            <div className="relative bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md max-w-sm w-full shadow-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black tracking-widest text-brand-gold uppercase">
                  Featured Launch
                </span>
                <h3 className="font-display text-xl font-bold mt-2 text-brand-light">
                  Himalayan Pink Salt Makhana
                </h3>
                <p className="text-xs text-brand-light/60 mt-1 leading-relaxed">
                  Slow-roasted in organic cow ghee, seasoned with hand-milled Himalayan pink crystals. High calcium, high protein.
                </p>
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&auto=format&fit=crop" 
                alt="Pink Salt Makhana Bowl" 
                className="w-full h-44 object-cover rounded-xl mt-6 border border-white/5 shadow-inner"
              />

              <div className="mt-6 flex items-center justify-between">
                <div>
                  <span className="text-xs text-brand-light/40 block">Special Pricing</span>
                  <span className="text-lg font-black text-brand-light">₹180</span>
                </div>
                <Link
                  href="/shop/prod_snack_100"
                  className="bg-brand-light hover:bg-brand-gold text-brand-dark p-2.5 rounded-full transition-colors shadow"
                >
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase font-black tracking-widest text-brand-gold">
              Explore Our Collection
            </span>
            <h2 className="text-3xl font-black font-display tracking-tight text-brand-dark">
              Nutritional Categories
            </h2>
          </div>
          <Link
            href="/shop"
            className="group flex items-center space-x-1 text-sm font-bold text-brand-dark hover:text-brand-gold transition-colors"
          >
            <span>View All Collections</span>
            <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {categories.map((cat, i) => (
            <Link 
              key={i} 
              href={`/shop?category=${cat.name}`}
              className="group relative flex flex-col justify-end h-72 rounded-2xl overflow-hidden border border-brand-sage/10 shadow-sm"
            >
              {/* Overlay Background */}
              <div className="absolute inset-0 bg-brand-dark/45 group-hover:bg-brand-dark/35 transition-colors duration-300 z-10" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={cat.bg} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Label Details */}
              <div className="relative p-6 z-20 space-y-1">
                <span className="text-[10px] uppercase font-black text-brand-gold tracking-widest">
                  {cat.count}
                </span>
                <h3 className="font-display font-bold text-lg text-brand-light flex items-center space-x-1.5">
                  <span>{cat.name}</span>
                  <ArrowRight size={16} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLING PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase font-black tracking-widest text-brand-gold">
            Customer Favorites
          </span>
          <h2 className="text-3xl font-black font-display text-brand-dark">
            Our Best Sellers
          </h2>
          <p className="text-xs sm:text-sm text-brand-charcoal/60 font-light leading-relaxed">
            Freshly slow-roasted, organic-seasoned, and packed with plant-powered nutrition. Check out what snacks our community is loving today.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-brand-cream/40 animate-pulse border border-brand-sage/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {bestSellers.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 4. BENEFITS OF MAKHANA & SEEDS (Infographics from reusable component) */}
      <BenefitSection />

      {/* 5. HEALTHY LIFESTYLE SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Sourcing Visual graphic */}
        <div className="relative">
          <div className="absolute inset-0 bg-brand-sage/10 rounded-3xl transform rotate-2" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800&auto=format&fit=crop" 
            alt="Organic Makhana Harvesting Sourcing" 
            className="relative w-full h-[450px] object-cover rounded-3xl shadow-md border border-brand-sage/10"
          />
          <div className="absolute bottom-6 left-6 bg-white p-6 rounded-2xl border border-brand-sage/15 shadow-lg max-w-xs flex items-center space-x-4 z-10">
            <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center text-brand-gold font-bold">
              ✔
            </div>
            <div>
              <h4 className="font-display font-bold text-xs text-brand-dark uppercase tracking-wider">
                100% Traceable Sourcing
              </h4>
              <p className="text-[11px] text-brand-charcoal/70 leading-normal mt-0.5 font-light">
                Directly from wetlands of Bihar, sustainably hand-harvested by local growers.
              </p>
            </div>
          </div>
        </div>

        {/* Text Story details */}
        <div className="space-y-8">
          <span className="text-xs uppercase font-black tracking-widest text-brand-gold flex items-center space-x-1.5">
            <Activity size={14} />
            <span>FITNESS FRIENDLY SNACKING</span>
          </span>

          <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-brand-dark leading-tight">
            Nourish Your Body With Premium, Slow-Cooked Wellness
          </h2>

          <p className="text-sm text-brand-charcoal/70 leading-relaxed font-light">
            Typical commercial snacks are cooked in high-temperature industrial fryers using ultra-processed palm oil. They strip away nutrients and leave your body feeling sluggish. 
            <br /><br />
            At **Makhana House**, we believe food should be a source of life. Our signature foxnuts are harvested using traditional techniques, sun-dried, and slow-roasted at delicate temperatures in pure organic cow ghee. The result is a premium crunch loaded with intact calcium, active magnesium, and high plant fibers. Keep a pack at your workstation and watch your focus soar.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-brand-sage/10 text-brand-dark">
            <div className="space-y-1">
              <span className="text-3xl font-black font-display text-brand-gold block">
                0%
              </span>
              <span className="text-xs uppercase font-bold tracking-wider text-brand-dark">
                Refined Sugar / MSG
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-black font-display text-brand-gold block">
                67%
              </span>
              <span className="text-xs uppercase font-bold tracking-wider text-brand-dark">
                Less Calories Than Chips
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SUBSCRIPTION OFFERS ("THE CRUNCH CLUB") */}
      <section className="bg-brand-dark text-brand-light py-20 border-y border-brand-gold/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase font-black tracking-widest text-brand-gold">
              Smart Desk Routines
            </span>
            <h2 className="text-3xl font-black font-display text-brand-light">
              Join The Crunch Club
            </h2>
            <p className="text-xs sm:text-sm text-brand-light/70 font-light leading-relaxed">
              Never run out of healthy snacks again. Subscribe to our monthly box and save 10% off retail pricing, with free delivery and customizable flavors.
            </p>
          </div>

          {/* Subscription Cards Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto text-brand-dark">
            {/* Box 1 */}
            <div className="bg-brand-light p-8 rounded-3xl border border-brand-sage/10 shadow-md flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-black tracking-widest text-brand-sage block">
                  Starter Desk Box
                </span>
                <h3 className="font-display font-black text-2xl text-brand-dark">
                  The Lite Cruiser
                </h3>
                <p className="text-xs text-brand-charcoal/60 font-light leading-relaxed">
                  Perfect for individual snackers. Delivers 6 premium snack packs directly to your desk monthly.
                </p>
                <div className="pt-4 border-t border-brand-sage/5">
                  <span className="text-3xl font-black font-display text-brand-dark">₹990</span>
                  <span className="text-xs text-brand-charcoal/50">/month</span>
                </div>
              </div>
              <Link 
                href="/shop"
                className="w-full bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark py-3.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300"
              >
                SUBSCRIBE NOW
              </Link>
            </div>

            {/* Box 2 (Recommended highlight) */}
            <div className="bg-white p-8 rounded-3xl border-2 border-brand-gold shadow-xl flex flex-col justify-between space-y-8 relative transform scale-105 z-10">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-dark font-black tracking-widest text-[9px] uppercase px-4 py-1.5 rounded-full shadow">
                ★ MOST POPULAR ★
              </span>
              
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-black tracking-widest text-brand-gold block">
                  Fitness Focus Box
                </span>
                <h3 className="font-display font-black text-2xl text-brand-dark">
                  The Healthy Champion
                </h3>
                <p className="text-xs text-brand-charcoal/60 font-light leading-relaxed">
                  Best for couples or intensive snackers. Delivers 12 premium mixed packs (Makhanas &amp; seeds) monthly.
                </p>
                <div className="pt-4 border-t border-brand-sage/5">
                  <span className="text-3xl font-black font-display text-brand-dark">₹1,790</span>
                  <span className="text-xs text-brand-charcoal/50">/month</span>
                </div>
              </div>
              <Link 
                href="/shop"
                className="w-full bg-brand-gold text-brand-dark hover:bg-brand-dark hover:text-brand-light py-3.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300"
              >
                SUBSCRIBE NOW
              </Link>
            </div>

            {/* Box 3 */}
            <div className="bg-brand-light p-8 rounded-3xl border border-brand-sage/10 shadow-md flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-black tracking-widest text-brand-sage block">
                  Corporate Pantry Box
                </span>
                <h3 className="font-display font-black text-2xl text-brand-dark">
                  The Studio Pack
                </h3>
                <p className="text-xs text-brand-charcoal/60 font-light leading-relaxed">
                  Designed for organic office cabinets. Delivers 25 premium assorted bags monthly with catering discounts.
                </p>
                <div className="pt-4 border-t border-brand-sage/5">
                  <span className="text-3xl font-black font-display text-brand-dark">₹3,490</span>
                  <span className="text-xs text-brand-charcoal/50">/month</span>
                </div>
              </div>
              <Link 
                href="/shop"
                className="w-full bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark py-3.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300"
              >
                SUBSCRIBE NOW
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase font-black tracking-widest text-brand-gold">
            Word On The Street
          </span>
          <h2 className="text-3xl font-black font-display text-brand-dark">
            Backed By Nutritionists, Loved By Snackers
          </h2>
        </div>

        {/* Reviews Horizontal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {reviews.map((rev, idx) => (
            <div 
              key={idx} 
              className="bg-brand-cream/20 p-8 rounded-2xl border border-brand-sage/10 flex flex-col justify-between space-y-6"
            >
              <div className="flex text-brand-gold space-x-1">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-brand-gold text-brand-gold" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed font-light italic flex-1">
                &ldquo;{rev.comment}&rdquo;
              </p>

              <div className="pt-4 border-t border-brand-sage/5 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center font-bold text-brand-gold uppercase text-xs">
                  {rev.name[3]}
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-brand-dark">
                    {rev.name}
                  </h4>
                  <span className="text-[10px] text-brand-sage font-semibold uppercase tracking-wider block mt-0.5">
                    {rev.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. INSTAGRAM GALLERY FEED MOCKUP */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-black tracking-widest text-brand-gold">
            Instagram Snaps
          </span>
          <h2 className="text-3xl font-black font-display text-brand-dark">
            Share Your #CrunchRoutines
          </h2>
          <p className="text-xs sm:text-sm text-brand-charcoal/60 font-light">
            Tag us @MakhanaHouse to get featured in our organic eating gallery!
          </p>
        </div>

        {/* Gallery responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPhotos.map((url, i) => (
            <div 
              key={i} 
              className="relative aspect-square rounded-2xl overflow-hidden group border border-brand-sage/5 shadow-sm"
            >
              <div className="absolute inset-0 bg-brand-dark/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center text-brand-light font-bold text-lg">
                ♥
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={url} 
                alt={`Instagram snack grid photo ${i + 1}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Homepage;
