import type { EventsConnectionQuery } from '@tina/__generated__/types'
import type { ResponsiveImageData } from '@lib/build/images'
import type { EventPreviewProps } from './EventPreview'
import EventPreview from './EventPreview'
import { withTinaWrapper } from '@lib/browser/withTinaWrapper'
import { isNotEmpty } from '@lib/utils'
import { fixTinaMalformedPath } from '@lib/images'
import { tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'

interface EventListProps {
  exclude?: string[]
  images?: ResponsiveImageData
  hLevel?: EventPreviewProps['hLevel']
}

export default withTinaWrapper<EventsConnectionQuery, EventListProps>(
  ({ data, exclude = [], images = {}, hLevel }) => {
    const cards =
      data.eventsConnection.edges
        ?.map((e) => e?.node)
        .filter((p) => exclude.every((id) => id !== p?.id))
        .filter(isNotEmpty) || []
    cards.sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    )

    return (
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {cards.map((card) => {
          let {
            id,
            image,
            description,
            startTime,
            endTime,
            location,
            ...props
          } = card
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
              <EventPreview
                hLevel={hLevel}
                image={metadata}
                alt={alt}
                start={startTime}
                end={endTime || undefined}
                place={location}
                {...props}
              >
                {description}
              </EventPreview>
            </li>
          )
        })}
      </ul>
    )
  },
)
