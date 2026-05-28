import React from 'react';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Makhana House - Premium Healthy Snacking Brand',
  description: 'Slow-roasted organic foxnuts (makhana), chia seeds, pumpkin seeds, and high-protein trail mixes. Premium natural snack foods crafted with luxury and clean-labels.',
  keywords: 'makhana, foxnuts, pumpkin seeds, chia seeds, healthy snacks, organic snacks, D2C healthy, protein snacks',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-brand-light font-sans text-brand-charcoal antialiased">
        <AuthProvider>
          <CartProvider>
            {/* Header Sticky Component */}
            <Navbar />

            {/* Core Application Content */}
            <main className="flex-1">
              {children}
            </main>

            {/* Footer Sourcing Info */}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
