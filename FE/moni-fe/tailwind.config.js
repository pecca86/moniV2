/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stripe: {
          navy: '#0A2540',
          'navy-light': '#1A3A5C',
          purple: '#635BFF',
          'purple-hover': '#7A73FF',
          bg: '#F6F9FC',
          'text-primary': '#1A1F36',
          'text-secondary': '#3C4257',
          'text-muted': '#697386',
          border: '#E3E8EF',
          success: '#09825D',
          'success-bg': '#D7F7EE',
          danger: '#DF1B41',
          'danger-bg': '#FFF0F3',
          info: '#0055DE',
          'info-bg': '#EEF4FF',
        }
      },
      boxShadow: {
        'stripe-sm': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'stripe': '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.04)',
        'stripe-lg': '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [],
}
