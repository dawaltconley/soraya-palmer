import type { HomeQuery } from '@tina/__generated__/types'
import type { ReactNode, ComponentPropsWithoutRef } from 'react'
import type { Store, Location as StoreLocation } from './BookStoreSelect'
import { useState, useEffect, useRef, useMemo } from 'react'
import { withTinaWrapper } from '@lib/browser/withTinaWrapper'
import Video from './Video'
import Icon from './Icon'
import Spinner from './Spinner'
import Image from './Image'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import { tinaField } from 'tinacms/dist/react'
import { getMetadata, type ResponsiveImageData } from '@lib/images'
import { toUrl, isNotEmpty, isTruthy } from '@lib/utils'
import clsx from 'clsx'
import { faCirclePlay } from '@fortawesome/pro-regular-svg-icons/faCirclePlay'
import { faArrowUpRightFromSquare } from '@fortawesome/pro-regular-svg-icons/faArrowUpRightFromSquare'
import { faXmark } from '@fortawesome/pro-regular-svg-icons/faXmark'
import BuyTheBookLink from './BookBuyButton'

type SplashState = 'initial' | 'video'

export interface BookSplashProps extends ComponentPropsWithoutRef<'div'> {
  init?: SplashState
  images?: ResponsiveImageData
}

export type SplashStateEvent = CustomEvent<{
  state: SplashState
  isVideoLoaded: boolean
}>

declare global {
  interface WindowEventMap {
    splashstate: SplashStateEvent
  }
}

export default withTinaWrapper<HomeQuery, BookSplashProps>(function BookSplash({
  data,
  isClient,
  init = 'initial',
  images = {},
  className,
  ...divProps
}) {
  const splash = useRef<HTMLDivElement>(null)
  const image = useRef<HTMLImageElement>(null)

  const [state, setState] = useState<SplashState>(init)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  const showVideo = state === 'video' && isVideoLoaded

  const { title, byline, description, cover, bookstores, trailer } =
    data.home.book
  const stores: StoreLocation[] = useMemo(
    () =>
      [
        { name: null, stores: [bookstores.default] },
        ...(bookstores.locations || []),
      ]
        .filter(isNotEmpty)
        .map<StoreLocation | null>((l) => {
          if (!l.stores) return null
          return {
            name: l.name || null,
            stores:
              l.stores
                ?.map<Store | null>((s) => {
                  if (!s?.name || !s?.link) return null
                  const link = toUrl(s.link)
                  if (!link) return null
                  return { name: s.name, link, tag: s.tag || undefined }
                })
                .filter(isNotEmpty) || [],
          }
        })
        .filter(isNotEmpty),
    [bookstores],
  )
  const sources = useMemo(() => {
    const webm = trailer?.webm && {
      src: trailer.webm,
      type: 'video/webm',
    }
    const mp4 = trailer?.mp4 && {
      src: trailer.mp4,
      type: 'video/mp4',
    }
    return [webm, mp4].filter(isTruthy)
  }, [trailer])
  const hasVideo = sources.length > 0

  const metadata = getMetadata(cover, images)

  useEffect(() => {
    if (!splash.current) return
    const event: SplashStateEvent = new CustomEvent('splashstate', {
      bubbles: true,
      detail: {
        state,
        isVideoLoaded,
      },
    })
    splash.current.dispatchEvent(event)
  }, [state, isVideoLoaded])

  return (
    <div
      ref={splash}
      id="splash"
      className={clsx(
        'vignette bg-img-leaves overlay-before relative min-h-[50vh] w-full bg-gray-950 transition duration-1000 before:bg-gray-950 before:delay-[inherit] before:duration-[inherit]',
        !showVideo ? 'delay-300 before:opacity-[0.85]' : 'before:opacity-100',
        className,
      )}
      data-tina-field={tinaField(data.home, 'book')}
      {...divProps}
    >
      <div className="splash-grid container mx-auto h-full justify-center gap-8 pb-16 pt-8 text-white md:pt-16 xl:gap-12">
        {hasVideo && (
          <div
            className={clsx(
              'absolute inset-0 w-full duration-1000',
              !showVideo ? 'pointer-events-none opacity-0' : 'delay-300',
            )}
          >
            <div className="sticky bottom-0 top-0 flex h-full max-h-screen-s w-full">
              <div className="relative m-auto aspect-square w-full text-gray-600 md:h-full md:w-auto">
                {(isVideoLoaded || state === 'video') && (
                  <Video
                    sources={sources}
                    play={state === 'video'}
                    className={clsx(
                      'duration-1000',
                      showVideo ? 'delay-300' : 'scale-95 opacity-0',
                    )}
                    muted
                    autoPlay={false}
                    preload="auto"
                    onReady={() => setIsVideoLoaded(true)}
                    onEnded={() => {
                      window.setTimeout(() => setState('initial'), 500)
                    }}
                  />
                )}
                <div className="absolute inset-0 flex">
                  <Spinner
                    className={clsx('m-auto text-4xl', {
                      hidden: isVideoLoaded,
                    })}
                  />
                </div>
                <button
                  className="absolute right-0 top-0 -translate-y-full p-4 text-xl duration-200 hover:text-amber-300 md:left-full md:right-auto md:translate-y-0"
                  onClick={() => setState('initial')}
                >
                  <Icon icon={faXmark} />
                </button>
              </div>
            </div>
          </div>
        )}
        <Image
          src={metadata}
          alt="Book cover of The Human Origins of Beatrice Porter"
          className={clsx(
            'mx-auto h-full min-w-80 transition-[opacity,transform] duration-1000 md:float-left md:mx-0 lg:row-span-2',
            !showVideo
              ? 'delay-300'
              : 'pointer-events-none -translate-y-2 opacity-0 md:-translate-x-16 md:-translate-y-0',
          )}
          imgRef={image}
          imgProps={{
            className:
              'mx-auto h-full w-full max-w-xs object-contain drop-shadow-2xl md:mx-0 md:max-w-none',
            loading: 'eager',
          }}
        />
        <div
          className={clsx(
            'text-shadow relative z-10 flex max-w-prose flex-col font-serif transition duration-1000 before:-z-10 md:col-start-2',
            !showVideo
              ? 'delay-300'
              : 'pointer-events-none translate-y-2 opacity-0 md:translate-x-16 md:translate-y-0',
          )}
        >
          <div className="mb-0">
            <h2 className="font-display text-3xl font-bold">{title}</h2>
            {byline && (
              <p className="underline decoration-amber-300/80 decoration-2">
                {byline}
              </p>
            )}
            {description && (
              <div className="book-description mt-4 space-y-4">
                <TinaMarkdown content={description} />
              </div>
            )}
          </div>
          <div
            className="mt-8 text-center md:text-left"
            data-tina-field={tinaField(data.home.book, 'bookstores')}
          >
            <BuyTheBookLink stores={stores} />
          </div>
        </div>
        <div
          className={clsx(
            'relative z-10 flex w-full justify-center space-x-4 text-base transition duration-1000 sm:h-36 sm:w-auto sm:space-x-8 md:col-span-2 lg:col-span-1 lg:col-start-2 lg:h-auto lg:justify-start lg:space-x-6',
            !showVideo
              ? 'delay-300'
              : 'pointer-events-none translate-y-4 opacity-0 lg:translate-x-16 lg:translate-y-0',
          )}
        >
          {hasVideo && trailer?.thumb && (
            <Thumbnail
              onClick={() => setState('video')}
              image={trailer.thumb}
              images={images}
              text="Watch the trailer"
              isActive={state === 'video'}
              icon={
                state === 'video' ? (
                  <Spinner className="fa-inline drop-shadow-lg" />
                ) : (
                  <Icon
                    icon={faCirclePlay}
                    className="fa-inline drop-shadow-lg"
                  />
                )
              }
            />
          )}
          <Thumbnail
            href="https://www.opinionstage.com/page/6abbaf30-f4cd-48fe-add5-09178f832c0c"
            image="/media/trickster-cards/quiz-thumb.jpg"
            images={images}
            text={<>Which essential ghost are&nbsp;you?</>}
            icon={
              <Icon
                icon={faArrowUpRightFromSquare}
                className="text-3xl drop-shadow-lg"
              />
            }
          />
        </div>
      </div>
    </div>
  )
})

