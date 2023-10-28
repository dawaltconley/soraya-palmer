import type { ReactNode, CSSProperties } from 'react'
import clsx from 'clsx'

/*
 * Small versions
 * 1. tile in middle of image
 * 2. text below image (requires image?)
 *
 * TODO Small preview text
 * 1. use title block
 * 2. use description block
 *
 * TODO Large versions (only difference whether title is present)
 * 0. no image, text in middle
 * 1. all text right of image
 * 2. title below image, description to right
 */

type CardStyle = 'card' | 'tile'

export interface ImageCardProps {
  image?: string
  alt?: string
  url?: string | URL
  children: ReactNode
  title?: ReactNode
  style?: CardStyle
  styleLarge?: CardStyle
  imgClass?: string
  borderColor?: string
  linkText?: string
  linkLocation?: 'description' | 'image'
}

export default function ImageCard({
  image,
  alt = '',
  url,
  // title,
  style = 'card',
  // styleLarge = style,
  imgClass,
  borderColor,
  linkText = 'Read More',
  linkLocation = 'description',
  children,
}: ImageCardProps) {
  const Wrapper = url ? 'a' : 'div'
  if (!image) linkLocation = 'description'
  return (
    <Wrapper
      href={url?.toString()}
      className="group relative block h-full @container/image-card"
    >
      <div className="flex h-full w-full flex-col items-stretch overflow-hidden @2xl:flex-row">
        {image && (
          <div
            className={clsx(
              'overlay-before overlay-after before:vignette grow overflow-hidden transition-none duration-500 before:z-10 after:z-20 after:bg-amber-300/10 after:duration-[inherit] group-hover:after:bg-gray-800/20 @2xl:w-1/2',
              imgClass,
              {
                relative: style === 'card',
                'absolute inset-0 z-0 h-full @2xl:relative': style === 'tile',
              },
            )}
            style={
              {
                '--vignette-opacity': 0.2,
                '--vignette-spread': '4rem',
              } as CSSProperties
            }
          >
            <img
              className="h-full w-full object-cover duration-[inherit] group-hover:scale-105"
              src={image}
              alt={alt}
              loading="lazy"
              decoding="async"
            />
            {linkLocation === 'image' && url && (
              <div className="slant-edge-l absolute bottom-0 right-0 z-50 bg-gray-800 py-1 pl-2.5 pr-2 text-sm text-white duration-150 group-hover:bg-gray-900 group-hover:text-amber-300">
                {linkText}
              </div>
            )}
          </div>
        )}
        <div
          className={clsx(
            'flex w-full',
            { 'h-full p-8': style === 'tile' },
            image ? 'w-[65ch] max-w-full @2xl:p-0' : 'bg-amber-300',
          )}
        >
          <div
            className={clsx('relative w-full max-w-prose overflow-hidden', {
              'pb-4': linkLocation === 'description' && url, // add padding for Read More button
              'w-full': style === 'card',
              'border-t-4': style === 'card' && image && borderColor,
              'm-auto bg-white drop-shadow-xl': style === 'tile',
              'border-4 ': style === 'tile' && borderColor,
              '@2xl:m-0 @2xl:mr-0 @2xl:h-full': image,
              '@2xl:drop-shadow-none': image && style === 'tile',
              ' @2xl:border-y-0 @2xl:border-l-4 @2xl:border-r-0':
                image && borderColor,
            })}
            style={{ borderColor }}
          >
            {children}
            {linkLocation === 'description' && url && (
              <div className="slant-edge-l absolute -right-px bottom-0 z-50 bg-gray-900 py-1 pl-2.5 pr-2 text-sm text-white duration-150 group-hover:bg-gray-900 group-hover:text-amber-300">
                {linkText}
              </div>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

// interface ImageCardTileWrapperProps {
//   style?: CardStyle
//   hasImage?: boolean
//   children: ReactNode
// }
//
// export function ImageCardTileWrapper({
//   style = 'card',
//   hasImage,
//   children,
// }: ImageCardTileWrapperProps) {
//   return (
//     <div
//       className={clsx('relative border-amber-300', {
//         'w-full': style === 'card',
//         'border-t-4': style === 'card' && hasImage,
//         'm-auto border-4 bg-white drop-shadow-xl': style === 'tile',
//         '@2xl:m-0 @2xl:mr-0 @2xl:h-full @2xl:border-y-0 @2xl:border-l-4 @2xl:border-r-0':
//           hasImage,
//       })}
//     >
//       {children}
//     </div>
//   )
// }
