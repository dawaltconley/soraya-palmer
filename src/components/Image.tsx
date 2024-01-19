import type { ImageMetadata } from '@dawaltconley/responsive-images'
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  type ComponentPropsWithoutRef,
  // type Ref,
  type RefObject,
} from 'react'

export type Metadata = ImageMetadata['metadata']

export interface ImageProps extends ComponentPropsWithoutRef<'picture'> {
  src: string | ImageMetadata
  alt: string
  sizes?: string
  imgRef?: RefObject<HTMLImageElement>
  imgProps?: ComponentPropsWithoutRef<'img'>
}

export default forwardRef<HTMLPictureElement, ImageProps>(function Image(
  {
    src,
    alt,
    sizes: sizesProp,
    imgRef = useRef(null),
    imgProps = {},
    ...picture
  },
  pictureRef,
) {
  const isResponsive = typeof src === 'object'
  const metaValues = isResponsive ? Object.values(src.metadata) : [[]]
  const sizes =
    sizesProp ||
    (isResponsive && typeof src.sizes === 'string' && src.sizes) ||
    undefined
  const smallest = metaValues[metaValues.length - 1][0]
  const biggest = metaValues[metaValues.length - 1][metaValues[0].length - 1]

  const [fallback, setFallback] = useState<{
    width: number
    height: number
  } | null>(null)
  useEffect(() => {
    if (isResponsive) return
    console.log('new src', src)
    imgRef.current?.addEventListener('load', () => {
      if (!imgRef.current) return
      setFallback({
        width: imgRef.current.naturalWidth,
        height: imgRef.current.naturalHeight,
      })
    })
  }, [src])

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
      {!isResponsive && fallback && (
        <source
          key="fallback"
          srcSet={`${src} ${fallback.width}w`}
          sizes={sizes}
        />
      )}
      <img
        ref={imgRef}
        src={!isResponsive ? src : smallest?.url}
        width={biggest?.width || fallback?.width}
        height={biggest?.height || fallback?.height}
        alt={alt}
        loading="lazy"
        decoding="async"
        {...imgProps}
      />
    </picture>
  )
})
