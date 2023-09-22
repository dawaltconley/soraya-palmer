import { defineConfig } from 'astro/config'

import path from 'node:path'
import * as sass from 'sass'
import mkTwFunctions from 'sass-tailwind-functions'
import react from '@astrojs/react'
import tina from 'astro-tina'

const twFunctions = mkTwFunctions(sass, path.resolve('./tailwind.config.cjs'))

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [react(), tina()],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ['node_modules', 'src/styles'],
          quietDeps: true,
          functions: {
            ...twFunctions,
          },
        },
      },
    },
  },
})
