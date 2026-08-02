import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pageBg: "#0E1420",
        primaryText: "#EDEEF2",
        mutedText: "#6B7280",
        cardBg: "#1B2333",
        accent: "#F5A623",
        brand: {
          50: '#FEF6E7',
          100: '#FDECC8',
          200: '#FBD98C',
          300: '#F9C355',
          400: '#F7B73E',
          500: '#F5A623',
          600: '#D68C12',
          700: '#B06F0D',
          800: '#8A560F',
          900: '#6E4610',
          950: '#3D2408',
        },
        rose: {
          50: '#FBEEF0',
          100: '#F6D9DD',
          200: '#EFB9C0',
          300: '#E599A3',
          400: '#DE8590',
          500: '#D9707A',
          600: '#C05863',
          700: '#9E4750',
          800: '#7C393F',
          900: '#5F2C31',
          950: '#3A1B1E',
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
