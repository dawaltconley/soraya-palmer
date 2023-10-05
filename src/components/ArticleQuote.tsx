import type { ReactNode } from 'react'
import type { WithRequired } from '@lib/utils'
import { ReviewQuote } from './Quote'
import { hasProps } from '@lib/utils'
import dayjs from 'dayjs'
import clsx from 'clsx'

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

type Style =
  | 'article'
  | 'article-basic'
  | 'quote'
  | 'quote-headshot'
  | 'quote-background'

export interface ArticleQuoteProps extends ArticleQuote {
  style: Style
}

export default function ArticleQuote({ style, ...props }: ArticleQuoteProps) {
  if (hasProps(props, ['url', 'title', 'image'])) {
    switch (style) {
      case 'article':
        return <ArticlePreview style="background-title" {...props} />
      case 'article-basic':
        return <ArticlePreview style="basic" {...props} />
    }
  }

  if (hasProps(props, ['description', 'source'])) {
    const { description, ...quoteProps } = props
    switch (style) {
      case 'quote-headshot':
        return (
          <ReviewQuote style="headshot" {...quoteProps}>
            {description}
          </ReviewQuote>
        )
      case 'quote-background':
        return (
          <ReviewQuote style="background" {...quoteProps}>
            {description}
          </ReviewQuote>
        )
      case 'quote':
      // fallthrough
      default:
        return (
          <ReviewQuote style="basic" {...quoteProps}>
            {description}
          </ReviewQuote>
        )
    }
  }
  return null
}

// variants
type Article = WithRequired<ArticleQuote, 'url' | 'title' | 'image'>
// type Quote = WithRequired<ArticleQuote, 'description' | 'source'>

export function ArticlePreview({
  url,
  title,
  image,
  source,
  date: dateString,
  description,
  hLevel,
  style = 'basic',
}: Article & { style?: 'basic' | 'background-title' }) {
  const date = dateString ? dayjs(dateString) : null
  const H = hLevel || 'p'
  return (
    <div
      className={clsx('reference', {
        'reference--background': style === 'background-title',
      })}
    >
      <div
        className={clsx('reference__image-container', {
          // 'flex-grow': style === 'basic',
          'reference__image-container--background':
            style === 'background-title',
        })}
      >
        <img
          className="reference__image"
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div
        className={clsx('reference__content', {
          'reference__content--overlay': style === 'background-title',
        })}
      >
        <H className="reference__title">
          <a href={url.toString()} className="pseudo-fill-parent">
            {title}
          </a>
        </H>
        {(date || source) && (
          <div
            className={clsx('reference__meta', {
              'reference__meta--first reference__meta--light':
                style === 'basic',
              'reference__meta--justified': style === 'background-title',
            })}
          >
            {date && (
              <time className="reference__date" dateTime={date.toISOString()}>
                {date.format('MMM D, YYYY')}
              </time>
            )}
            {source && (
              <span
                className={clsx('reference__source', {
                  'reference__source--right': style === 'background-title',
                })}
              >
                {source}
              </span>
            )}
          </div>
        )}
        {description && (
          <div
            className={clsx('reference__description', {
              hidden: style === 'background-title',
            })}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  )
}
