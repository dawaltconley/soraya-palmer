import type { ReactNode } from 'react'
import ImageCard from './ImageCard'
import dayjs from 'dayjs'
import clsx from 'clsx'

const ArticlePreviewStyle = ['card', 'tile'] as const
const ArticlePreviewLayout = ['basic', 'date'] as const

export type ArticlePreviewStyle = (typeof ArticlePreviewStyle)[number]
export type ArticlePreviewLayout = (typeof ArticlePreviewLayout)[number]

export const isArticleStyle = (str: string): str is ArticlePreviewStyle =>
  ArticlePreviewStyle.some((s) => s === str)

export const isArticleLayout = (str: string): str is ArticlePreviewLayout =>
  ArticlePreviewLayout.some((s) => s === str)

export interface ArticlePreviewProps {
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
  return (
    <ImageCard
      url={url}
      style={style}
      image={image || undefined}
      imgClass={clsx({
        'aspect-og grow-0 shrink-0': style === 'card',
        'aspect-og grow shrink-0 w-full': style === 'tile',
      })}
    >
      <div
        className={clsx('h-full', {
          // '@2xl/image-card:pl-8': style === 'card',
          'px-8 py-4': style === 'card',
          'px-8 py-6': style === 'tile',
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
        <div className="mt-1 flex leading-tight text-gray-500">
          {date && (
            <time className="shrink-0" dateTime={date.toISOString()}>
              {date.format('MMM D, YYYY')}
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
