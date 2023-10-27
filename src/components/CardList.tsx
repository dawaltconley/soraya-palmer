import type {
  WritingConnectionQuery,
  PressConnectionQuery,
} from '@tina/__generated__/types'
import type { ArticlePreviewProps } from './ArticlePreview'
import ArticlePreview from './ArticlePreview'
import { withTinaWrapper } from '@lib/browser/withTinaWrapper'
import { isNotEmpty } from '@lib/utils'
import { tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'

interface CardListProps {
  exclude?: string[]
  hLevel?: ArticlePreviewProps['hLevel']
}

export default withTinaWrapper<
  PressConnectionQuery | WritingConnectionQuery,
  CardListProps
>(({ data, exclude = [], hLevel }) => {
  const connection =
    'pressConnection' in data ? data.pressConnection : data.writingConnection
  const cards =
    connection.edges
      ?.map((e) => e?.node)
      .filter((p) => p?.date && exclude.every((id) => id !== p?.id))
      .filter(isNotEmpty) || []
  cards.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <ul className="grid gap-4 text-lg md:grid-cols-2 lg:grid-cols-1">
      {cards.map((card) => {
        const { id, image, description, ...props } = card
        if (!image) return null
        return (
          <li key={id} data-tina-field={tinaField(card, 'title')}>
            <ArticlePreview hLevel={hLevel} image={image} {...props}>
              {description && typeof description === 'string' ? (
                description
              ) : (
                <TinaMarkdown content={description} />
              )}
            </ArticlePreview>
          </li>
        )
      })}
    </ul>
  )
})
