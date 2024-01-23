import { useState, useRef } from 'react'
import BookStoreSelect, { type StoreSelectProps } from './BookStoreSelect'

export interface BookBuyButtonProps {
  stores: StoreSelectProps['stores']
}

export default function BookBuyButton({ stores }: BookBuyButtonProps) {
  const button = useRef<HTMLAnchorElement>(null)
  const [link, setLink] = useState(
    'https://bookshop.org/p/books/the-human-origins-of-beatrice-porter-other-essential-ghosts-soraya-palmer/18592932',
  )
  return (
    <div className="relative mx-auto w-2/3 font-sans md:w-full">
      <a
        ref={button}
        href={link}
        className="group mr-4 inline-block border-2 border-amber-300/80 bg-gray-950/50 px-4 py-3 font-sans transition duration-300 hover:border-amber-300 hover:bg-gray-950 focus-visible:border-amber-300 focus-visible:bg-gray-950"
        target="_blank"
        onClick={(e) => {
          let followedLink = false
          const followLink = () => {
            if (followedLink) return
            followedLink = true
            window.location.href = link
          }
          window.plausible('Buy the Book', {
            callback: followLink,
            props: { link },
          })
          window.setTimeout(followLink, 1000)
          e.preventDefault()
        }}
      >
        <span className="underline-link group-hover:underline-link--active group-focus-visible:underline-link--active whitespace-nowrap font-semibold">
          Buy the book
        </span>
      </a>
      <div className="inline-flex h-full items-baseline border-transparent">
        <span>from</span>
        <BookStoreSelect
          stores={stores}
          onSelect={(store) => {
            if (store) {
              setLink(store.link.href)
            }
          }}
          focusElement={button.current}
          isDark
        />
      </div>
    </div>
  )
}
