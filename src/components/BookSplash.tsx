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
    <div className="relative mr-2 inline-block">
      <a
        ref={button}
        href={link}
        className="inline-block border-2 border-gray-500 px-4 py-3 font-sans"
        target="_blank"
      >
        Buy the book
      </a>
      <div className="absolute left-0 top-full flex w-full pt-1 text-sm">
        <span>from</span>
        <div className="ml-1">
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
        <img
          className={clsx(
            'mx-auto h-full min-h-[32rem] object-contain drop-shadow-2xl duration-1000 md:mx-0 md:max-h-[40vh] lg:max-h-[50vh]',
            state === 'initial'
              ? 'delay-300'
              : 'pointer-events-none -translate-x-16 opacity-0',
          )}
          src="/media/The+Human+Originas+of+Beatrice+Porter.jpg"
          alt="Book cover of The Human Origins of Beatrice Porter"
        />
        <div
          className={clsx(
            'relative mt-8 max-w-prose font-serif text-white duration-1000 md:ml-12 md:mt-0',
            state === 'initial'
              ? 'delay-300'
              : 'pointer-events-none translate-x-16 opacity-0',
          )}
        >
          <h2 className="font-display text-3xl font-bold">
            The Human Origins of Beatrice Porter and other Essential Ghosts
          </h2>
          <p className="underline decoration-gray-500 decoration-2">
            a novel by Soraya Palmer
          </p>
          <p className="my-4 italic">
            “Mothers never die. Children love to resurrect us in they stories.”
          </p>
          <p className="my-4">
            Folktales and spirits animate this lively and unforgettable
            coming-of-age tale of two Jamaican-Trinidadian sisters in Brooklyn
            grappling with their mother’s illness, their father's infidelity,
            and the truth of their family's past…
          </p>
          <div className="mt-6 whitespace-nowrap text-center md:text-left">
            <BuyTheBookLink />
            <button
              className="inline-block px-4 py-3 font-sans"
              onClick={() => setState('video')}
            >
              <Icon icon={faCirclePlay} className="fa-inline" /> Watch the
              trailer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
