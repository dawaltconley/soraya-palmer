import type { PressConnectionQuery } from '@tina/__generated__/types'
import ArticlePreview from './ArticlePreview'
import { withTinaWrapper } from '@lib/browser/withTinaWrapper'
import { isNotEmpty } from '@lib/utils'
import type { PressPageQuery } from '@tina/__generated__/types'
import { useTina, tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'

export interface PressListProps {
  exclude: Parameters<typeof useTina<PressPageQuery>>[0]
}

export default withTinaWrapper<PressConnectionQuery, PressListProps>(
  ({ data, exclude: excludeQuery }) => {
    const exclude = useTina(excludeQuery)
      .data.pressPage.press.map((p) =>
        p.__typename === 'PressPagePressArticle' ? p.article?.id : null,
      )
      .filter(isNotEmpty)
    const press =
      data.pressConnection.edges
        ?.map((e) => e?.node)
        .filter((p) => p?.date && exclude.every((id) => id !== p?.id))
        .filter(isNotEmpty) || []
    press.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    return (
      <ul className="grid gap-4 text-lg md:grid-cols-2 lg:grid-cols-1">
        {press.map((press) => {
          const { id, image, description, ...props } = press
          if (!image) return null
          return (
            <li key={id} data-tina-field={tinaField(press, 'title')}>
              <ArticlePreview image={image} {...props}>
                <TinaMarkdown content={description} />
              </ArticlePreview>
            </li>
          )
        })}
      </ul>
    )
  },
)
