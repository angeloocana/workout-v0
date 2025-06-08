import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Add shadcn/ui theme extensions here if needed
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
