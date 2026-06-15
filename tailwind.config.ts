import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        race: "rgb(var(--color-primary-rgb) / <alpha-value>)",
        ink: "rgb(var(--color-background-rgb) / <alpha-value>)",
        steel: "rgb(var(--color-secondary-rgb) / <alpha-value>)"
      },
      fontFamily: { sans: ["Arial", "Helvetica", "sans-serif"] }
    }
  },
  plugins: []
} satisfies Config;
