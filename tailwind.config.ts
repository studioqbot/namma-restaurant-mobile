import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        center: true, 
        padding: '0 15px', 
      },
      screens: {
        lg: '1300px', 
      },
      fontFamily: {
        'unbounded': ['"Unbounded"', 'serif'],
        'instrument': ['"Instrument Sans"', 'serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  
  plugins: [],
} satisfies Config;
