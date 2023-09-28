import type { ReactNode } from 'react'
import type { PressPageQuery } from '@tina/__generated__/types'
import { useTina, tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import ArticlePreview from './ArticlePreview'
import Quote from './Quote'

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
        if (p.__typename === 'PressPagePressArticle' && p.article) {
          const id = p.article._sys.filename
          const { url, title, image, source } = p.article
          const description = <TinaMarkdown content={p.article.description} />
          if (image) {
            content = (
              <ArticlePreview
                key={id}
                url={url}
                title={title}
                image={image}
                publisher={source}
                description={description}
              />
            )
          } else {
            // TODO fix
            content = <div>Oops! missing article image</div>
          }
        } else if (p.__typename === 'PressPagePressQuote' && p.quote) {
          const id = p.quote._sys.filename
          const { author, book, quote } = p.quote
          content = (
            <Quote
              key={id}
              type="author"
              author={author}
              source={book || undefined}
            >
              <TinaMarkdown content={quote} />
            </Quote>
          )
        } else {
          return null
        }
        return <div data-tina-field={tinaField(p)}>{content}</div>
      })}
    </div>
  )
}
