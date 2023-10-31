import { useState, useRef } from 'react'
import BookStoreSelect from './BookStoreSelect'

export default function BookBuyButton() {
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
          isDark
        />
      </div>
    </div>
  )
}
