/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gridTemplateColumns: {
        sidebar: "300px auto", // 👈 for sidebar layout. adds grid-cols-sidebar class
        "sidebar-collapsed": "114px auto",
      },
      gridTemplateRows: {
        header: "56px auto", // 👈 for the navbar layout. adds grid-rows-header class
      },
      colors: {
        blurple: "#0952cc",
      },
    },
  },
  plugins: [],
};
