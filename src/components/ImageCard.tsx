import type { ReactNode, CSSProperties } from 'react'
import type { ImageMetadata } from '@dawaltconley/responsive-images'
import Image from './Image'
import clsx from 'clsx'

/*
 * Small versions
 * 1. tile in middle of image
 * 2. text below image
 *
 * TODO Small preview text
 * 1. use title block
 * 2. use description block
 *
 * TODO Large versions (only difference whether title is present)
 * 1. all text right of image
 * 2. title below image, description to right
 */

const CardStyle = ['card', 'tile']

export type CardStyle = (typeof CardStyle)[number]

export const isCardStyle = (str: string): str is CardStyle =>
  CardStyle.some((s) => s === str)

export interface ImageCardProps {
  image: string | ImageMetadata['metadata']
  imageSize?: 'cover' | 'contain'
  imagePosition?: [number, number]
  imageSide?: 'left' | 'right'
  alt?: string
  url?: string | URL
  children: ReactNode
  title?: ReactNode
  style?: CardStyle
  styleLarge?: CardStyle
  borderColor?: string
  linkText?: string | null
  linkLocation?: 'description' | 'image'
  aspectRatio?: 'og' | 'square'
  grow?: 'image' | 'text'
}

export default function ImageCard({
  image,
  alt = '',
  url,
  // title,
  style = 'card',
  // styleLarge = style,
  imageSize = 'cover',
  imagePosition,
  imageSide = 'left',
  borderColor,
  linkText = 'Read more',
  linkLocation = 'description',
  aspectRatio = 'og',
  grow = 'image',
  children,
}: ImageCardProps) {
  const Wrapper = url ? 'a' : 'div'
  const hasDescLink = linkLocation === 'description' && url && linkText
  const hasImgLink = linkLocation === 'image' && url && linkText
  return (
    <Wrapper
      href={url?.toString()}
      className="group relative block h-full @container/image-card"
    >
      <div className="flex h-full w-full flex-col items-stretch overflow-hidden @2xl:flex-row">
        <div
          className={clsx(
            'overlay-before overlay-after grow-0 overflow-hidden bg-amber-300 transition-none duration-500 after:z-20 after:bg-amber-300/5 after:duration-[inherit] @2xl:w-1/2',
            imageSize === 'contain'
              ? 'bg-img-card'
              : 'before:vignette before:z-10',
            {
              '@2xl:grow': grow === 'image',
              '@2xl:order-1': imageSide === 'right',
              'group-hover:after:bg-gray-800/20 ': url,
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
          <Image
            className="duration-[inherit]"
            metadata={image}
            alt={alt}
            imgProps={{
              className: clsx(
                'h-full w-full duration-[inherit]',
                aspectRatio === 'square' ? 'aspect-square' : 'aspect-og',
                imageSize === 'cover'
                  ? 'object-cover'
                  : 'object-contain p-2 drop-shadow-xl',
                {
                  'group-hover:scale-105': url,
                },
              ),
              style: imagePosition && {
                objectPosition: `${imagePosition[0]}% ${imagePosition[1]}%`,
              },
            }}
          />
          {hasImgLink && (
            <div className="slant-edge-l absolute bottom-0 right-0 z-50 bg-gray-800 py-1 pl-2.5 pr-2 font-sans text-sm text-white duration-150 group-hover:bg-gray-900 group-hover:text-amber-300">
              {linkText}
            </div>
          )}
        </div>
        <div
          className={clsx('flex w-full grow @2xl:p-0', {
            '@2xl:w-3/5 @2xl:max-w-prose @2xl:grow-0': grow === 'image',
            'h-full p-6 sm:p-8 sm:@2xl:p-0': style === 'tile',
          })}
        >
          <div
            className={clsx(
              'relative w-full overflow-hidden @2xl:m-0 @2xl:mr-0 @2xl:h-full',
              {
                '@2xl:max-w-prose': style === 'card' && grow === 'image', // needed to keep 'Read More' link in corner
                'pb-[1em]': style === 'card' && hasDescLink, // add padding for Read More button
                'border-t-4': style === 'card' && borderColor,
                'm-auto max-w-prose bg-white drop-shadow-xl @2xl:drop-shadow-none':
                  style === 'tile',
                '@2xl:pb-[1em]': style === 'tile' && hasDescLink, // add padding for Read More button
                'border-4 ': style === 'tile' && borderColor,
                '@2xl:border-0': borderColor,
              },
              borderColor &&
                (imageSide === 'left' ? '@2xl:border-l-4' : '@2xl:border-r-4'),
            )}
            style={{ borderColor }}
          >
            {children}
          </div>
          {hasDescLink && (
            <div className="slant-edge-l absolute -right-px bottom-0 z-50 bg-gray-900 py-1 pl-2.5 pr-2 font-sans text-sm text-white duration-150 group-hover:bg-gray-900 group-hover:text-amber-300">
              {linkText}
            </div>
          )}
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
