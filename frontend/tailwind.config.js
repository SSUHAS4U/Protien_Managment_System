/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // Preflight OFF so Tailwind's CSS reset does not fight MUI's CssBaseline.
  // We only use Tailwind utilities (gradients, blur, transforms) on opt-in
  // components such as the 21st.dev hero.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      fontFamily: {
        display: ["'Barlow Condensed'", 'sans-serif'],
        body: ["'Barlow'", 'sans-serif'],
      },
    },
  },
  plugins: [],
};
