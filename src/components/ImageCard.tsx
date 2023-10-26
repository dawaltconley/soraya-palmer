import type { ReactNode, CSSProperties } from 'react'
import clsx from 'clsx'

/*
 * Small versions
 * 1. tile in middle of image
 * 2. text below image (requires image?)
 *
 * Small preview text
 * 1. use title block
 * 2. use description block
 *
 * Large versions (only difference whether title is present)
 * 0. no image, text in middle
 * 1. all text right of image
 * 2. title below image, description to right
 */

interface ImageCardProps {
  image?: string
  alt?: string
  url?: string | URL
  children: ReactNode
  title?: ReactNode
  style?: 'card' | 'tile'
  styleLarge?: 'card' | 'tile'
  imgBasis?: string
}

export default function ImageCard({
  image,
  alt = '',
  url,
  // title,
  style = 'card',
  // styleLarge = style,
  imgBasis,
  children,
}: ImageCardProps) {
  const Wrapper = url ? 'a' : 'div'
  return (
    <Wrapper
      href={url?.toString()}
      className="group relative block h-full @container/image-card"
    >
      <div className="flex h-full w-full flex-col @2xl:flex-row">
        {image && (
          <div
            className={clsx(
              'overlay-before overlay-after before:vignette grow duration-500 before:z-10 after:z-20 after:bg-amber-300/10 after:duration-[inherit] group-hover:scale-105 group-hover:after:bg-gray-800/20 @2xl:w-1/2',
              { 'relative shrink-0 basis-[40%]': style === 'card' },
              {
                'absolute inset-0 z-0 h-full @2xl:relative': style === 'tile',
              },
            )}
            style={
              {
                '--vignette-opacity': 0.2,
                '--vignette-spread': '4rem',
                flexBasis: imgBasis,
              } as CSSProperties
            }
          >
            <img
              className="h-full w-full object-cover"
              src={image}
              alt={alt}
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
        <div
          className={clsx(
            'flex w-full min-w-[50%]',
            { 'h-full p-8': style === 'tile' },
            image ? '@2xl:h-full @2xl:w-auto @2xl:p-0' : 'bg-amber-300',
          )}
        >
          <div
            className={clsx('relative border-amber-300 bg-white', {
              'w-full': style === 'card',
              'border-t-4': style === 'card' && image,
              'm-auto border-4 drop-shadow-xl': style === 'tile',
              '@2xl:m-0 @2xl:mr-0 @2xl:h-full @2xl:border-y-0 @2xl:border-l-4 @2xl:border-r-0':
                image,
            })}
          >
            {children}
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
