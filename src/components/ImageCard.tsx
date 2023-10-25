import type { ReactNode, CSSProperties } from 'react'
import clsx from 'clsx'

interface ImageCardProps {
  image?: string
  alt?: string
  url?: string | URL
  children: ReactNode
  title?: ReactNode
}

export default function ImageCard({
  image,
  alt = '',
  url,
  // title,
  children,
}: ImageCardProps) {
  const Wrapper = url ? 'a' : 'div'
  return (
    <Wrapper
      href={url?.toString()}
      className="group relative flex h-full @container/image-card"
    >
      {image && (
        <div
          className="overlay-before overlay-after before:vignette absolute inset-0 z-0 h-full duration-500 before:z-10 after:z-20 after:bg-amber-300/10 after:duration-[inherit] group-hover:scale-105 group-hover:after:bg-gray-800/20 @2xl:static @2xl:w-1/2 @2xl:flex-grow"
          style={
            {
              '--vignette-opacity': 0.2,
              '--vignette-spread': '4rem',
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
          'flex h-full w-full p-8',
          image ? '@2xl:w-auto @2xl:p-0' : 'bg-amber-300',
        )}
      >
        <div
          className={clsx(
            'm-auto border-4 border-amber-300 bg-white drop-shadow-xl',
            {
              '@2xl:m-0 @2xl:mr-0 @2xl:h-full @2xl:border-y-0 @2xl:border-r-0':
                image,
            },
          )}
        >
          {children}
        </div>
      </div>
    </Wrapper>
  )
}
