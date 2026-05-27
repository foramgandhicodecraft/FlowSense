/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: 'var(--bg-primary)',
        bgCard: 'var(--bg-card)',
        bgCardHover: 'var(--bg-card-hover)',
        accentBlue: 'var(--accent-blue)',
        accentGreen: 'var(--accent-green)',
        accentRed: 'var(--accent-red)',
        accentYellow: 'var(--accent-yellow)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        borderColor: 'var(--border-color)',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        heading: ['"Sora"', 'sans-serif'],
      },
      boxShadow: {
        glowBlue: 'var(--shadow-glow-blue)',
        glowGreen: 'var(--shadow-glow-green)',
      }
    },
  },
  plugins: [],
}
