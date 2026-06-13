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
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c0d1ff',
          300: '#93acff',
          400: '#607dff',
          500: '#3b52ff',
          600: '#2030f5',
          700: '#1a26e0',
          800: '#1b22b5',
          900: '#1c238e',
          950: '#11145c',
        },
        threat: {
          low:    '#22c55e',
          medium: '#f59e0b',
          high:   '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
