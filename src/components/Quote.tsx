import type { WithRequired } from '@lib/utils'
import type { ReactNode } from 'react'
import { hasProps } from '@lib/utils'

const QuoteStyle = ['basic', 'headshot', 'background'] as const

export type QuoteStyle = (typeof QuoteStyle)[number]

export const isQuoteStyle = (str: string): str is QuoteStyle =>
  QuoteStyle.some((s) => s === str)

export interface QuoteProps {
  children: ReactNode
  citation?: ReactNode
  style?: QuoteStyle
  url?: string | URL
  image?: string
}

export default function Quote({ style = 'basic', ...props }: QuoteProps) {
  if (props.url)
    props.citation = (
      <a
        href={props.url.toString()}
        className="pseudo-fill-parent"
        target="_blank"
      >
        {props.citation}
      </a>
    )

  switch (style) {
    case 'headshot':
      if (hasProps(props, ['image', 'citation'])) {
        return QuoteHeadshot(props)
      }
    case 'background':
      if (hasProps(props, ['image', 'citation'])) {
        return QuoteBackground(props)
      }
    default:
      return QuoteBasic(props)
  }
}

export const QuoteBasic = ({ children: quote, citation, url }: QuoteProps) => (
  <figure className="relative h-full font-display">
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

export const QuoteHeadshot = ({
  children: quote,
  citation,
  image,
  url,
}: WithRequired<QuoteProps, 'image' | 'citation'>) => (
  <figure className="relative flex h-full flex-col font-display">
    <blockquote
      cite={url?.toString()}
      className="m-auto text-xl leading-snug text-gray-900"
    >
      {quote}
    </blockquote>
    <figcaption className="mt-4 flex flex-row items-center text-right font-serif text-lg leading-snug text-gray-500">
      <div className="ml-auto">{citation}</div>
      <img
        className="ml-4 aspect-square h-28 w-28 rounded-full object-cover"
        src={image}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </figcaption>
  </figure>
)

export const QuoteBackground = ({
  children: quote,
  citation,
  image,
  url,
}: WithRequired<QuoteProps, 'image' | 'citation'>) => (
  <div className="reference reference--background reference--vignette">
    <div className="reference__image-container reference__image-container--background">
      <img
        className="reference__image"
        src={image}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>
    <figure className="reference__content reference__content--overlay">
      <blockquote
        cite={url?.toString()}
        className="feathered-blur relative m-auto text-xl"
      >
        {quote}
      </blockquote>
      <figcaption className="mt-4 items-center text-right font-serif leading-snug before:content-['\2014\20']">
        <span className="ml-auto">{citation}</span>
      </figcaption>
    </figure>
  </div>
)

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
    if (props.style === 'headshot') {
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
  if (author && props.style === 'headshot') {
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
