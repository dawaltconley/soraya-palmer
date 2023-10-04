import type { ReactNode } from 'react'

interface QuoteProps {
  children: ReactNode
  citation?: ReactNode
  url?: string | URL
}

export default function Quote({ children: quote, citation, url }: QuoteProps) {
  if (url)
    citation = (
      <a href={url.toString()} className="pseudo-fill-parent" target="_blank">
        {citation}
      </a>
    )

  return (
    <figure className="relative font-display">
      <blockquote
        cite={url?.toString()}
        className="text-xl leading-snug text-gray-900"
      >
        {quote}
      </blockquote>
      {citation && (
        <figcaption className="mt-2 block text-right font-serif text-base leading-snug text-gray-500 before:content-['\2014\20']">
          {citation}
        </figcaption>
      )}
    </figure>
  )
}

export interface AuthorQuoteProps {
  children: ReactNode
  author: string
  book?: string
  url?: string | URL
}

export function AuthorQuote({ author, book, ...props }: AuthorQuoteProps) {
  const citation: ReactNode = book ? (
    <>
      {author}, author of <span className="italic">{book}</span>
    </>
  ) : (
    author
  )
  return <Quote citation={citation} {...props} />
}

export interface ReviewQuoteProps {
  children: ReactNode
  source: string
  author?: string
  url?: string | URL
}

export function ReviewQuote({ author, source, ...props }: ReviewQuoteProps) {
  let citation = <cite>{source}</cite>
  if (author)
    citation = (
      <>
        {author}, {citation}
      </>
    )
  return <Quote citation={citation} {...props} />
}
