import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './features/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#e8eeff',
          500: '#4f46e5',
          600: '#4338ca',
          700: '#3730a3'
        }
      },
      boxShadow: {
        soft: '0 18px 45px -20px rgba(79, 70, 229, 0.3)'
      }
    }
  },
  plugins: []
};

export default config;
