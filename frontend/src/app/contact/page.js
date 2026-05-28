'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleWhatsAppRedirect = () => {
    // Open a mock WhatsApp chat in a new tab
    window.open('https://wa.me/918049302000?text=Hi%20Makhana%20House,%20I%20have%20a%20nutrition%20query!', '_blank');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase font-black tracking-widest text-brand-gold">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-brand-dark">
          Contact Customer Care
        </h1>
        <p className="text-xs sm:text-sm text-brand-charcoal/60 font-light leading-relaxed">
          Have a question about snack sourcing, wholesale distributions, or subscription customizations? Drop us a line or chat instantly!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Contact Info and WhatsApp integration */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="bg-brand-dark text-brand-light rounded-3xl p-6 sm:p-8 space-y-6 shadow-lg border border-brand-gold/15">
            <h3 className="font-display font-bold text-base text-brand-gold uppercase tracking-widest border-b border-brand-sage/10 pb-4">
              Core Sourcing Office
            </h3>

            <div className="space-y-4 text-xs font-medium text-brand-light/80">
              <div className="flex items-start space-x-3">
                <MapPin className="text-brand-gold mt-0.5 flex-shrink-0" size={16} />
                <p className="leading-relaxed font-light">
                  Makhana House Organic Pvt. Ltd.<br />
                  ChandraVihar Colony, Rajeev Nagar, Patna, BIHAR - 800025
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-brand-gold flex-shrink-0" size={16} />
                <span className="font-light">+91 8252702076, +91 9693288676 (Mon - Sat: 9 AM - 7 PM)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-brand-gold flex-shrink-0" size={16} />
                <span className="font-light">contactmakhanahouse@gmail.com</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Chat Widget */}
          <div className="bg-emerald-50 border border-emerald-250 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <MessageCircle size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-sm text-emerald-900 uppercase tracking-wide">
                Chat Live on WhatsApp
              </h4>
              <p className="text-[11px] text-emerald-700/80 leading-relaxed font-medium">
                Connect instantly with our certified clinical nutritionist to design custom snacking plans or resolve dietary queries!
              </p>
            </div>
            <button
              onClick={handleWhatsAppRedirect}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-full font-black tracking-widest text-[10px] uppercase shadow-sm transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle size={14} />
              <span>CONNECT WITH NUTRITIONIST</span>
            </button>
          </div>

        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-brand-sage/10 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-display font-bold text-base text-brand-dark uppercase tracking-widest border-b border-brand-sage/10 pb-4 mb-6">
              Send An Email Inquiry
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-brand-dark tracking-wide">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={form.name}
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
                    placeholder="Email"
                    value={form.email}
                    onChange={handleInputChange}
                    className="w-full text-xs font-semibold px-4 py-3 bg-brand-light border border-brand-sage/15 rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-brand-dark tracking-wide">Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Query category (e.g. wholesale, order error)"
                  value={form.subject}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4 py-3 bg-brand-light border border-brand-sage/15 rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-brand-dark tracking-wide">Detailed Inquiry Message</label>
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Write your query details here..."
                  value={form.message}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4 py-3 bg-brand-light border border-brand-sage/15 rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark resize-none"
                  required
                />
              </div>

              {submitted && (
                <p className="text-[11px] text-brand-dark font-bold p-3.5 bg-brand-cream/60 border border-brand-sage/15 rounded-xl">
                  ✓ Inquiry submitted successfully! Our care team will respond within 24 hours.
                </p>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark py-3.5 px-6 rounded-full font-black tracking-widest text-xs uppercase shadow transition-all duration-300"
              >
                <Send size={12} />
                <span>SUBMIT EMAIL INQUIRY</span>
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ContactPage;
