import type { ReactNode } from 'react'
import type { WithRequired } from '@lib/utils'
import { ReviewQuote } from './Quote'
import ImageCard from './ImageCard'
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

const ArticlePreviewStyle = [
  'article',
  'article-bg-title',
  'article-bold-title',
  'article-tile-title',
  'quote',
  'quote-headshot',
  'quote-background',
  'quote-tile',
] as const

export type ArticlePreviewStyle = (typeof ArticlePreviewStyle)[number]

export const isArticleStyle = (str: string): str is ArticlePreviewStyle =>
  ArticlePreviewStyle.some((s) => s === str)

export interface ArticleQuoteProps extends ArticleQuote {
  style?: ArticlePreviewStyle
}

export default function ArticleQuote({
  style = 'article',
  ...props
}: ArticleQuoteProps) {
  if (hasProps(props, ['url', 'title', 'image'])) {
    switch (style) {
      case 'article-bg-title':
        return <ArticlePreview style="background-title" {...props} />
      case 'article-bold-title':
        return <ArticlePreview style="bold-title" {...props} />
      case 'article-tile-title':
        return <ArticleTile {...props} />
      case 'article':
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
      case 'quote-tile':
        return (
          <ReviewQuote style="tile" {...quoteProps}>
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
}: Article & {
  style?: 'basic' | 'background-title' | 'bold-title' | 'tile-title'
}) {
  const date = dateString ? dayjs(dateString) : null
  const H = hLevel || 'p'

  const isBasic = style === 'basic'
  const isBg = style === 'background-title'
  const isBold = style === 'bold-title'
  const isTile = style === 'tile-title'

  return (
    <div
      className={clsx('reference', {
        'reference--background': isBg,
        'reference--tile': isTile,
      })}
    >
      <div
        className={clsx('reference__image-container', {
          'reference--vignette flex-grow': isBold,
          'reference__image-container--background reference--vignette': isBg,
          'reference__image-container--tile reference--vignette': isTile,
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
          'reference__content--overlay': isBg,
          'reference__content--background': isBold,
          'reference__content--tile drop-shadow-xl': isTile,
        })}
      >
        <H
          className={clsx('reference__title', {
            'reference__title--center feathered-blur-before relative': isBg,
          })}
        >
          <a href={url.toString()} className="pseudo-fill-parent">
            {title}
          </a>
        </H>
        {(date || source) && (
          <div
            className={clsx('reference__meta', {
              'reference__meta--first reference__meta--light': isBasic,
              'reference__meta--first': isBold || isTile,
              'reference__meta--justified': isBg,
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
                  'reference__source--right': isBg,
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
              hidden: isBg || isBold || isTile,
            })}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  )
}

export function ArticleTile({
  url,
  title,
  image,
  source,
  date: dateString,
  description,
  hLevel,
}: Article) {
  const date = dateString ? dayjs(dateString) : null
  const H = hLevel || 'p'

  return (
    <ImageCard
      style="tile"
      url={url}
      image={image}
      imgClass="shrink-0 basis-[40%]"
    >
      <div className="flex h-full max-w-prose flex-col px-8 py-6 font-serif text-base">
        <H className="font-display text-2xl font-bold leading-tight">{title}</H>
        {(date || source) && (
          <div className="-order-1 flex leading-tight">
            {date && (
              <time dateTime={date.toISOString()}>
                {date.format('MMM D, YYYY')}
              </time>
            )}
            {source && (
              <span className="ml-1 italic before:content-['\20\2014\20']">
                {source}
              </span>
            )}
          </div>
        )}
        {description && (
          <div className="mt-2 hidden @2xl/image-card:block">{description}</div>
        )}
      </div>
    </ImageCard>
  )
}
