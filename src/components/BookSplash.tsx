import type { HomeQuery } from '@tina/__generated__/types'
import type { ComponentPropsWithoutRef } from 'react'
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

  const [imageAspect, setImageAspect] = useState<{ x: number; y: number }>()
  const metadata = getMetadata(cover, images)

  useEffect(() => {
    if (!image.current) return
    setImageAspect({
      x: image.current.clientWidth,
      y: image.current.clientHeight,
    })
  }, [])

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
        'vignette bg-img-leaves overlay-before relative min-h-[50vh] w-full bg-gray-950 duration-1000 before:bg-gray-950 before:delay-[inherit] before:duration-[inherit]',
        !showVideo ? 'delay-300 before:opacity-[0.85]' : 'before:opacity-100',
        className,
      )}
      data-tina-field={tinaField(data.home, 'book')}
      {...divProps}
    >
      <div className="container mx-auto h-full justify-center pb-16 pt-8 md:flex md:pt-16">
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
          metadata={metadata}
          alt="Book cover of The Human Origins of Beatrice Porter"
          className={clsx(
            'mx-auto aspect-cover h-full min-h-[32rem] transition-[opacity,transform] duration-1000 md:mx-0 md:max-h-[40vh] lg:max-h-[50vh]',
            !showVideo
              ? 'delay-300'
              : 'pointer-events-none -translate-x-16 opacity-0',
          )}
          style={{
            aspectRatio: imageAspect && `${imageAspect.x} / ${imageAspect.y}`,
          }}
          imgRef={image}
          imgProps={{
            className:
              'mx-auto h-full w-full max-w-xs object-contain drop-shadow-2xl md:mx-0 md:max-w-none',
            loading: 'eager',
          }}
        />
        <div
          className={clsx(
            'text-shadow relative z-10 mt-8 max-w-prose grow font-serif text-white transition-[opacity,transform] duration-1000 @container/book-text before:-z-10 md:ml-12 md:mt-0',
            !showVideo
              ? 'delay-300'
              : 'pointer-events-none translate-x-16 opacity-0',
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
            <div className="inline-block">
              <BuyTheBookLink stores={stores} />
            </div>
          </div>
          <div className="mt-6 w-full text-center text-base md:text-left">
            {hasVideo && (
              <button
                className="group mr-4 whitespace-nowrap font-sans sm:mr-8"
                onClick={() => setState('video')}
              >
                {state === 'video' ? (
                  <Spinner className="fa-inline mr-0.5" />
                ) : (
                  <Icon icon={faCirclePlay} className="fa-inline mr-0.5" />
                )}{' '}
                <span className="underline-link group-hover:underline-link--active group-focus-visible:underline-link--active duration-300">
                  Watch the trailer
                </span>
              </button>
            )}
            <a
              href="https://www.opinionstage.com/page/6abbaf30-f4cd-48fe-add5-09178f832c0c"
              className="group whitespace-nowrap font-sans"
              target="_blank"
            >
              <Icon
                icon={faArrowUpRightFromSquare}
                className="fa-inline mr-0.5"
              />{' '}
              <span className="underline-link group-hover:underline-link--active group-focus-visible:underline-link--active duration-300">
                Take the quiz
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
})
