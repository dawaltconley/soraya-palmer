import type { ResponsiveImageData } from './build/images'
import type { Metadata } from '@11ty/eleventy-img'
import type { ImageCardProps } from '@components/ImageCard'
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

export interface TinaImageControls {
  alt?: string | null
  imageSize?: string | null
  imagePosition?: { x?: number | null; y?: number | null } | null
}

const isImageSize = (str: string): str is 'cover' | 'contain' =>
  str === 'cover' || str === 'contain'

export const getTinaImage = (
  imagePath: string,
  imageControls?: TinaImageControls | null,
  responsive: ResponsiveImageData = {},
): Pick<ImageCardProps, 'image' | 'alt' | 'imageSize' | 'imagePosition'> => {
  const image = getMetadata(imagePath, responsive)
  const { x, y } = imageControls?.imagePosition || {}
  return {
    image,
    alt: imageControls?.alt || undefined,
    imageSize:
      imageControls?.imageSize && isImageSize(imageControls.imageSize)
        ? imageControls.imageSize
        : undefined,
    imagePosition:
      ((typeof x === 'number' || typeof y === 'number') && [
        x || 50,
        y || 50,
      ]) ||
      undefined,
  }
}
