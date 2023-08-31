import { ResponsiveImages } from '@dawaltconley/responsive-images';

export default new ResponsiveImages({
  scalingFactor: 0.5,
  defaults: {
    formats: ['webp', null],
    outputDir: './dist/_responsive-images/',
    urlPath: import.meta.env.PROD
      ? '/_responsive-images/'
      : '/dist/_responsive-images/',
  },
  disable: !import.meta.env.PROD,
});
