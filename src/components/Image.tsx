import type { ImageMetadata } from '@dawaltconley/responsive-images'
import type { ComponentPropsWithoutRef, Ref } from 'react'
import { forwardRef } from 'react'

export type Metadata = ImageMetadata['metadata']

export interface ImageProps extends ComponentPropsWithoutRef<'picture'> {
  metadata: string | Metadata
  alt: string
  sizes?: string
  imgRef?: Ref<HTMLImageElement>
  imgProps?: ComponentPropsWithoutRef<'img'>
}

export default forwardRef<HTMLPictureElement, ImageProps>(function Image(
  { metadata, alt, sizes, imgRef, imgProps = {}, ...picture },
  pictureRef,
) {
  const isResponsive = typeof metadata === 'object'
  const metaValues = isResponsive ? Object.values(metadata) : [[]]
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
        src={!isResponsive ? metadata : smallest?.url}
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
