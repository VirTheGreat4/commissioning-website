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
        "pastel-yellow": "#FEF08A",
        "pastel-pink": "#FBCFE8",
        "pastel-blue": "#BAE6FD",
        "pastel-purple": "#E9D5FF",
        "pastel-gray": "#E2E8F0",
      },
      boxShadow: {
        neopop: "4px 4px 0px 0px #000",
        "neopop-active": "1px 1px 0px 0px #000",
      },
    },
  },
  plugins: [],
};

export default config;
