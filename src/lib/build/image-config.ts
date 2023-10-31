import { ResponsiveImages } from '@dawaltconley/responsive-images'

const isProduction = import.meta.env.MODE === 'production'

export default new ResponsiveImages({
  scalingFactor: 0.5,
  defaults: {
    formats: ['webp', null],
    outputDir: './dist/_responsive-images/',
    urlPath: isProduction
      ? '/_responsive-images/'
      : '/dist/_responsive-images/',
  },
  disable: !isProduction,
})
