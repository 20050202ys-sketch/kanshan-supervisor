/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 刘看山主题色 & 知识节点状态色
        mountain: { DEFAULT: "#2f6f5e", dark: "#1f4a3e", light: "#e6f2ee" },
        node: {
          gray: "#c7ccd1", // 未学习
          yellow: "#f5c542", // 接触过、不稳定
          green: "#3fae7a", // 已掌握
        },
      },
      keyframes: {
        shake: {
          "0%,100%": { transform: "translate(0,0)" },
          "20%": { transform: "translate(-6px,4px)" },
          "40%": { transform: "translate(6px,-4px)" },
          "60%": { transform: "translate(-4px,-4px)" },
          "80%": { transform: "translate(4px,4px)" },
        },
        punchIn: {
          "0%": { transform: "scale(0.2)", opacity: "0" },
          "60%": { transform: "scale(1.4)", opacity: "1" },
          "100%": { transform: "scale(1.1)", opacity: "1" },
        },
      },
      animation: {
        shake: "shake 0.4s ease-in-out",
        punchIn: "punchIn 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
