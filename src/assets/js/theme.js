/* ==========================================================================
   Warm Stitch — Tailwind theme
   Loaded straight after the Tailwind CDN so the brand palette and fonts are
   available to every utility class on the page.
   ========================================================================== */

tailwind.config = {
  theme: {
    extend: {
      colors: {
        /* Warm neutral scale: cream at the low end, espresso at the high end.
           The light theme uses 50-200 for surfaces and 600-900 for ink. */
        brand: {
          50:  '#FAF8F5',
          100: '#F5EFE6',
          200: '#E8DBCE',
          300: '#D5C1AE',
          400: '#B89B82',
          500: '#9B785E',
          600: '#7F5E47',
          700: '#634735',
          800: '#2A1E17',
          900: '#1A110B'
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif']
      }
    }
  }
};
