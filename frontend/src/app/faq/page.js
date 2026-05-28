'use client';

import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQPage = () => {
  const faqs = [
    {
      q: "What exactly is Makhana (foxnuts) and why is it called a superfood?",
      a: "Makhana, also known as foxnuts or gorgon lotus seeds, is harvested from the seeds of the Euryale ferox plant, which grows abundantly in pristine freshwater wetlands of northern India. It is labeled a superfood because of its exceptional nutrient profile: naturally rich in plant-based proteins, fiber, vital minerals (magnesium, potassium, calcium), and low in sodium and saturated fats. It acts as an excellent, low-calorie alternative to processed high-fat snacks."
    },
    {
      q: "Are your makhana snacks fried or roasted? What oil/fat do you use?",
      a: "Absolutely 100% roasted! We never deep-fry or flash-cook our snacks. Our signature foxnuts are slow-roasted at delicate temperatures in small batches. To optimize the crunch and lock in micro-nutrients, we toss them in a small touch of organic grass-fed cow ghee (clarified butter) or premium cold-pressed olive/rice bran oils for vegan variants. Absolutely zero processed palm or hydrogenated oils are used."
    },
    {
      q: "What is your shipping policy and charges?",
      a: "We offer FREE express shipping across India on all cart bills above ₹500. For orders below ₹500, a flat shipping charge of ₹50 is applied to cover delivery logistics. Once placed, orders are processed within 24 hours and delivered within 3 to 5 business days."
    },
    {
      q: "Do you support Cash on Delivery (COD)?",
      a: "Yes! We support Cash on Delivery (COD) across all pincodes in India alongside secure online transactions (UPI, Credit/Debit Cards, Netbanking) via our secure Razorpay simulation gateway."
    },
    {
      q: "What is the shelf life of your products? Do you use chemical preservatives?",
      a: "Our roasted makhana and super seeds mixes have a shelf life of 9 months from the date of manufacturing. Because we pride ourselves on clean-labels, we use absolutely ZERO synthetic preservatives, artificial stabilizers, or chemical flavor agents. We seal our pouches under nitrogen flushing to keep them fresh and ultra-crisp naturally!"
    },
    {
      q: "Can I customize or pause my monthly Crunch Club subscription?",
      a: "Yes, absolutely! Subscribing to 'The Crunch Club' automatically saves you 10% off retail pricing. You can modify flavor choices, pause, or cancel your subscription at any time directly through your user profile portal, or by sending a quick message to our care team."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-black tracking-widest text-brand-gold">
          Help Desk Center
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-brand-dark">
          Frequently Answered Questions
        </h1>
        <p className="text-xs sm:text-sm text-brand-charcoal/60 font-light max-w-md mx-auto leading-relaxed">
          Need quick answers about organic sourcing, checkout modes, or subscription terms? Browse our Accordions below.
        </p>
      </div>

      {/* Accordion list */}
      <div className="space-y-4">
        {faqs.map((faq, i) => {
          const isOpen = activeIndex === i;
          return (
            <div 
              key={i}
              className="bg-white border border-brand-sage/10 rounded-2xl overflow-hidden shadow-sm hover:border-brand-sage/30 transition-all duration-300"
            >
              {/* Question header click trigger */}
              <button
                onClick={() => toggleAccordion(i)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none transition-colors"
              >
                <div className="flex items-center space-x-3 pr-4">
                  <HelpCircle className="text-brand-gold flex-shrink-0" size={16} />
                  <h4 className="font-display font-bold text-xs sm:text-sm text-brand-dark leading-snug">
                    {faq.q}
                  </h4>
                </div>
                <div className="text-brand-sage flex-shrink-0">
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>

              {/* Answer expandable body */}
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-[300px] border-t border-brand-sage/5' : 'max-h-0'
                }`}
              >
                <div className="p-5 bg-brand-light/30 text-xs sm:text-sm text-brand-charcoal/70 leading-relaxed font-light">
                  {faq.a}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Support quote details */}
      <div className="bg-brand-cream/35 p-6 rounded-3xl border border-brand-sage/10 text-center space-y-4 max-w-xl mx-auto">
        <h4 className="font-display font-bold text-xs text-brand-dark uppercase tracking-wider">
          Still Have Queries?
        </h4>
        <p className="text-[11px] text-brand-charcoal/60 leading-relaxed font-light">
          Can&apos;t find what you are looking for? Our client care team is online and ready to assist you. Chat instantly on WhatsApp or send an inquiry from the contacts panel.
        </p>
        <div className="flex justify-center space-x-4 pt-2">
          <a
            href="/contact"
            className="bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark text-[10px] font-black tracking-widest uppercase px-5 py-2.5 rounded-full shadow transition-all duration-300"
          >
            SEND EMAIL INQUIRY
          </a>
        </div>
      </div>

    </div>
  );
};

export default FAQPage;
