'use client';

import React from 'react';
import { ShieldCheck, HeartPulse, Flame, Leaf } from 'lucide-react';

const BenefitSection = () => {
  const benefits = [
    {
      icon: <ShieldCheck size={28} className="text-brand-gold" />,
      title: "High Plant Protein",
      description: "Our slow-roasted foxnuts provide a significant punch of clean, plant-based protein (approx 4g per cup), perfect for maintaining muscle mass and fueling active days.",
      badge: "Muscle Recovery"
    },
    {
      icon: <HeartPulse size={28} className="text-brand-gold" />,
      title: "Calcium & Iron Rich",
      description: "Foxnuts are loaded with natural calcium, helping to promote strong bone density, and vital iron, which supports healthy blood oxygen transport systems.",
      badge: "Bone Health"
    },
    {
      icon: <Flame size={28} className="text-brand-gold" />,
      title: "Low Glycemic Index",
      description: "With low calories and a low GI index, Makhana releases complex carbohydrates slowly into the bloodstream, preventing energy spikes and crashes.",
      badge: "Weight Control"
    },
    {
      icon: <Leaf size={28} className="text-brand-gold" />,
      title: "Antioxidant Superfood",
      description: "Rich in polyphenols and vital amino acids that support skin elasticity (anti-aging properties) and detoxify the body from toxic free radicals.",
      badge: "Detox & Glow"
    }
  ];

  return (
    <section className="bg-brand-cream/60 py-20 border-y border-brand-sage/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase font-black tracking-widest text-brand-gold">
            The Ancient Superfood Wisdom
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-brand-dark leading-tight">
            Why Foxnuts &amp; Seeds Are The Ultimate Desk Fuel
          </h2>
          <p className="text-sm sm:text-base text-brand-charcoal/70 leading-relaxed font-light">
            Loved by monks and emperors for centuries, these nutrient-dense powerhouses are now slow-roasted with modern culinary crafts to keep you energized, focused, and nourished.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {benefits.map((benefit, i) => (
            <div 
              key={i} 
              className="bg-white p-8 rounded-2xl border border-brand-sage/10 shadow-sm hover:border-brand-sage/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Icon wrapper */}
                <div className="w-14 h-14 rounded-xl bg-brand-dark flex items-center justify-center shadow-md">
                  {benefit.icon}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-lg text-brand-dark">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-charcoal/70 leading-relaxed font-light">
                    {benefit.description}
                  </p>
                </div>
              </div>

              {/* Badge footer */}
              <div className="mt-8 pt-4 border-t border-brand-sage/5">
                <span className="text-[10px] uppercase font-black tracking-widest text-brand-sage bg-brand-sage/5 px-2.5 py-1 rounded-full">
                  {benefit.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Slogan Infographic Quote */}
        <div className="mt-16 bg-brand-dark text-brand-light rounded-3xl p-8 sm:p-12 border border-brand-gold/15 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-lg">
          <div className="space-y-2 max-w-xl text-center sm:text-left">
            <h3 className="font-display font-bold text-xl sm:text-2xl text-brand-light">
              Crafting Snacking Luxuries
            </h3>
            <p className="text-xs sm:text-sm text-brand-light/75 leading-relaxed font-light">
              &ldquo;Our promise is clean label snackeries. We use absolutely zero refined sugars, zero artificial colors, and slow-roast only in premium cow ghee or cold-pressed organic oils.&rdquo;
            </p>
          </div>
          <div className="flex-shrink-0 bg-brand-gold text-brand-dark px-6 py-4 rounded-2xl font-black tracking-widest text-xs uppercase shadow-md">
            100% CLEAN LABEL
          </div>
        </div>

      </div>
    </section>
  );
};

export default BenefitSection;
