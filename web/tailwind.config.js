/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sps: {
          primary: "#0C0068",
          secondary: "#808187",
          brand: "#0082E7",
          accent: "#00C0B6",
          hover: "#0B0970",
        },
      },
      backgroundImage: {
        "sps-btn-primary":
          "linear-gradient(137deg, #0C0068 0%, #00C0B6 100%)",
      },
      boxShadow: {
        card: "0 4px 24px rgba(12, 0, 104, 0.08)",
      },
    },
  },
  plugins: [],
};
