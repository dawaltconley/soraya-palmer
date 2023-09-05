import type { ReactNode } from 'react'

interface QuoteProps {
  type: 'review' | 'author'
  children: ReactNode
  author?: string
  url?: string | URL
  source?: string
}

export default function Quote({
  type,
  children: quote,
  author,
  url,
  source,
}: QuoteProps) {
  let citation: ReactNode = null
  if (author && source) {
    citation = (
      <>
        {author},{' '}
        {type === 'author' ? `author of ${source}` : <cite>{source}</cite>}
      </>
    )
  } else {
    citation = author || (source ? <cite>{source}</cite> : null)
  }

  return (
    <figure className="font-display text-xl">
      <blockquote cite={url?.toString()} className="leading-snug text-gray-900">
        {quote}
      </blockquote>
      {citation && (
        <figcaption className="mt-2 block text-right font-serif text-xl leading-6 text-gray-500 before:content-['\2014\20']">
          {citation}
        </figcaption>
      )}
    </figure>
  )
}
