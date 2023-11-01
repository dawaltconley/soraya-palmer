import type { ResponsiveImageData } from './build/images'
import type { Metadata } from '@11ty/eleventy-img'
import { toUrl } from './utils'

export const tinaAssets = /^https:\/\/assets.tina.io\/[a-f0-9\-]*/

export const fixTinaMalformedPath = (image: string): string =>
  toUrl(image.replace(tinaAssets, ''))?.href || image

export const getMetadata = (
  path: string,
  responsive: ResponsiveImageData = {},
): string | Metadata => {
  const image = fixTinaMalformedPath(path)
  return responsive[image]?.metadata || image
}
