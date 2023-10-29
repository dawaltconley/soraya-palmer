import type { Config } from 'tailwindcss'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '~/tailwind.config.cjs'
import toPath from 'lodash/toPath'

const config = resolveConfig<Config>(tailwindConfig)

export default config

export const resolveColor = (
  path: any,
  colors = config.theme?.colors,
): string | undefined => {
  if (!colors) return undefined
  const [p, ...rest] = toPath(path)
  if (p in colors) {
    const color = colors[p]
    if (typeof color === 'string') {
      return color
    }
    return resolveColor(rest, color)
  }
  return undefined
}
