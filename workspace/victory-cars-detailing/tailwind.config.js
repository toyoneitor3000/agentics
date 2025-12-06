/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          'dark-blue': '#020617', // Fondo ultra oscuro
          'mid-blue': '#0f172a',  // Fondo secundario
          'accent-blue': '#1e3a8a', // Azul corporativo medio
          'cyan': '#06b6d4',      // El color del "Detailing" y acentos vibrantes
          'cyan-hover': '#0891b2',
          'slate': '#94a3b8',     // Texto secundario
          'white': '#ffffff',
          // Nuevos colores para los degradados solicitados
          'petroleum': '#003f5c', // Azul petróleo
          'light-blue': '#4cc9f0', // Azul claro
          'black': '#000000',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        orbitron: ['var(--font-orbitron)', 'sans-serif'], // Para "VICTORY CARS"
        'style-script': ['var(--font-style-script)', 'cursive'], // Para "Detailing"
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to right, #020617 0%, #0f172a 100%)',
        'blue-glow': 'conic-gradient(from 180deg at 50% 50%, #020617 0deg, #1e3a8a 180deg, #06b6d4 360deg)',
        // Nuevos degradados solicitados
        'petroleum-to-black': 'linear-gradient(to bottom, #003f5c, #000000)',
        'black-to-lightblue': 'linear-gradient(to bottom, #000000, #4cc9f0)',
        'lightblue-to-black': 'linear-gradient(to bottom, #4cc9f0, #000000)',
        // Degradados diagonales para más dinamismo
        'petroleum-black-diagonal': 'linear-gradient(135deg, #003f5c 0%, #000000 100%)',
        'black-lightblue-diagonal': 'linear-gradient(135deg, #000000 0%, #4cc9f0 100%)',
        'lightblue-black-diagonal': 'linear-gradient(135deg, #4cc9f0 0%, #000000 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.8)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
