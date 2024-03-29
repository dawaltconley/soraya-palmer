import type { WritingSamplesQuery } from '@tina/__generated__/types'
import { tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import { withTinaWrapper } from '@browser/withTinaWrapper'
import ArticlePreview from './ArticlePreview'
import { isNotEmpty } from '@lib/utils'
import { getTinaImage, type ResponsiveImageData } from '@lib/images'
import ReadMore from './ReadMore'

interface WritingSamplesProps {
  max?: number
  images?: ResponsiveImageData
}

export default withTinaWrapper<WritingSamplesQuery, WritingSamplesProps>(
  ({ data, max, images = {} }) => {
    const { title, selections, linkText } = data.home.writing
    const articles = selections?.map((w) => w?.item).filter(isNotEmpty)
    return (
      <div
        id="writing"
        className="bg-gray-50 py-16"
        data-tina-field={tinaField(data.home.writing)}
      >
        <div className="container mx-auto">
          <h2 className="heading-2 mb-8 text-center">{title}</h2>
          {articles && (
            <div className="grid gap-8 xl:grid-cols-3">
              {articles
                .slice(0, max)
                .map(({ description, image, imageControls, ...article }, i) => {
                  description = description?.children?.length ? (
                    <TinaMarkdown content={description} />
                  ) : null
                  return (
                    <div
                      key={article.url}
                      data-tina-field={tinaField(
                        data.home.writing,
                        'selections',
                        i,
                      )}
                    >
                      <ArticlePreview
                        style="inline"
                        layout="date"
                        {...getTinaImage(image, imageControls, images)}
                        description={description}
                        {...article}
                      />
                    </div>
                  )
                })}
            </div>
          )}
          {linkText && (
            <div className="mt-12 text-center font-serif text-lg">
              <ReadMore href="/writing">{linkText}</ReadMore>
            </div>
          )}
        </div>
      </div>
    )
  },
)
