import type { WritingSamplesQuery } from '@tina/__generated__/types'
import { useTina, tinaField } from 'tinacms/dist/react'
import ArticlePreview from './ArticlePreview'
import { isNotEmpty } from '@lib/utils'

export interface WritingSamplesProps {
  writing: Parameters<typeof useTina<WritingSamplesQuery>>[0]
}

export default function WritingSamples({ writing }: WritingSamplesProps) {
  const { data } = useTina(writing)
  const { title, selections } = data.home.writing
  const articles = selections?.map((w) => w?.item).filter(isNotEmpty)

  return (
    <div
      id="writing"
      className="my-8 bg-gray-50"
      data-tina-field={tinaField(data.home, 'writing')}
    >
      <div className="container mx-auto py-8">
        <h2 className="mb-8 text-center font-display text-3xl font-bold">
          {title}
        </h2>
        {articles && (
          <div className="grid gap-8 md:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <ArticlePreview key={article.url} {...article} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
