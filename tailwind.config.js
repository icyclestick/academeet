/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        oldLace: "#f8f3e5",
        jasmine: "#f7dc76",
        jasper: "#d25c41",
        coolGray: {
          100: "#8b98b0",
          200: "#96a1b7",
        },
        englishViolet: "#503e74",
        eerieBlack: "#222527",
        night: "#171516",
      },
    },
  },
  plugins: [],
}