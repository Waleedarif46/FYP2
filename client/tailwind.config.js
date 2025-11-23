/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81"
        },
        accent: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
          800: "#155E75",
          900: "#164E63"
        },
        ink: "#0F172A",
        mist: "#F4F6FB"
      },
      fontFamily: {
        sans: ['"Manrope"', "Inter", "system-ui", "sans-serif"],
        display: ['"Space Grotesk"', '"Manrope"', "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 25px 50px -25px rgba(15, 23, 42, 0.25)",
        glow: "0 20px 45px rgba(99, 102, 241, 0.35)",
        card: "0 10px 30px rgba(15, 23, 42, 0.08)"
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at top, rgba(99,102,241,0.25), transparent 55%)",
        "grid-light":
          "linear-gradient(0deg, rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: [],
  important: true
}