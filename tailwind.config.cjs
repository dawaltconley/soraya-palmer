const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

const dynamicViewports = {
  'screen-d': ['100vh', '100dvh'],
  'screen-s': ['100vh', '100svh'],
  'screen-l': ['100vh', '100lvh'],
}

/** @type import('tailwindcss').Config */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
        serif: ['Lora', 'Georgia', ...defaultTheme.fontFamily.serif],
        display: ['Playfair Display', ...defaultTheme.fontFamily.serif],
      },
      fontSize: {
        smaller: 'smaller',
        larger: 'larger',
      },
      inset: {
        'almost-full': 'calc(100% - 1px)',
      },
      height: dynamicViewports,
      minHeight: dynamicViewports,
      maxHeight: dynamicViewports,
      aspectRatio: {
        og: '1200 / 630',
        cover: '794 / 1199',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
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
