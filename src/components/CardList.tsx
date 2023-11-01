import type {
  WritingConnectionQuery,
  PressConnectionQuery,
} from '@tina/__generated__/types'
import type { ResponsiveImageData } from '@lib/build/images'
import type { ArticlePreviewProps } from './ArticlePreview'
import ArticlePreview from './ArticlePreview'
import { withTinaWrapper } from '@lib/browser/withTinaWrapper'
import { isNotEmpty } from '@lib/utils'
import { fixTinaMalformedPath } from '@lib/images'
import { tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'

interface CardListProps {
  exclude?: string[]
  images?: ResponsiveImageData
  hLevel?: ArticlePreviewProps['hLevel']
}

export default withTinaWrapper<
  PressConnectionQuery | WritingConnectionQuery,
  CardListProps
>(({ data, exclude = [], images = {}, hLevel }) => {
  const connection =
    'pressConnection' in data ? data.pressConnection : data.writingConnection
  const cards =
    connection.edges
      ?.map((e) => e?.node)
      .filter((p) => p?.date && exclude.every((id) => id !== p?.id))
      .filter(isNotEmpty) || []
  cards.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <ul className="grid gap-4 xl:grid-cols-3">
      {cards.map((card) => {
        let { id, image, description, ...props } = card
        const source =
          card.__typename === 'Writing' ? card.publisher : card.source // TODO make consistent

        if (typeof description === 'string') {
          description = description.trim()
        } else if ('children' in description) {
          if (description.children.length) {
            description = <TinaMarkdown content={description} />
          } else {
            description = null
          }
        }

        image = fixTinaMalformedPath(image || '')
        const { metadata = image, alt } = images[image] || {}

        return (
          <li
            key={id}
            className="overflow-hidden rounded-sm bg-white drop-shadow duration-200 hover:drop-shadow-md"
            data-tina-field={tinaField(card, 'title')}
          >
            <ArticlePreview
              style="card"
              layout="date"
              hLevel={hLevel}
              image={metadata}
              alt={alt}
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
