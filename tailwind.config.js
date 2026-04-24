/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5F2EC",  // Cream
        dark: "#1A1F25",        // Deep slate
        petrol: "#1A6B6D",      // Brand accent on light
        signal: "#4FC3B0",      // Brand accent on dark
        copper: "#C4854C",      // CTAs
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        data: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      letterSpacing: {
        tight: '-0.02em',
        tighter: '-0.04em',
      },
    },
  },
  plugins: [],
}
