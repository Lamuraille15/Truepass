import type { Config } from "tailwindcss";

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
        },
        accent: {
          DEFAULT: "#EC4899",
        },
        gelap: {
          DEFAULT: "#0a0a0a",
          50:  "#171717",
          100: "#1f1f1f",
          200: "#262626",
          300: "#404040",
          400: "#525252",
          500: "#737373",
        },
        navy:  { DEFAULT: "#0b1733" },
        gold:  { DEFAULT: "#d4af37" },
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
