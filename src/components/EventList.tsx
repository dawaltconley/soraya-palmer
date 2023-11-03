import type { EventsConnectionQuery } from '@tina/__generated__/types'
import type { ResponsiveImageData } from '@lib/build/images'
import type { EventPreviewProps } from './EventPreview'
import EventPreview from './EventPreview'
import { withTinaWrapper } from '@lib/browser/withTinaWrapper'
import { isNotEmpty } from '@lib/utils'
import { fixTinaMalformedPath } from '@lib/images'
import { tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'

type Event = NonNullable<
  NonNullable<
    NonNullable<EventsConnectionQuery['eventsConnection']['edges']>[number]
  >['node']
>

const toEventProps = (
  event: Event,
  images: ResponsiveImageData = {},
): EventPreviewProps => {
  let { image, description, startTime, endTime, location, ...props } = event
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
  return {
    description,
    start: startTime,
    end: endTime || undefined,
    place: location,
    image: metadata,
    alt,
    ...props,
  }
}

interface EventListProps {
  exclude?: string[]
  images?: ResponsiveImageData
  hLevel?: EventPreviewProps['hLevel']
}

export default withTinaWrapper<EventsConnectionQuery, EventListProps>(
  ({ data, exclude = [], images, hLevel }) => {
    const events =
      data.eventsConnection.edges
        ?.map((e) => e?.node)
        .filter((p) => exclude.every((id) => id !== p?.id))
        .filter(isNotEmpty) || []
    events.sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    )

    const upcoming = events.filter(
      (e) => new Date(e.startTime).getTime() > Date.now(),
    )
    const past = events.filter(
      (e) => new Date(e.startTime).getTime() <= Date.now(),
    )

    return (
      <div>
        <div className="flex-grow">
          <h1 className="separator mb-8 font-display text-5xl font-bold capitalize">
            Upcoming events
          </h1>
          <ul
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-1"
            data-events="upcoming"
          >
            {upcoming.map((event) => {
              const props = toEventProps(event, images)

              return (
                <li
                  key={event.id}
                  className="overflow-hidden rounded-sm bg-white drop-shadow duration-200 odd:last:col-span-full hover:drop-shadow-md"
                  data-tina-field={tinaField(event, 'title')}
                  data-event-card={new Date(props.start).toISOString()}
                >
                  <EventPreview {...props} />
                </li>
              )
            })}
          </ul>
        </div>
        <div>
          <h2 className="separator mb-8 mt-16 font-display text-5xl font-bold capitalize">
            Past events
          </h2>
          <ul
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-3"
            data-events="past"
          >
            {past.map((event) => {
              const props = toEventProps(event, images)

              return (
                <li
                  key={event.id}
                  className="overflow-hidden rounded-sm bg-white drop-shadow duration-200 hover:drop-shadow-md"
                  data-tina-field={tinaField(event, 'title')}
                  data-event-card={new Date(props.start).toISOString()}
                >
                  <EventPreview {...props} />
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  },
)
