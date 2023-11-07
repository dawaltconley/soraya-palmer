import type { EventsConnectionQuery } from '@tina/__generated__/types'
import type { ResponsiveImageData } from '@lib/build/images'
import type { EventPreviewProps } from './EventPreview'
import EventPreview from './EventPreview'
import EmailSignUp from './EmailSignUp'
import { withTinaWrapper } from '@lib/browser/withTinaWrapper'
import { isNotEmpty } from '@lib/utils'
import { getTinaImage } from '@lib/images'
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
  let {
    image,
    imageControls,
    description,
    startTime,
    endTime,
    location,
    ...props
  } = event
  if (typeof description === 'string') {
    description = description.trim()
  } else if ('children' in description) {
    if (description.children.length) {
      description = <TinaMarkdown content={description} />
    } else {
      description = null
    }
  }
  return {
    description,
    start: startTime,
    end: endTime || undefined,
    place: location,
    ...getTinaImage(image, imageControls, images),
    ...props,
  }
}

interface EventListProps {
  exclude?: string[]
  images?: ResponsiveImageData
}

export default withTinaWrapper<EventsConnectionQuery, EventListProps>(
  ({ data, exclude = [], images }) => {
    const now = Date.now()
    const events =
      data.eventsConnection.edges
        ?.map((e) => e?.node)
        .filter((p) => exclude.every((id) => id !== p?.id))
        .filter(isNotEmpty) || []
    events.sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    )

    const upcoming = events.filter((e) => new Date(e.startTime).getTime() > now)
    const past = events.filter((e) => new Date(e.startTime).getTime() <= now)

    return (
      <>
        <h1 className="separator heading-1 mb-8">Upcoming events</h1>
        {upcoming.length > 0 && (
          <ul
            className="mb-40 grid gap-4 md:grid-cols-2 lg:grid-cols-1"
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
        )}
        {upcoming.length === 0 && (
          <div className="mx-auto my-24 max-w-prose text-center font-serif text-gray-600">
            <p className="font-bold">No upcoming events</p>
            <p>
              This page is updated periodically. Please check back later, or
              subscribe to my mailing list to get notified when I have a new
              event.
            </p>
          </div>
        )}
        <div className="mb-40 mt-16">
          <EmailSignUp />
        </div>
        {past.length > 0 && (
          <>
            <h2 className="separator heading-1 mb-8 mt-16">Past events</h2>
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
          </>
        )}
      </>
    )
  },
)
