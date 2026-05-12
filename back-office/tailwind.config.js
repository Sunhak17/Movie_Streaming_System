/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(16, 185, 129, 0.14), 0 24px 60px rgba(2, 6, 23, 0.45)',
      },
      backgroundImage: {
        'back-office-shell':
          'radial-gradient(circle at top left, rgba(34, 197, 94, 0.14), transparent 30%), radial-gradient(circle at bottom right, rgba(6, 182, 212, 0.12), transparent 28%), linear-gradient(135deg, #020617 0%, #0f172a 55%, #111827 100%)',
      },
    },
  },
  plugins: [],
};