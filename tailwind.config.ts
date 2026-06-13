import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { race: "#ff5a00", ink: "#070707", steel: "#a6a6a6" },
      fontFamily: { sans: ["Arial", "Helvetica", "sans-serif"] }
    }
  },
  plugins: []
} satisfies Config;
