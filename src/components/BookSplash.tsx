import type { ComponentPropsWithoutRef, SyntheticEvent } from 'react'
import type { ResponsiveImageData } from '@lib/build/images'
import { useState, useEffect, useRef } from 'react'
import Icon from './Icon'
import Spinner from './Spinner'
import Image from './Image'
import { getMetadata } from '@lib/images'
import clsx from 'clsx'
import { faCirclePlay } from '@fortawesome/pro-regular-svg-icons/faCirclePlay'
import { faArrowUpRightFromSquare } from '@fortawesome/pro-regular-svg-icons/faArrowUpRightFromSquare'
import { faXmark } from '@fortawesome/pro-regular-svg-icons/faXmark'
import BuyTheBookLink from './BookBuyButton'

interface TrailerProps extends ComponentPropsWithoutRef<'video'> {
  play?: boolean
  onReady: (e?: SyntheticEvent<HTMLVideoElement>) => void
  onEnded: (e?: SyntheticEvent<HTMLVideoElement>) => void
}

const Trailer = ({
  play = false,
  onReady,
  onEnded,
  ...props
}: TrailerProps) => {
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (video.current && video.current.readyState >= 3) {
      onReady()
    }
  }, [])

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (play) {
      v.currentTime = 0
      v.play()
    } else {
      v.pause()
    }
  }, [play])

  return (
    <video
      ref={video}
      muted
      autoPlay={false}
      preload="auto"
      className="absolute inset-0"
      onCanPlayThrough={onReady}
      onEnded={onEnded}
      {...props}
    >
      <source src="/media/humanorigins_1080x1080_3.mp4" type="video/mp4" />
    </video>
  )
}

type SplashState = 'initial' | 'video'

export interface BookSplashProps extends ComponentPropsWithoutRef<'div'> {
  init?: SplashState
  cover: string
  images?: ResponsiveImageData
}

export type SplashStateEvent = CustomEvent<{ state: SplashState }>

declare global {
  interface WindowEventMap {
    splashstate: SplashStateEvent
  }
}

export default function BookSplash({
  init = 'initial',
  cover,
  images = {},
  className,
  ...divProps
}: BookSplashProps) {
  const splash = useRef<HTMLDivElement>(null)
  const image = useRef<HTMLImageElement>(null)

  const [state, setState] = useState<SplashState>(init)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const isPlaying = isVideoLoaded && state === 'video'

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
      },
    })
    splash.current.dispatchEvent(event)
  }, [state])

  return (
    <div
      ref={splash}
      id="splash"
      className={clsx(
        'vignette bg-img-leaves overlay-before relative min-h-[50vh] w-full duration-1000 before:bg-gray-950 before:delay-[inherit] before:duration-[inherit]',
        state === 'initial'
          ? 'delay-300 before:opacity-[0.85]'
          : 'max-h-screen before:opacity-100',
        className,
      )}
      {...divProps}
    >
      <div className="container mx-auto h-full justify-center py-16 md:flex">
        <div
          className={clsx(
            'absolute inset-0 flex w-full duration-1000',
            state === 'initial' ? 'pointer-events-none opacity-0' : 'delay-300',
          )}
        >
          <div className="relative m-auto aspect-square w-full text-gray-600 md:h-full md:w-auto">
            <Trailer
              play={isPlaying}
              className={clsx(
                'duration-1000',
                isPlaying ? 'delay-300' : 'scale-95 opacity-0',
              )}
              onReady={() => setIsVideoLoaded(true)}
              onEnded={() => {
                window.setTimeout(() => setState('initial'), 500)
              }}
            />
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
        <Image
          metadata={metadata}
          alt="Book cover of The Human Origins of Beatrice Porter"
          className={clsx(
            'mx-auto aspect-cover h-full min-h-[32rem] transition-[opacity,transform] duration-1000 md:mx-0 md:max-h-[40vh] lg:max-h-[50vh]',
            state === 'initial'
              ? 'delay-300'
              : 'pointer-events-none -translate-x-16 opacity-0',
          )}
          style={{
            aspectRatio: imageAspect && `${imageAspect.x} / ${imageAspect.y}`,
          }}
          imgRef={image}
          imgProps={{
            className: clsx('h-full w-full object-contain drop-shadow-2xl'),
          }}
        />
        <div
          className={clsx(
            'text-shadow relative z-10 mt-8 flex max-w-prose grow flex-col font-serif text-white transition-[opacity,transform] duration-1000 @container/book-text before:-z-10 md:ml-12 md:mt-0',
            state === 'initial'
              ? 'delay-300'
              : 'pointer-events-none translate-x-16 opacity-0',
          )}
        >
          <div className="mb-0">
            <h2 className="font-display text-3xl font-bold">
              The Human Origins of Beatrice Porter and other Essential Ghosts
            </h2>
            <p className="underline decoration-amber-300/80 decoration-2">
              a novel by Soraya Palmer
            </p>
            <p className="my-4 italic">
              “Mothers never die. Children love to resurrect us in they
              stories.”
            </p>
            <p className="my-4">
              Folktales and spirits animate this lively and unforgettable
              coming-of-age tale of two Jamaican-Trinidadian sisters in Brooklyn
              grappling with their mother’s illness, their father's infidelity,
              and the truth of their family's past…
            </p>
          </div>
          <div className="mt-4 text-center md:text-left">
            <div className="inline-block">
              <BuyTheBookLink />
            </div>
          </div>
          <div className="mt-6 w-full text-center text-base md:text-left">
            <button
              className="group mr-4 whitespace-nowrap font-sans sm:mr-8"
              onClick={() => {
                splash.current?.scrollIntoView()
                setState('video')
              }}
            >
              <Icon icon={faCirclePlay} className="fa-inline mr-0.5" />{' '}
              <span className="underline-link group-hover:underline-link--active group-focus-visible:underline-link--active duration-300">
                Watch the trailer
              </span>
            </button>
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
}
