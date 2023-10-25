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
      className="relative flex h-full flex-col @container/image-card"
    >
      {image && (
        <div
          className="overlay-before overlay-after before:vignette absolute inset-0 z-0 h-full before:z-10 after:z-20 after:bg-amber-300/20 @2xl:right-auto @2xl:max-w-[60%]"
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
        className={clsx('flex h-full w-full p-8', {
          'bg-amber-300': !image,
        })}
      >
        <div
          className={clsx(
            'm-auto border-4 border-amber-300 bg-white drop-shadow-xl',
            {
              '@2xl:mr-0 @2xl:max-w-[60%]': image,
            },
          )}
        >
          {children}
        </div>
      </div>
    </Wrapper>
  )
}
