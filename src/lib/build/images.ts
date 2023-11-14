import type { ImageMetadata } from '@dawaltconley/responsive-images'
import path from 'node:path'
import imageConfig from './image-config'
import { toUrl } from '../utils'

export interface ImageData {
  path: string
  sizes?: string
  alt?: string
}

export type ResponsiveImageData = Record<string, ImageMetadata>

export const normalizeImagePath = (image: string): string =>
  toUrl(image)?.href || path.resolve('./public', `.${image}`)

const processImageData = async ({
  path: image,
  sizes,
  alt = '',
}: ImageData): Promise<ImageMetadata> =>
  imageConfig.metadataFromSizes(normalizeImagePath(image), {
    sizes,
    alt,
  })

export const makeResponsive = async (
  images: ImageData[],
): Promise<ResponsiveImageData> =>
  Object.fromEntries(
    await Promise.all(
      images.map((i) => Promise.all([i.path, processImageData(i)])),
    ),
  )
