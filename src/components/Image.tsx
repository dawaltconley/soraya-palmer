import type { ImageMetadata } from '@dawaltconley/responsive-images'
import { forwardRef, type ComponentPropsWithoutRef, type Ref } from 'react'

export type Metadata = ImageMetadata['metadata']

export interface ImageProps extends ComponentPropsWithoutRef<'picture'> {
  src: string | ImageMetadata
  alt: string
  sizes?: string
  imgRef?: Ref<HTMLImageElement>
  imgProps?: ComponentPropsWithoutRef<'img'>
}

export default forwardRef<HTMLPictureElement, ImageProps>(function Image(
  { src, alt, sizes: sizesProp, imgRef, imgProps = {}, ...picture },
  pictureRef,
) {
  const isResponsive = typeof src === 'object'
  const metaValues = isResponsive ? Object.values(src.metadata) : [[]]
  const sizes =
    sizesProp ||
    (isResponsive && typeof src.sizes === 'string' && src.sizes) ||
    undefined
  const smallest = metaValues[0][0]
  const biggest = metaValues[0][metaValues[0].length - 1]

  return (
    <picture ref={pictureRef} {...picture}>
      {isResponsive &&
        metaValues.map((imageFormat) => (
          <source
            key={imageFormat[0].sourceType}
            type={imageFormat[0].sourceType}
            srcSet={imageFormat.map((img) => img.srcset).join(', ')}
            sizes={sizes}
          />
        ))}
      <img
        ref={imgRef}
        src={!isResponsive ? src : smallest?.url}
        width={biggest?.width}
        height={biggest?.height}
        alt={alt}
        loading="lazy"
        decoding="async"
        {...imgProps}
      />
    </picture>
  )
})
