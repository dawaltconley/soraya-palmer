import { defineConfig } from 'astro/config'

import * as sass from 'sass'
import mkTwFunctions from 'sass-tailwind-functions/legacy'
import react from '@astrojs/react'
import tina from 'astro-tina'
import responsiveImages from './src/lib/build/image-config'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const { pathname: twConfig } = new URL('./tailwind.config.cjs', import.meta.url)
const { pathname: pdfFonts } = new URL(
  './node_modules/pdfjs-dist/standard_fonts',
  import.meta.url,
)

// https://astro.build/config
export default defineConfig({
  site: 'https://sorayapalmer.com',
  output: 'static',
  integrations: [react(), tina()],
  vite: {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: pdfFonts,
            dest: '',
          },
        ],
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ['node_modules', 'src/styles'],
          quietDeps: true,
          functions: {
            ...mkTwFunctions(sass, twConfig),
            ...responsiveImages.sassLegacyFunctions,
          },
        },
      },
    },
  },
})
