import type { ReactNode } from 'react'
import clsx from 'clsx'

const QuoteStyle = ['basic', 'headshot', 'background', 'tile'] as const

export type QuoteStyle = (typeof QuoteStyle)[number]

export const isQuoteStyle = (str: string): str is QuoteStyle =>
  QuoteStyle.some((s) => s === str)

export interface QuoteProps {
  children: ReactNode
  citation?: ReactNode
  image?: string
  url?: string | URL
  linkToSource?: boolean
}

export default function Quote({
  children: quote,
  citation,
  image,
  url,
  linkToSource,
}: QuoteProps) {
  if (citation && url && linkToSource)
    citation = (
      <a href={url.toString()} className="pseudo-fill-parent" target="_blank">
        {citation}
      </a>
    )

  return (
    <figure className="flex max-w-prose flex-col font-serif text-base">
      <blockquote cite={url?.toString()} className="m-auto text-lg sm:text-xl">
        {quote}
      </blockquote>
      {(citation || image) && (
        <figcaption
          className={clsx(
            'mt-4 text-right font-serif',
            image ? 'flex flex-row items-center' : 'before:content-em',
          )}
        >
          {citation && <span className="ml-auto">{citation}</span>}
          {image && (
            <img
              className="ml-4 aspect-square h-28 w-28 rounded-full object-cover"
              src={image}
              alt="" // autogen if author available? as headshot
              loading="lazy"
              decoding="async"
            />
          )}
        </figcaption>
      )}
    </figure>
  )
}

export interface AuthorQuoteProps extends QuoteProps {
  author: string
  book?: string
}

export function AuthorQuote({ author, book, ...props }: AuthorQuoteProps) {
  let citation: ReactNode = author
  if (book) {
    const description = (
      <>
        author of <span className="italic">{book}</span>
      </>
    )
    if (props.image) {
      citation = (
        <>
          <div>{author}</div>
          <div>{description}</div>
        </>
      )
    } else {
      citation = (
        <>
          {author}, {description}
        </>
      )
    }
  }
  return <Quote citation={citation} {...props} />
}

export interface ReviewQuoteProps extends QuoteProps {
  source: string
  author?: string
}

export function ReviewQuote({ author, source, ...props }: ReviewQuoteProps) {
  let citation = <cite>{source}</cite>
  if (author && props.image) {
    citation = (
      <>
        <div>{author}</div>
        <div>{citation}</div>
      </>
    )
  } else if (author) {
    citation = (
      <>
        {author}, {citation}
      </>
    )
  }
  return <Quote citation={citation} {...props} />
}
