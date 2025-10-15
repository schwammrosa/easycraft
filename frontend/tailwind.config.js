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
          dark: '#2c3e50',
          medium: '#34495e',
          light: '#4a6278',
        },
        accent: {
          gold: '#f39c12',
          green: '#27ae60',
          red: '#e74c3c',
          blue: '#3498db',
          purple: '#9b59b6',
        },
        bg: {
          main: '#1a1a2e',
          panel: '#16213e',
          input: '#0f3460',
        },
        text: {
          primary: '#eaeaea',
          secondary: '#a8a8a8',
        },
      },
    },
  },
  plugins: [],
}
