import type { WritingSamplesQuery } from '@tina/__generated__/types'
import { useTina } from 'tinacms/dist/react'
import ArticlePreview from './ArticlePreview'
import { isNotEmpty } from '@lib/utils'

export interface WritingSamplesProps {
  writing: Parameters<typeof useTina<WritingSamplesQuery>>[0]
}

export default function WritingSamples({ writing }: WritingSamplesProps) {
  const { data } = useTina(writing)
  const articles = data.home.writing?.map((w) => w?.writing).filter(isNotEmpty)

  return (
    <>
      <h2 className="mb-8 text-center font-display text-3xl font-bold">
        More Writing
      </h2>
      {articles && (
        <div className="grid gap-8 md:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <ArticlePreview key={article.url} {...article} />
          ))}
        </div>
      )}
    </>
  )
}
