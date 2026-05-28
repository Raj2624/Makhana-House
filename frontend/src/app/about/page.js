'use client';

import React from 'react';
import { ArrowRight, Leaf, ShieldAlert, Award, Heart } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-br from-brand-dark to-brand-darker text-brand-light py-20 text-center relative border-b border-brand-sage/10">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#8EA89C_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="mx-auto max-w-3xl px-4 sm:px-6 relative space-y-6">
          <span className="text-xs uppercase font-black tracking-widest text-brand-gold">
            OUR SACRED PHILOSOPHY
          </span>
          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-tight">
            The Makhana Revolution
          </h1>
          <p className="text-sm sm:text-base text-brand-light/85 font-light leading-relaxed max-w-xl mx-auto">
            Born from a simple promise: to elevate ancient Indian agricultural superfoods into premium, luxury snackeries for the modern wellness lifestyle.
          </p>
        </div>
      </section>

      {/* 2. THE BRAND STORY */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <span className="text-xs uppercase font-black tracking-widest text-brand-gold">
            Ancient Roots, Modern Crunch
          </span>
          <h2 className="text-3xl font-black font-display text-brand-dark leading-tight">
            Sourced In The Pristine Wetlands Of Bihar, Roasted For Luxury Desk Fuel
          </h2>
          <p className="text-xs sm:text-sm text-brand-charcoal/70 leading-relaxed font-light">
            Makhana House was founded in 2024 to solve a massive modern dilemma: why must delicious quick office snacks be so toxic? Typical industrial chips, crisp breads, and dry nuts are flash-fried at extreme heats in processed palm oils and dusted with synthetic MSG spices. They fill our stomachs with hollow trans fats and leave our brains in intense sugar crashes.
            <br /><br />
            We looked back at our roots. For thousands of years, the humble *lotus seeds* (foxnuts) have been revered in Ayurveda as holistic healing tools. Sourced directly from local farmers in the calm wetlands of Bihar, our foxnuts are hand-harvested, dried under natural sunlight, and cracked by hand. We slow-roast these delicate puffy clouds in pure, grass-fed organic ghee and season them with only honest, clean-label rock salts and dried spices.
          </p>
        </div>

        {/* Story Illustration Grid */}
        <div className="relative">
          <div className="absolute inset-0 bg-brand-cream rounded-3xl transform rotate-3" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800&auto=format&fit=crop" 
            alt="Lotus Pond Wetland Harvesting" 
            className="relative w-full h-[400px] object-cover rounded-3xl shadow border border-brand-sage/10"
          />
        </div>
      </section>

      {/* 3. CORE COMMITMENTS */}
      <section className="bg-brand-cream/45 py-20 border-y border-brand-sage/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase font-black tracking-widest text-brand-gold">
              What Guides Us
            </span>
            <h2 className="text-3xl font-black font-display text-brand-dark">
              Our Clean Snacking Vows
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
            
            {/* Vow 1 */}
            <div className="bg-white p-8 rounded-2xl border border-brand-sage/5 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand-dark flex items-center justify-center text-brand-gold mx-auto shadow">
                <Leaf size={20} />
              </div>
              <h3 className="font-display font-bold text-base text-brand-dark uppercase">100% Clean Labels</h3>
              <p className="text-xs text-brand-charcoal/70 font-light leading-relaxed">
                Absolutely zero artificial colors, synthetic taste enhancers, MSG, or refined white sugars. Only real organic superfoods and clean cooking elements.
              </p>
            </div>

            {/* Vow 2 */}
            <div className="bg-white p-8 rounded-2xl border border-brand-sage/5 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand-dark flex items-center justify-center text-brand-gold mx-auto shadow">
                <Award size={20} />
              </div>
              <h3 className="font-display font-bold text-base text-brand-dark uppercase">Slow-Cooked Sourcing</h3>
              <p className="text-xs text-brand-charcoal/70 font-light leading-relaxed">
                Sun-dried seeds and slow-roasted foxnuts, locked in natural complex carbs, intact calcium levels, and natural trace elements for pure nourishment.
              </p>
            </div>

            {/* Vow 3 */}
            <div className="bg-white p-8 rounded-2xl border border-brand-sage/5 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand-dark flex items-center justify-center text-brand-gold mx-auto shadow">
                <Heart size={20} />
              </div>
              <h3 className="font-display font-bold text-base text-brand-dark uppercase">Traceable Sourcing</h3>
              <p className="text-xs text-brand-charcoal/70 font-light leading-relaxed">
                Direct partnerships with marginal wetlands farmers in northern Bihar, securing them sustainable fair wages and organic agricultural tools.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default AboutPage;
