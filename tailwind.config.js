/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
    fontFamily: {
      quicksand: ["QuickSand-Regular"],
      "quicksand-bold": ["QuickSand-Bold"],
      "quicksand-light": ["QuickSand-Light"],
      "quicksand-medium": ["QuickSand-Medium"],
      "quicksand-semibold": ["QuickSand-SemiBold"],
    },
  },
  plugins: [],
}