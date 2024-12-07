import type { Config } from "tailwindcss";
import daisyui from 'daisyui'
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
     "node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        colorInput: "var(--color-input)",
        primaryColor: "var(--primary-color)",
        navbar: "var(--navbar)",
        search: "var(--search)",
        textColor: "var(--text-color)",
        backgroundImg: "var(--background-second)",
        backgroundIcon: "var(--background-icon)",
        backGround: "var(--background)"
      },
    },
    screens: {
      'phone': '200px',
      'tablet': '640px',
      'laptop': '1024px',
      'desktop': '1280px',
    },
    daisyui: {
      
    },
    mode: 'jit',
  },
  plugins: [daisyui],
};
export default config;
