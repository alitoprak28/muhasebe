/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        muted: "#5b6477",
        line: "#d7deea",
        panel: "#f5f7fb",
        brand: {
          50: "#eff8ff",
          100: "#d8eeff",
          200: "#b4ddff",
          300: "#7ec3ff",
          400: "#45a4ff",
          500: "#1d86ff",
          600: "#0b69db",
          700: "#0a53ad",
          800: "#0f488d",
          900: "#143c73",
        },
        accent: {
          50: "#eefbf5",
          100: "#d7f6e7",
          500: "#2fa26f",
          600: "#26835a",
        },
        warning: {
          50: "#fff7ed",
          100: "#ffedd5",
          500: "#f97316",
          600: "#ea580c",
        },
        danger: {
          50: "#fff1f2",
          100: "#ffe4e6",
          500: "#e11d48",
          600: "#be123c",
        },
      },
      fontFamily: {
        heading: ["Manrope", "sans-serif"],
        body: ["IBM Plex Sans", "sans-serif"],
      },
      boxShadow: {
        panel: "0 20px 60px -32px rgba(15, 23, 42, 0.32)",
        soft: "0 14px 40px -26px rgba(15, 23, 42, 0.24)",
      },
      backgroundImage: {
        "mesh-soft":
          "radial-gradient(circle at top left, rgba(29,134,255,0.16), transparent 34%), radial-gradient(circle at right center, rgba(47,162,111,0.12), transparent 28%), linear-gradient(180deg, #f7f9fc 0%, #eef3f8 100%)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

