/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bdm: {
          bg: "#090D16",
          sidebar: "#0D1421",
          card: "#151E2E",
          cardSecondary: "#1B2638",
          cardHover: "#202E44",
          primary: "#1677FF",
          electric: "#38BDF8",
          textPrimary: "#F8FAFC",
          textSecondary: "#AAB5C8",
          border: "#29364A",
          borderLight: "#374A66",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
