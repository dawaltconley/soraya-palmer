import { ResponsiveImages } from '@dawaltconley/responsive-images'
import { devices } from '../../data/devices'

const isProduction = process.env.NODE_ENV === 'production'

const config = new ResponsiveImages({
  devices,
  scalingFactor: 0.5,
  defaults: {
    formats: ['webp', null],
    outputDir: './dist/_responsive-images/',
    urlPath: isProduction
      ? '/_responsive-images/'
      : '/dist/_responsive-images/',
    fixOrientation: true,
  },
  disable: !isProduction,
})

export default config
export const { responsive } = config
