import { defineConfig } from 'astro/config'

import * as sass from 'sass'
import mkTwFunctions from 'sass-tailwind-functions/modern'
import react from '@astrojs/react'
import tina from 'astro-tina'
import { getSassFunctions } from '@dawaltconley/responsive-images/sass'
import imageConfig from './src/lib/build/image-config'

const { pathname: twConfig } = new URL('./tailwind.config.cjs', import.meta.url)

// https://astro.build/config
export default defineConfig({
  site: 'https://sorayapalmer.com',
  output: 'static',
  integrations: [react(), tina()],
  vite: {
    build: {
      emptyOutDir: false,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
          includePaths: ['node_modules', 'src/styles'],
          quietDeps: true,
          functions: {
            ...mkTwFunctions(sass, twConfig),
            ...getSassFunctions(imageConfig),
          },
        },
      },
    },
  },
})
