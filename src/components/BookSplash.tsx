import type {
  ComponentPropsWithoutRef,
  SyntheticEvent,
  CSSProperties,
} from 'react'
import { useState, useEffect, useRef } from 'react'
import Icon from './Icon'
import Spinner from './Spinner'
import clsx from 'clsx'
import { faCirclePlay } from '@fortawesome/pro-regular-svg-icons/faCirclePlay'
import { faArrowUpRightFromSquare } from '@fortawesome/pro-regular-svg-icons/faArrowUpRightFromSquare'
import { faXmark } from '@fortawesome/pro-regular-svg-icons/faXmark'
import BookStoreSelect from './BookStoreSelect'

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

const BuyTheBookLink = () => {
  const button = useRef<HTMLAnchorElement>(null)
  const [link, setLink] = useState(
    'https://bookshop.org/p/books/the-human-origins-of-beatrice-porter-other-essential-ghosts-soraya-palmer/18592932',
  )
  return (
    <div className="relative items-center justify-stretch font-sans @md:flex">
      <a
        ref={button}
        href={link}
        className="group inline-block border-2 border-amber-300/80 bg-gray-950/60 px-4 py-3 font-sans duration-300 hover:border-amber-300 hover:bg-gray-950 focus-visible:border-amber-300 focus-visible:bg-gray-950"
        target="_blank"
      >
        <span className="underline-link group-hover:underline-link--active group-focus-visible:underline-link--active whitespace-nowrap font-semibold">
          Buy the book
        </span>
      </a>
      <div className="flex h-full w-full items-baseline border-transparent @md:ml-4">
        <span>from</span>
        <BookStoreSelect
          onSelect={(store) => {
            if (store) {
              setLink(store.link.href)
            }
          }}
          focusElement={button.current}
        />
      </div>
    </div>
  )
}

type SplashState = 'initial' | 'video'

export interface BookSplashProps extends ComponentPropsWithoutRef<'div'> {
  init?: SplashState
}

export type SplashStateEvent = CustomEvent<{ state: SplashState }>

declare global {
  interface WindowEventMap {
    splashstate: SplashStateEvent
  }
}

export default function BookSplash({
  init = 'initial',
  className,
  ...divProps
}: BookSplashProps) {
  const splash = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<SplashState>(init)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const isPlaying = isVideoLoaded && state === 'video'

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
        'vignette bg-img-leaves overlay-before relative min-h-[50vh] w-full duration-1000 before:delay-[inherit] before:duration-[inherit]',
        state === 'initial'
          ? 'max-h-[200vh] delay-300 before:bg-gray-950/80'
          : 'max-h-screen before:bg-gray-950',
        className,
      )}
      {...divProps}
    >
      <div
        className="feathered-blur-before container mx-auto h-full justify-center py-16 md:flex"
        style={
          {
            '--feather-size': '6rem',
          } as CSSProperties
        }
      >
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
              className="absolute right-0 top-0 -translate-y-full p-4 text-xl md:left-full md:right-auto md:translate-y-0"
              onClick={() => setState('initial')}
            >
              <Icon icon={faXmark} />
            </button>
          </div>
        </div>
        <div
          className={clsx(
            'mx-auto aspect-cover h-full min-h-[32rem] transition-[opacity,transform] duration-1000 md:mx-0 md:max-h-[40vh] lg:max-h-[50vh]',

            state === 'initial'
              ? 'delay-300'
              : 'pointer-events-none -translate-x-16 opacity-0',
          )}
        >
          <img
            className={clsx('h-full w-full object-contain drop-shadow-2xl ')}
            src="/media/The+Human+Originas+of+Beatrice+Porter.jpg"
            alt="Book cover of The Human Origins of Beatrice Porter"
          />
        </div>
        <div
          className={clsx(
            'relative mt-8 flex max-w-prose grow flex-col font-serif text-white transition-[opacity,transform] duration-1000 @container/book-text md:ml-12 md:mt-0',
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
              onClick={() => setState('video')}
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
