import type { ReactNode } from 'react'
import type { HomeQuery } from '@tina/__generated__/types'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import { tinaField } from 'tinacms/dist/react'
import { withTinaWrapper } from '@lib/browser/withTinaWrapper'
import { AuthorQuote, ReviewQuote } from './Quote'

export interface QuoteGridProps {
  max?: number
}

export default withTinaWrapper<HomeQuery, QuoteGridProps>(function QuoteGrid({
  data,
  max,
}) {
  return (
    <div
      id="pull-quotes"
      className="bg-gray-50 py-16"
      data-tina-field={tinaField(data.home, 'quotes')}
    >
      <div className="container mx-auto grid items-start justify-items-center gap-16 md:grid-cols-3 md:gap-8 lg:gap-16">
        {data.home.quotes.slice(0, max).map((q, i) => {
          let content: ReactNode
          if (q.__typename === 'HomeQuotesArticle' && q.article) {
            const { url, author, source, description } = q.article
            if (!source) return null
            content = (
              <ReviewQuote
                key={url}
                author={author || undefined}
                source={source}
                url={url}
              >
                <TinaMarkdown content={q.quoteOverride || description} />
              </ReviewQuote>
            )
          } else if (q.__typename === 'HomeQuotesQuote' && q.quote) {
            const { author, book, quote } = q.quote
            content = (
              <AuthorQuote
                key={author}
                author={author}
                book={book || undefined}
              >
                <TinaMarkdown content={q.quoteOverride || quote} />
              </AuthorQuote>
            )
          } else {
            return null
          }
          return (
            <div data-tina-field={tinaField(data.home, 'quotes', i)}>
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
})
