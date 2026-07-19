 /** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F19",
        darkCard: "rgba(255, 255, 255, 0.04)",
        borderCard: "rgba(255, 255, 255, 0.08)",
        accentIndigo: "#6366F1",
        accentGreen: "#10B981",
        accentRed: "#EF4444",
        accentYellow: "#F59E0B"
      }
    },
  },
  plugins: [],
}  