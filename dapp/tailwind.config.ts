import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        "bounce-slow": "bounce 3s infinite",
      },
      fontFamily: {
        sans: ["scape", "Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          light: "#E6F3FF", // Very light blue
          DEFAULT: "#B3D9FF", // Light blue
          dark: "#80BFFF", // Medium blue
        },
        secondary: {
          light: "#FFF5E6", // Very light orange
          DEFAULT: "#FFE0B3", // Light orange
          dark: "#FFCC80", // Medium orange
        },
        neutral: {
          light: "#F5F5F5", // Very light gray
          DEFAULT: "#E0E0E0", // Light gray
          dark: "#BDBDBD", // Medium gray
        },
        text: {
          light: "#4A4A4A", // Dark gray
          DEFAULT: "#333333", // Very dark gray
          dark: "#1A1A1A", // Almost black
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
