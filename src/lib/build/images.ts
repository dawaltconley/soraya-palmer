import type { ImageMetadata } from '@dawaltconley/responsive-images'
import crypto from 'node:crypto'
import fsp from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
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

export const makeOg = async (image: string): Promise<string> => {
  const buffer = await sharp(normalizeImagePath(image))
    .resize(1200, 630, {
      fit: 'cover',
      withoutEnlargement: false,
    })
    .toFormat('png')
    .toBuffer()
  const fileName =
    crypto.createHash('md5').update(buffer).digest('hex') + '.png'
  const filePath = path.join(
    imageConfig.defaults.outputDir || './dist',
    fileName,
  )
  await fsp.writeFile(filePath, buffer)
  return fileName
}