interface ThumbnailProps {
  href?: string | URL
  onClick?: () => void
  image: string
  text?: ReactNode
  icon?: ReactNode
  isActive?: boolean
  images?: ResponsiveImageData
}

function Thumbnail({
  href,
  onClick,
  image,
  text,
  icon,
  isActive,
  images = {},
}: ThumbnailProps) {
  const metadata = getMetadata(image, images)
  let Wrapper: 'a' | 'button' = 'a'
  if (href) Wrapper = 'a'
  else if (onClick) Wrapper = 'button'
  return (
    <Wrapper
      href={href?.toString()}
      className="group relative block aspect-video h-full grow overflow-clip rounded-sm bg-black sm:grow-0"
      target={href ? '_blank' : undefined}
      onClick={onClick}
    >
      <Image
        src={metadata}
        alt=""
        className="absolute inset-0"
        imgProps={{
          className: clsx(
            'h-full w-full object-contain duration-300 group-hover:blur-sm',
            {
              blur: isActive,
            },
          ),
        }}
      />
      {icon && (
        <div
          className={clsx(
            'absolute inset-0 flex flex-col items-center justify-center bg-gray-950/15 text-4xl text-transparent transition duration-300 group-hover:bg-gray-900/30 group-hover:text-white',
            {
              'bg-gray-900/30 text-white': isActive,
            },
          )}
        >
          {icon}
        </div>
      )}
      {text && (
        <div
          className={clsx(
            'text-shadow gradient-b absolute bottom-0 left-0 right-0 translate-y-0 px-1 pb-2 pt-6 text-center font-sans leading-tight transition duration-300 group-hover:translate-y-1 group-hover:opacity-0',
            {
              'opacity-0': isActive,
            },
          )}
        >
          {text}
        </div>
      )}
    </Wrapper>
  )
}
