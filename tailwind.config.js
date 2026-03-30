/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E8E4DD",     // Paper
        accent: "#E63B2E",      // Signal Red
        background: "#F5F3EE",  // Off-white
        dark: "#111111",        // Black
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        drama: ['"DM Serif Display"', 'serif'],
        data: ['"Space Mono"', 'monospace'],
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
      letterSpacing: {
        tight: '-0.02em',
        tighter: '-0.04em',
      },
    },
  },
  plugins: [],
}
