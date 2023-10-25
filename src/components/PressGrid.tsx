import type { ReactNode, CSSProperties } from 'react'
import type { PressPageQuery } from '@tina/__generated__/types'
import { useTina, tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import ArticleQuote, { isArticleStyle } from './ArticleQuote'
import { AuthorQuote, isQuoteStyle } from './Quote'

export interface PressGridProps {
  query: Parameters<typeof useTina<PressPageQuery>>[0]
}

export default function PressGrid({ query }: PressGridProps) {
  const { data } = useTina(query)
  const { press } = data.pressPage
  return (
    <div
      className="press-grid"
      data-tina-field={tinaField(data.pressPage.press)}
    >
      {press.map((p) => {
        let content: ReactNode
        let id: string
        if (p.__typename === 'PressPagePressArticle' && p.article) {
          id = p.article._sys.filename
          const { url, title, image, date, source, author } = p.article
          const description = p.article.description ? (
            <TinaMarkdown content={p.article.description} />
          ) : undefined
          content = (
            <ArticleQuote
              key={id}
              style={p.style && isArticleStyle(p.style) ? p.style : 'article'}
              url={url}
              title={title}
              date={date || undefined}
              image={image || undefined}
              source={source || undefined}
              author={author || undefined}
              description={description}
            />
          )
        } else if (p.__typename === 'PressPagePressQuote' && p.quote) {
          id = p.quote._sys.filename
          const { author, book, quote } = p.quote
          content = (
            <AuthorQuote
              key={id}
              style={p.style && isQuoteStyle(p.style) ? p.style : 'basic'}
              author={author}
              book={book || undefined}
            >
              <TinaMarkdown content={quote} />
            </AuthorQuote>
          )
        } else {
          return null
        }
        return (
          <div
            key={id}
            className="press-grid__item drop-shadow"
            style={
              {
                '--rows': p.rows || 1,
                '--cols': p.cols || 1,
              } as CSSProperties
            }
            data-tina-field={tinaField(p)}
          >
            {content}
          </div>
        )
      })}
    </div>
  )
}
