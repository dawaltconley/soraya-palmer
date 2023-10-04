import type { ReactNode } from 'react'
import { ReviewQuote } from './Quote'
import dayjs from 'dayjs'

interface ArticleQuote {
  url?: string | URL
  title?: string
  image?: string
  date?: string | Date
  description?: ReactNode
  source?: string
  author?: string
  hLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

type Style = 'article' | 'quote'

type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>

function hasProps<T extends object, K extends keyof T>(
  obj: T,
  props: K[],
): obj is WithRequired<T, K> {
  return props.every((p) => p in obj)
}

export interface ArticleQuoteProps extends ArticleQuote {
  style: Style
}

export default function ArticleQuote({ style, ...props }: ArticleQuoteProps) {
  switch (style) {
    case 'article':
      if (hasProps(props, ['url', 'title', 'image']))
        return ArticleMinimal(props)
    case 'quote':
      if (hasProps(props, ['description', 'source'])) {
        const { description, ...quoteProps } = props
        return <ReviewQuote {...quoteProps}>{description}</ReviewQuote>
      }
  }
  return null
}

// variants

// type ArticleMinimalProps = ArticleQuote &
//   Required<Pick<ArticleQuote, 'url' | 'title' | 'image'>>
//
// type QuoteMinimalProps = ArticleQuote &
//   Required<Pick<ArticleQuote, 'description' | 'source'>>
//
// type QuoteImageProps = QuoteMinimalProps &
//   Required<Pick<QuoteMinimalProps, 'image'>>

type Article = WithRequired<ArticleQuote, 'url' | 'title' | 'image'>
type Quote = WithRequired<ArticleQuote, 'description' | 'source'>
type QuoteImage = WithRequired<Quote, 'image'>

export function ArticleMinimal({
  url,
  title,
  image,
  source,
  date: dateString,
  hLevel,
}: Article) {
  const date = dateString ? dayjs(dateString) : null
  const H = hLevel || 'p'
  return (
    <div className="text-shadow relative h-full font-serif text-base text-white min-aspect-video">
      <div className="overlay-after absolute inset-0 z-0 after:bg-gray-950/80">
        <img
          className="h-full w-full object-cover"
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="relative z-10 flex h-full flex-col justify-center px-8 py-6">
        <H className="m-auto font-serif text-2xl font-bold leading-tight">
          <a href={url.toString()} className="pseudo-fill-parent">
            {title}
          </a>
        </H>
        {(date || source) && (
          <div className="mt-4 flex gap-2 leading-tight">
            {date && (
              <time dateTime={date.toISOString()}>
                {date.format('MMM D, YYYY')}
              </time>
            )}
            {source && <p className="ml-auto text-right italic">{source}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

interface QuoteProps {
  children: ReactNode
  citation?: ReactNode
  url?: string | URL
}

export interface ArticlePreviewProps {
  url: string | URL
  title: string
  image: string
  description?: ReactNode
  source?: string | null
  hLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function ArticlePreview({
  url,
  title,
  description,
  source,
  image,
  hLevel,
}: ArticlePreviewProps) {
  const H = hLevel || 'p'
  return (
    <div className="relative flex flex-col font-serif text-base">
      <div className="layer-children aspect-video shrink-0">
        <img
          className="object-cover"
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="h-full">
        <H className="mt-2 font-display text-2xl font-bold">
          <a href={url.toString()} className="pseudo-fill-parent">
            {title}
          </a>
        </H>
        {source && <p className="italic text-gray-500">{source}</p>}
        {description && <div className="mt-2">{description}</div>}
      </div>
    </div>
  )
}
