/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enables dark mode toggles via 'dark' class
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1D3E2E',       // Primary luxurious organic Forest Green
          darker: '#142A1F',     // Even deeper forest green for headers/footers
          sage: '#8EA89C',       // Accent Sage for subtle borders and cards
          light: '#FAF9F6',      // Alabaster background soft warm white
          gold: '#DCA842',       // Accent Gold/Ochre for premium elements
          charcoal: '#212529',   // Very dark gray for high readability text
          cream: '#F4F2EB',      // Secondary background cream
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
