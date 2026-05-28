'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, Mail, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const SignupPage = () => {
  const router = useRouter();
  const { signup, user, error, loading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/shop');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!name || !email || !password) {
      setLocalError('Please fill out all fields.');
      return;
    }

    try {
      await signup(name, email, password);
    } catch (err) {
      // Handled by context error state
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Signup Card */}
      <div className="max-w-md w-full bg-white border border-brand-sage/10 rounded-3xl p-8 sm:p-10 shadow-lg space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block font-display text-2xl font-bold tracking-tight text-brand-dark">
            MAKHANA<span className="text-brand-gold">HOUSE</span>
          </Link>
          <h2 className="text-xl font-bold text-brand-dark">Start Healthy Snacking</h2>
          <p className="text-xs text-brand-charcoal/50 font-medium uppercase tracking-wider">Join our Organic Crunch Club today!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-brand-dark tracking-wide">Your Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-brand-sage" size={16} />
                <input
                  type="text"
                  placeholder="e.g. Sneha Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-semibold pl-10 pr-4 py-3 bg-brand-light border border-brand-sage/15 rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-brand-dark tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-brand-sage" size={16} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-semibold pl-10 pr-4 py-3 bg-brand-light border border-brand-sage/15 rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-brand-dark tracking-wide">Choose Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-brand-sage" size={16} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs font-semibold pl-10 pr-4 py-3 bg-brand-light border border-brand-sage/15 rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                  required
                />
              </div>
            </div>

          </div>

          {/* Errors display */}
          {(localError || error) && (
            <p className="text-[11px] text-red-600 font-semibold p-3 bg-red-50 border border-red-100 rounded-xl">
              {localError || error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark py-4 px-6 rounded-full font-black tracking-widest text-xs uppercase shadow transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                <span>CREATING ACCOUNT...</span>
              </>
            ) : (
              <span>REGISTER SECURE ACCOUNT</span>
            )}
          </button>
        </form>

        {/* Login Redirect */}
        <div className="text-center text-xs font-medium text-brand-charcoal/60">
          <span>Already registered? </span>
          <Link href="/login" className="text-brand-gold font-bold hover:underline">
            Login Here
          </Link>
        </div>

      </div>

    </div>
  );
};

export default SignupPage;
