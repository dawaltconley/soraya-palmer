import { useState, useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import Icon from './Icon'
import Spinner from './Spinner'
import clsx from 'clsx'
import { faCirclePlay } from '@fortawesome/pro-regular-svg-icons/faCirclePlay'
import { faCircleXmark } from '@fortawesome/pro-regular-svg-icons/faCircleXmark'

import '@styles/transitions.scss'

interface TrailerProps {
  onReady: () => void
  onEnded: () => void
}

const Trailer = ({ onReady, onEnded }: TrailerProps) => {
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (v.readyState >= 3) {
      onReady()
    } else {
      v.addEventListener('canplaythrough', onReady)
    }
    v.addEventListener('ended', onEnded)

    return () => {
      v.removeEventListener('canplaythrough', onReady)
      v.removeEventListener('ended', onEnded)
    }
  }, [])

  return (
    <video
      ref={video}
      muted
      autoPlay
      preload="auto"
      className="absolute inset-0"
    >
      <source src="/media/humanorigins_1080x1080_3.mp4" type="video/mp4" />
    </video>
  )
}

export default function BookSplash() {
  const [state, setState] = useState<'initial' | 'loading' | 'playing'>(
    'initial',
  )

  const image = useRef<HTMLImageElement>(null)
  const text = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLDivElement>(null)

  return (
    <div
      id="splash"
      className={clsx(
        'vignette relative min-h-[50vh] w-full bg-gray-800 duration-1000',
        {
          'max-h-screen bg-gray-950': state !== 'initial',
          'max-h-[200vh] delay-300': state === 'initial',
        },
      )}
    >
      <div className="container mx-auto h-full justify-center py-16 md:flex">
        <CSSTransition
          in={state === 'playing' || state === 'loading'}
          timeout={1000}
          classNames="from-center"
          nodeRef={video}
          mountOnEnter
          unmountOnExit
        >
          <div ref={video} className="absolute inset-0 flex w-full">
            <div className="relative m-auto aspect-square w-full md:h-full md:w-auto">
              <Trailer
                onReady={() => setState('playing')}
                onEnded={() => {
                  window.setTimeout(() => setState('initial'), 500)
                }}
              />
              <button
                className="absolute right-0 top-0 -translate-y-full p-4 text-xl text-gray-600 md:left-full md:right-auto md:translate-y-0"
                onClick={() => setState('initial')}
              >
                <Icon icon={faCircleXmark} />
              </button>
            </div>
          </div>
        </CSSTransition>
        <CSSTransition
          key="image"
          in={state === 'initial'}
          timeout={1000}
          classNames="fade-left"
          nodeRef={image}
        >
          <img
            ref={image}
            className="mx-auto h-full min-h-[32rem] object-contain drop-shadow-2xl md:mx-0 md:max-h-[40vh] lg:max-h-[50vh]"
            src="/media/The+Human+Originas+of+Beatrice+Porter.jpg"
            alt="Book cover of The Human Origins of Beatrice Porter"
          />
        </CSSTransition>
        <CSSTransition
          key="description"
          in={state === 'initial'}
          timeout={1000}
          classNames="fade-right"
          nodeRef={text}
        >
          <div
            ref={text}
            className="mt-8 max-w-prose font-serif text-white md:ml-12 md:mt-0"
          >
            <h2 className="font-display text-3xl font-bold">
              The Human Origins of Beatrice Porter and other Essential Ghosts
            </h2>
            <p className="underline decoration-gray-500 decoration-2">
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
            <div className="mt-6 whitespace-nowrap text-center md:text-left">
              <a
                href="https://bookshop.org/p/books/the-human-origins-of-beatrice-porter-other-essential-ghosts-soraya-palmer/18592932"
                className="mr-2 inline-block border-2 border-gray-500 px-4 py-3 font-sans"
                target="_blank"
              >
                Buy the book
              </a>
              <button
                className="inline-block px-4 py-3 font-sans"
                onClick={() => setState('loading')}
              >
                {state === 'loading' ? (
                  <Spinner className="fa-inline" />
                ) : (
                  <Icon icon={faCirclePlay} className="fa-inline" />
                )}{' '}
                Watch the trailer
              </button>
            </div>
          </div>
        </CSSTransition>
      </div>
    </div>
  )
}
