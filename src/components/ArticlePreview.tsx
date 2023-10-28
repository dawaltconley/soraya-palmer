import type { ReactNode } from 'react'
import type { ImageCardProps } from './ImageCard'
import ImageCard from './ImageCard'
import pick from 'lodash/pick'
import dayjs from 'dayjs'
import clsx from 'clsx'

const ArticlePreviewStyle = ['card', 'tile', 'inline'] as const
const ArticlePreviewLayout = ['basic', 'date'] as const

export type ArticlePreviewStyle = (typeof ArticlePreviewStyle)[number]
export type ArticlePreviewLayout = (typeof ArticlePreviewLayout)[number]

export const isArticleStyle = (str: string): str is ArticlePreviewStyle =>
  ArticlePreviewStyle.some((s) => s === str)

export const isArticleLayout = (str: string): str is ArticlePreviewLayout =>
  ArticlePreviewLayout.some((s) => s === str)

const passthroughProps = ['linkText', 'linkLocation', 'borderColor'] as const

export interface ArticlePreviewProps
  extends Pick<ImageCardProps, (typeof passthroughProps)[number]> {
  url: string | URL
  title: string
  image?: string | null
  date?: string | Date | null
  description?: ReactNode | null
  children?: ReactNode | null
  publisher?: string | null
  author?: string | null
  hLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  style?: ArticlePreviewStyle
  layout?: ArticlePreviewLayout
}

export default function ArticlePreview({
  url,
  image,
  style = 'card',
  ...props
}: ArticlePreviewProps) {
  if (!image) style = 'tile'
  const cardStyle = style === 'tile' ? 'tile' : 'card'
  const imageCardProps = pick(props, passthroughProps)
  return (
    <ImageCard
      url={url}
      style={cardStyle}
      image={image || undefined}
      {...imageCardProps}
    >
      <div
        className={clsx('h-full', {
          'px-8 py-4': style === 'card',
          'px-8 py-6': style === 'tile',
          'mb-4 @2xl/image-card:pl-8': style === 'inline',
        })}
      >
        <ArticleLayout {...props} />
      </div>
    </ImageCard>
  )
}

export type ArticleLayoutProps = Omit<ArticlePreviewProps, 'url' | 'image'>

export function ArticleLayout({ layout, ...props }: ArticleLayoutProps) {
  switch (layout) {
    case 'date':
      return ArticleLayoutDate(props)
    case 'basic':
    // fallthrough
    default:
      return ArticleLayoutBasic(props)
  }
}

function ArticleLayoutBasic({
  title,
  children,
  description = children,
  publisher,
  hLevel,
}: ArticleLayoutProps) {
  const H = hLevel || 'p'
  return (
    <div className="h-full max-w-prose font-serif @container/article-preview">
      <H className="mt-2 font-display text-2xl font-bold @2xl/image-card:mt-0">
        {title}
      </H>
      {publisher && (
        <p className="text-base italic text-gray-500">{publisher}</p>
      )}
      {description && <div className="mt-2">{description}</div>}
    </div>
  )
}

function ArticleLayoutDate({
  title,
  publisher,
  date: dateString,
  children,
  description = children,
  hLevel,
}: ArticleLayoutProps) {
  const date = dateString ? dayjs(dateString) : null
  const H = hLevel || 'p'

  return (
    <div className="h-full max-w-prose flex-col font-serif">
      <H className="w-full font-display text-3xl font-bold leading-none @container">
        {title}
      </H>
      {(date || publisher) && (
        <div className="mt-1 flex text-base leading-tight text-gray-500">
          {date && (
            <time className="shrink-0" dateTime={date.toISOString()}>
              {date.format('MMM, YYYY')}
            </time>
          )}
          {publisher && (
            <span className="ml-1 flex italic before:mr-1 before:content-['\20\2014\20']">
              {publisher}
            </span>
          )}
        </div>
      )}
      {description && (
        <>
          <div className="separator mt-6 hidden before:-top-4 @2xl/image-card:block">
            {description}
          </div>
        </>
      )}
    </div>
  )
}
