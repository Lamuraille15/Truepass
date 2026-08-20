import type { Config } from "tailwindcss";

// truepass — DESIGN SYSTEM
// Palette : Gelap (sombre) + Brand (vert émeraude) + Accent (rose fuchsia)
// Police : Poppins via next/font/google
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#10B981",
          light: "#34D399",
          dark: "#059669",
          50: "#ECFDF5",
          100: "#D1FAE5",
          soft: "#A7F3D0",
        },
        accent: {
          DEFAULT: "#EC4899",
          light: "#F472B6",
          dark: "#DB2777",
        },
        gelap: {
          DEFAULT: "#0a0a0a",
          50:  "#171717",
          100: "#171717",
          200: "#262626",
          300: "#404040",
          400: "#525252",
          500: "#737373",
          soft: "#F4F4F5",
          line: "#E4E4E7",
          surface: "#0f1f17",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        card: "0 8px 24px rgba(15, 31, 23, 0.10)",
        ring: "0 0 0 4px rgba(16, 185, 129, 0.20)",
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
export default config;
