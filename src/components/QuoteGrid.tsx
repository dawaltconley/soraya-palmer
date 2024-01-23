import type { ReactNode } from 'react'
import type { HomeQuery } from '@tina/__generated__/types'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import { tinaField } from 'tinacms/dist/react'
import { withTinaWrapper } from '@lib/browser/withTinaWrapper'
import ReadMore from './ReadMore'
import { AuthorQuote, ReviewQuote } from './Quote'
import { hasRichText } from '@lib/utils'

export interface QuoteGridProps {
  max?: number
}

export default withTinaWrapper<HomeQuery, QuoteGridProps>(function QuoteGrid({
  data,
  max,
}) {
  const { press, linkText } = data.home.quotes
  return (
    <div
      id="pull-quotes"
      className="bg-gray-50 py-16"
      data-tina-field={tinaField(data.home, 'quotes')}
    >
      <div className="container mx-auto grid items-start justify-items-center gap-16 md:grid-cols-3 md:gap-8 lg:gap-16">
        {press.slice(0, max).map((q, i) => {
          let key: string
          let content: ReactNode
          if (q.__typename === 'HomeQuotesPressArticle' && q.article) {
            const { url, author, source, description } = q.article
            key = url
            if (!source) return null
            content = (
              <ReviewQuote
                author={author || undefined}
                source={source}
                url={url}
              >
                <TinaMarkdown
                  content={
                    hasRichText(q.quoteOverride) ? q.quoteOverride : description
                  }
                />
              </ReviewQuote>
            )
          } else if (q.__typename === 'HomeQuotesPressQuote' && q.quote) {
            const { author, book, quote } = q.quote
            key = author
            content = (
              <AuthorQuote author={author} book={book || undefined}>
                <TinaMarkdown
                  content={
                    hasRichText(q.quoteOverride) ? q.quoteOverride : quote
                  }
                />
              </AuthorQuote>
            )
          } else {
            return null
          }
          return (
            <div
              key={key}
              data-tina-field={tinaField(data.home.quotes, 'press', i)}
            >
              {content}
            </div>
          )
        })}
      </div>
      {linkText && (
        <div className="mt-12 text-center font-serif text-lg">
          <ReadMore href="/press">{linkText}</ReadMore>
        </div>
      )}
    </div>
  )
})
