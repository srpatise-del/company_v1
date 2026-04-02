/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8f5",
          100: "#d5eee5",
          500: "#118c6f",
          600: "#0f735d",
          700: "#0f5d4d",
          900: "#0b2f2c"
        },
        accent: "#d97706"
      },
      boxShadow: {
        soft: "0 18px 40px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};
