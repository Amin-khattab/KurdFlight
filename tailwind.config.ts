import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#070B18",
        mist: "#D9E7FF",
        aurora: "#6EE7F9",
        ember: "#FF8A5B",
        violet: "#8B5CF6",
      },
      boxShadow: {
        glow: "0 20px 80px rgba(110, 231, 249, 0.22)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
      },
      animation: {
        float: "float 14s ease-in-out infinite",
        drift: "drift 18s ease-in-out infinite",
        pulseSlow: "pulseSlow 8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        drift: {
          "0%, 100%": { transform: "translateX(0px) translateY(0px)" },
          "50%": { transform: "translateX(24px) translateY(-14px)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
