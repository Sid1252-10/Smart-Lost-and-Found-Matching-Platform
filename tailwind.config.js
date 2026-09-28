/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        pirate: {
          gold: "#f59e0b",
          "gold-bright": "#fbbf24",
          "gold-glow": "rgba(245, 158, 11, 0.4)",
          red: "#991b1b",
          crimson: "#7f1d1d",
        },
        roger: {
          crimson: "#b91c1c",
          gold: "#d97706",
        },
        sea: {
          deep: "#0f1729",
          dark: "#162040",
          navy: "#1a2d52",
          slate: "#1e293b",
        },
        parchment: {
          bg: "#f8f3e6",
          card: "#fbf6ea",
          dark: "#e8dcbf",
          border: "#bca476",
          text: "#2c1810",
        },
        wood: {
          dark: "#2d1810",
          border: "#5c3a21",
        },
      },
      fontFamily: {
        pirate: ["var(--font-pirate)", "Pirata One", "cursive"],
        heading: ["var(--font-heading)", "Cinzel Decorative", "serif"],
        body: ["var(--font-body)", "Outfit", "sans-serif"],
        scroll: ["var(--font-scroll)", "MedievalSharp", "cursive"],
      },
    },
  },
  plugins: [],
};
