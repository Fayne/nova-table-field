const path = require('path');

// Nova exposes its palette as CSS custom properties on :root (e.g. --colors-gray-900,
// --colors-primary-500), where `gray` is Tailwind's slate scale and `primary` is sky.
// Point this package's (o1-prefixed) color utilities at those same variables so our
// classes render identically to Nova in both light and dark mode — e.g. o1-bg-gray-900
// produces the exact `.form-input` dark background.
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const novaColor = name =>
  Object.fromEntries(shades.map(shade => [shade, `rgba(var(--colors-${name}-${shade}))`]));

module.exports = {
  content: [path.resolve(__dirname, 'resources/**/*.{vue,js,ts,jsx,tsx,scss}')],
  prefix: 'o1-',
  // Nova toggles `.dark` on <html>. Tailwind's `prefix` rewrites every `.class` token
  // in the dark selector to `.o1-dark` (true for 'class' and even the raw 'variant'
  // form), which never matches Nova. An attribute selector carries no `.class` token,
  // so the prefixer leaves it alone — `[class~="dark"]` matches Nova's `.dark` exactly.
  darkMode: ['variant', '[class~="dark"] &'],
  theme: {
    extend: {
      colors: {
        gray: novaColor('gray'),
        primary: novaColor('primary'),
      },
    },
  },
  safelist: [],
};
