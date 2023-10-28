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
  cards.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <ul className="grid gap-4 lg:grid-cols-3">
      {cards.map((card) => {
        let { id, image, description, ...props } = card
        const source =
          card.__typename === 'Writing' ? card.publisher : card.source // TODO make consistent

        // if (!image) return null
        // console.log({ title: props.title, description })
        if (typeof description === 'string') {
          description = description.trim()
        } else if ('children' in description) {
          if (description.children.length) {
            description = <TinaMarkdown content={description} />
          } else {
            description = null
          }
        }

        return (
          <li
            key={id}
            className="bg-white drop-shadow"
            data-tina-field={tinaField(card, 'title')}
          >
            <ArticlePreview
              style="card"
              layout="date"
              hLevel={hLevel}
              image={image}
              {...props}
              publisher={source}
            >
              {description}
            </ArticlePreview>
          </li>
        )
      })}
    </ul>
  )
})
