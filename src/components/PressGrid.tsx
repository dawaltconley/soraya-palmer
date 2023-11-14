import type { ReactNode, CSSProperties } from 'react'
import type { PressPageQuery } from '@tina/__generated__/types'
import { useTina, tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import Card from './Card'
import { isCardStyle } from './ImageCard'
import { ArticleLayout } from './ArticlePreview'
import { AuthorQuote, ReviewQuote } from './Quote'
import {
  getTinaImage,
  type ResponsiveImageData,
  type TinaImageControls,
} from '@lib/images'
import clsx from 'clsx'
import colors from 'tailwindcss/colors' // TODO avoid this

export interface PressGridProps {
  query: Parameters<typeof useTina<PressPageQuery>>[0]
  images?: ResponsiveImageData
  accentColor?: string
}

export default function PressGrid({
  query,
  images = {},
  accentColor = colors.amber['300'],
}: PressGridProps) {
  const { data } = useTina(query)
  const { press } = data.pressPage
  return (
    <div
      className="press-grid"
      data-tina-field={tinaField(data.pressPage, 'press')}
    >
      {press.map((p, i) => {
        let content: ReactNode
        let id: string
        let url: string | null | undefined
        let image: string | null | undefined
        let imageControls: TinaImageControls | null | undefined
        const { layout, imageSide } = p

        if (p.__typename === 'PressPagePressArticle' && p.article) {
          id = p.article._sys.filename
          ;({ url, image, imageControls } = p.article)
          const { title, date, source, author } = p.article
          const description = p.article.description ? (
            <TinaMarkdown content={p.article.description} />
          ) : undefined
          content =
            p.display === 'quote' && source ? (
              <ReviewQuote
                key={id}
                author={author || undefined}
                source={source}
                url={url}
              >
                {description}
              </ReviewQuote>
            ) : (
              <ArticleLayout
                key={id}
                layout="date"
                title={title}
                date={date || undefined}
                publisher={source || undefined}
                author={author || undefined}
                description={description}
              />
            )
        } else if (p.__typename === 'PressPagePressQuote' && p.quote) {
          id = p.quote._sys.filename
          ;({ image, imageControls } = p.quote)
          const { author, book, quote } = p.quote
          content = (
            <AuthorQuote key={id} author={author} book={book || undefined}>
              <TinaMarkdown content={quote} />
            </AuthorQuote>
          )
        } else {
          return null
        }

        const { image: metadata, ...controls } = getTinaImage(
          image || '',
          imageControls,
          images,
        )

        return (
          <div
            key={id}
            className={clsx(
              'press-grid__item overflow-hidden rounded-sm bg-white drop-shadow',
              {
                'duration-200 hover:drop-shadow-md': url,
              },
            )}
            style={
              {
                '--rows': p.rows || 1,
                '--cols': p.cols || 1,
              } as CSSProperties
            }
            data-tina-field={tinaField(data.pressPage, 'press', i)}
          >
            <Card
              style={isCardStyle(layout) ? layout : 'tile'}
              url={url || undefined}
              image={metadata}
              borderColor={accentColor}
              imageSide={imageSide === 'right' ? 'right' : 'left'}
              {...controls}
            >
              <div className="flex h-full items-stretch px-6 py-4 sm:px-8 sm:py-6">
                {content}
              </div>
            </Card>
          </div>
        )
      })}
    </div>
  )
}
