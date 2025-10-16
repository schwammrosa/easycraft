/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          darker: '#1a2938',
          dark: '#2c3e50',
          medium: '#34495e',
          light: '#4a6278',
          lighter: '#5a7a9a',
        },
        accent: {
          gold: '#f39c12',
          'gold-dark': '#d68910',
          'gold-light': '#f5b041',
          green: '#27ae60',
          'green-dark': '#1e8449',
          'green-light': '#52be80',
          red: '#e74c3c',
          'red-dark': '#c0392b',
          'red-light': '#ec7063',
          blue: '#3498db',
          'blue-dark': '#2980b9',
          'blue-light': '#5dade2',
          purple: '#9b59b6',
          'purple-dark': '#8e44ad',
          'purple-light': '#af7ac5',
          orange: '#e67e22',
        },
        semantic: {
          success: '#27ae60',
          error: '#e74c3c',
          warning: '#f39c12',
          info: '#3498db',
        },
        bg: {
          darker: '#0a0a14',
          dark: '#111122',
          main: '#1a1a2e',
          panel: '#16213e',
          input: '#0f3460',
          hover: '#1a4478',
        },
        text: {
          primary: '#ffffff',
          secondary: '#d1d5db',
          tertiary: '#9ca3af',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(243, 156, 18, 0.3)',
        'glow-md': '0 0 20px rgba(243, 156, 18, 0.4)',
        'glow-lg': '0 0 30px rgba(243, 156, 18, 0.5)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'slide-in-right': 'slideInFromRight 0.3s ease-out',
        'slide-in-bottom': 'slideInFromBottom 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'zoom-in': 'zoomIn 0.3s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        slideInFromRight: {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromBottom: {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        zoomIn: {
          'from': { transform: 'scale(0.95)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
          },
          '50%': { 
            opacity: '0.8',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
          },
        },
      },
    },
  },
  plugins: [],
}
