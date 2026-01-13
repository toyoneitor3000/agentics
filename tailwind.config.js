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
        // Paleta Speedlight Culture
        'speedlight-red': '#D32F2F',
        'culture-orange': '#FF9800',
        'energy-yellow': '#FFEB3B',
        'tradition-ocher': '#C17D11',
        
        // Fondos oscuros
        'dark-primary': '#1A1A1A',
        'dark-secondary': '#2D2D2D',
        'dark-tertiary': '#3D3D3D',
        
        // Textos
        'text-primary': '#FFFFFF',
        'text-secondary': '#B0B0B0',
        'text-tertiary': '#808080',
      },
      backgroundImage: {
        'gradient-speedlight': 'linear-gradient(135deg, #D32F2F 0%, #FF9800 100%)',
        'gradient-speedlight-reverse': 'linear-gradient(135deg, #FF9800 0%, #D32F2F 100%)',
        'gradient-ocher-yellow': 'linear-gradient(135deg, #C17D11 0%, #FFEB3B 100%)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'slide-up': {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
