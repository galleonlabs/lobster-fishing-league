import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        "bounce-slow": "bounce 3s infinite",
        wave: "wave 3s ease-in-out infinite",
        "fishing-rod": "fishingRod 1s ease-in-out infinite",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(10px)" },
        },
        fishingRod: {
          "0%, 100%": { transform: "rotate(-10deg)" },
          "50%": { transform: "rotate(10deg)" },
        },
      },
      fontFamily: {
        sans: ["VT323", ...defaultTheme.fontFamily.sans],
        mono: ["VT323", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        primary: {
          light: "#E6F3FF", // Light sky blue (representing clear skies)
          DEFAULT: "#4A90E2", // Ocean blue (main water color)
          dark: "#2C3E50", // Deep sea blue (for depth and mystery)
        },
        secondary: {
          light: "#FFF9E6", // Soft sand color (for beaches)
          DEFAULT: "#F39C12", // Warm sunset orange (for atmosphere)
          dark: "#D35400", // Deep orange (for contrast and warmth)
        },
        neutral: {
          light: "#ECF0F1", // Light gray with a hint of blue (seafoam)
          DEFAULT: "#BDC3C7", // Medium gray (rocks and pebbles)
          dark: "#7F8C8D", // Darker gray (wet stones)
        },
        text: {
          light: "#34495E", // Slate blue (for readable but thematic text)
          DEFAULT: "#2C3E50", // Dark blue-gray (main text color)
          dark: "#1A2530", // Very dark blue (for high contrast text)
        },
      },
    },
    container: {
      center: true,
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
