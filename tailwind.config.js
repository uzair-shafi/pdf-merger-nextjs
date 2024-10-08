/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      red: "#FE3323",
      white: "#ffffff",
    },
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(180deg, #FEEAE9 0%, rgba(254, 234, 233, 0) 100%)",
      },
      boxShadow: {
        "custom-black": "0px 0px 30px 0px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
