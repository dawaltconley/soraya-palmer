import type { WritingSamplesQuery } from '@tina/__generated__/types'
import { tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import { withTinaWrapper } from '@browser/withTinaWrapper'
import ArticlePreview from './ArticlePreview'
import { isNotEmpty } from '@lib/utils'

export default withTinaWrapper<WritingSamplesQuery>(({ data }) => {
  const { title, selections } = data.home.writing
  const articles = selections?.map((w) => w?.item).filter(isNotEmpty)
  return (
    <div
      id="writing"
      className="bg-gray-50 py-16"
      data-tina-field={tinaField(data.home.writing)}
    >
      <div className="container mx-auto">
        <h2 className="mb-8 text-center font-display text-3xl font-bold">
          {title}
        </h2>
        {articles && (
          <div className="grid gap-8 xl:grid-cols-3">
            {articles.slice(0, 3).map(({ description, ...article }) => {
              description = description?.children?.length ? (
                <TinaMarkdown content={description} />
              ) : null
              return (
                <ArticlePreview
                  key={article.url}
                  style="inline"
                  layout="date"
                  description={description}
                  {...article}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
})
