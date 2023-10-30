import type {
  ComponentPropsWithoutRef,
  SyntheticEvent,
  CSSProperties,
} from 'react'
import { useState, useEffect, useRef } from 'react'
import Select from 'react-select'
import * as Dropdown from '@radix-ui/react-dropdown-menu'
import Icon from './Icon'
import Spinner from './Spinner'
import clsx from 'clsx'
import { faCirclePlay } from '@fortawesome/pro-regular-svg-icons/faCirclePlay'
import { faXmark } from '@fortawesome/pro-regular-svg-icons/faXmark'

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

const bookstoreTags = [
  'Black owned',
  'worker/customer owned',
  'Black women owned',
] as const

interface Bookstore {
  name: string
  link: URL
  location?: string
  // tag?: 0 | 1 | 2
  tag?: number
  id: number
}

const bookstores: Bookstore[] = [
  {
    name: 'Bookshop.org',
    link: new URL('https://www.thelitbar.com/'),
  },
  {
    name: 'The Lit. Bar',
    link: new URL(
      'https://bookshop.org/p/books/the-human-origins-of-beatrice-porter-other-essential-ghosts-soraya-palmer/18592932',
    ),
    location: 'NYC',
    tag: 2,
  },
  {
    name: 'Cafe con Libros',
    link: new URL('https://www.cafeconlibrosbk.com/'),
    location: 'NYC',
    tag: 2,
  },
  {
    name: 'Bluestockings',
    link: new URL('https://bluestockings.com/about-us/about-us'),
    location: 'NYC',
    tag: 1,
  },
  {
    name: 'Taylor & CO',
    link: new URL('https://www.taylorcobooks.com/'),
    location: 'NYC',
    tag: 0,
  },
  {
    name: 'Seminary Co-op and 57th St Books',
    link: new URL('http://www.semcoop.com'),
    location: 'Chicago',
    tag: 1,
  },
].map((b, i) => ({ ...b, id: i }))

// interface GroupedOption {
//   readonly label: string
//   readonly options: Bookstore[]
// }

const groupedOptions = [
  {
    value: bookstores[0].link.href,
    label: bookstores[0].name,
  },
  {
    label: 'NYC',
    options: bookstores
      .filter((b) => b.location === 'NYC')
      .map(({ name, link, ...data }) => ({
        value: link.href,
        label: name,
        ...data,
      })),
  },
  {
    label: 'Chicago',
    options: bookstores
      .filter((b) => b.location === 'Chicago')
      .map(({ name, link, ...data }) => ({
        value: link.href,
        label: name,
        ...data,
      })),
  },
]

const locations = ['NYC', 'Chicago']

// type GroupedOption = (typeof groupedOptions)[number]
// type StoreOption = (typeof groupedOptions)[number]['options'][number]

// const formatGroupLabel = (data: GroupedOption) => (
//   <div className="text-gray-600">
//     <span>{data.label}</span> <span>{data.options.length}</span>
//   </div>
// )

const StoreSelect = () => {
  const [selected, setSelected] = useState(0)
  return (
    <div className="absolute left-0 top-full flex w-full pt-1 text-sm">
      <span>from</span>
      <div className="ml-1">
        <Dropdown.Root>
          <Dropdown.Trigger className="text-amber-300 hover:underline">
            {bookstores[selected].name || 'Select'}
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content
              className="z-50 rounded-sm border border-gray-900 bg-white font-sans text-gray-900 drop-shadow"
              // onCloseAutoFocus={(e) => e.preventDefault()} // should focus button
            >
              {locations.map((loc) => (
                <Dropdown.Group className="divide-y divide-gray-100">
                  <div className="bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                    {loc}
                  </div>
                  {bookstores
                    .filter((b) => b.location === loc)
                    .map(({ id, name, tag }) => (
                      <Dropdown.Item
                        key={id}
                        className="cursor-pointer px-4 py-2 outline-none hover:bg-gray-50 focus:bg-gray-50"
                        textValue={name}
                        onSelect={() => setSelected(id)}
                      >
                        <div>{name}</div>
                        {tag !== undefined && (
                          <div className="ml-2 text-xs italic text-gray-500">
                            {bookstoreTags[tag]}
                          </div>
                        )}
                      </Dropdown.Item>
                    ))}
                </Dropdown.Group>
              ))}
              {/*bookstores.map((b) => (
              <Dropdown.Item className="p-2">
                <p>{b.name}</p>
              </Dropdown.Item>
            ))*/}
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      </div>
    </div>
  )
}

// const StoreSelect = () => (
//   <div className="absolute left-0 top-full flex w-full pt-1 text-sm">
//     <span>from</span>
//     <Select<StoreOption, false, GroupedOption>
//       options={groupedOptions}
//       formatGroupLabel={formatGroupLabel}
//       unstyled
//       menuIsOpen={true}
//       className="text-left font-sans text-gray-900"
//       classNames={{
//         menu: (state) => clsx('w-96 w-80 border-2 border-red-200'),
//       }}
//       styles={{
//         menu: (baseStyles, state) => ({
//           ...baseStyles,
//           // border: 'red 2px solid',
//           // width: '300px',
//         }),
//       }}
//     />
//   </div>
// )

// const StoreSelect = () => (
//   <div className="absolute left-0 top-full flex w-full pt-1 text-sm">
//     <span>from</span>
//     <select
//       name="bookstore"
//       id="bookstore-select"
//       className="ml-1 w-full cursor-pointer bg-transparent"
//     >
//       {bookstores.map(({ name, link, location, tag }) => (
//         <option value={link.href}>
//           <span>{name}</span>
//           {tag && <span> ({bookstoreTags[tag]})</span>}
//         </option>
//       ))}
//     </select>
//   </div>
// )

const BuyTheBookLink = () => {
  return (
    <div className="relative mr-2 inline-block">
      <a
        href="https://bookshop.org/p/books/the-human-origins-of-beatrice-porter-other-essential-ghosts-soraya-palmer/18592932"
        className="inline-block border-2 border-gray-500 px-4 py-3 font-sans"
        target="_blank"
      >
        Buy the book
      </a>
      <StoreSelect />
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
