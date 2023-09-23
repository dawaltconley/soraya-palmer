const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
  theme: {
    container: {
      padding: {
        DEFAULT: '2rem',
      },
    },
    extend: {
      fontFamily: {
        // sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
        // sans: ['Helvetica Neue', 'serif'],
        sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
        // sans: ['Lato', 'serif'],
        // serif: ['Playfair', ...defaultTheme.fontFamily.serif],
        serif: ['Georgia', ...defaultTheme.fontFamily.serif],
        // serif: ['Lora', 'Georgia', ...defaultTheme.fontFamily.serif],
        // serif: ['Merriweather', ...defaultTheme.fontFamily.serif],
        display: ['Playfair Display', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        gray: colors.neutral,
      },
      inset: {
        'almost-full': 'calc(100% - 1px)',
      },
    },
  },
  plugins: [
    plugin(({ matchUtilities, matchComponents, theme }) => {
      matchUtilities(
        {
          'min-aspect': (value) => ({
            '&::before': {
              content: "''",
              paddingTop: value,
              float: 'left',
            },
            '&::after': {
              content: "''",
              display: 'table',
              clear: 'both',
            },
          }),
        },
        {
          values: Object.entries(theme('aspectRatio')).reduce(
            (values, [k, aspect]) => {
              let n = Number(aspect)
              if (Number.isNaN(n)) {
                const [x, y] = aspect.split('/').map(Number)
                n = y / x
              }
              if (Number.isNaN(n)) return values
              return {
                ...values,
                [k]: (100 * n).toFixed(2) + '%',
              }
            },
            {},
          ),
        },
      )
      matchComponents(
        {
          'h-line': (value) => ({
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            '&::before, &::after': {
              content: "''",
              flex: '1 1 auto',
              borderTopWidth: value,
              borderTopColor: 'inherit',
              borderTopStyle: 'inherit',
            },
            '&::before': {
              marginRight: '0.5em',
            },
            '&::after': {
              marginLeft: '0.5em',
            },
          }),
        },
        {
          values: theme('borderWidth'),
        },
      )
    }),
  ],
}
