/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F2F7F4',
          100: '#E8F1E9',
          200: '#C9DEC9',
          300: '#9BC39E',
          400: '#6FA474',
          500: '#4E8B62',
          600: '#3D724E',
          700: '#2F593E',
          800: '#234430',
          900: '#173F35',
          950: '#0D2620',
        },
        brand: {
          primary: '#173F35',
          secondary: '#4E8B62',
          light: '#E8F1E9',
          bg: '#F7F9F6',
          card: '#FFFFFF',
          text: '#1F2937',
          muted: '#64748B',
          border: '#E5EAE5',
        },
        agri: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(23, 63, 53, 0.05), 0 1px 2px 0 rgba(23, 63, 53, 0.03)',
        'card': '0 4px 6px -1px rgba(23, 63, 53, 0.04), 0 2px 4px -1px rgba(23, 63, 53, 0.02)',
        'elevated': '0 10px 15px -3px rgba(23, 63, 53, 0.06), 0 4px 6px -2px rgba(23, 63, 53, 0.03)',
      }
    },
  },
  plugins: [],
}
