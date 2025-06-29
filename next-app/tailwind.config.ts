import type { Config } from "tailwindcss";

export default {
  darkMode: 'class', // 다크모드 class 기반
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  corePlugins: {
    preflight: false,  // ← 여기에 넣기, 기본 스타일 리셋 끄기
  },

  plugins: [],
} satisfies Config;
