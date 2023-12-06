import type { ReactNode } from 'react'
import type { ImageMetadata } from '@dawaltconley/responsive-images'
import type { ImageCardProps } from './ImageCard'
import Card from './Card'
import Icon from './Icon'
import clsx from 'clsx'

import { faCalendar } from '@fortawesome/pro-regular-svg-icons/faCalendar'
import { faLocationDot } from '@fortawesome/pro-regular-svg-icons/faLocationDot'

const isSameDay = (d1: Date, d2: Date): boolean =>
  d1.getDate() === d2.getDate() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getFullYear() === d2.getFullYear()

const formatParts = (parts: Intl.DateTimeFormatPart[]): ReactNode => {
  const isZeroMinutes = (p?: Intl.DateTimeFormatPart): boolean =>
    !!p && p.type === 'minute' && p.value === '00'
  return parts
    .filter(
      (p, i, parts) =>
        !isZeroMinutes(p) &&
        !(p.value === ':' && isZeroMinutes(parts[i + 1])) &&
        !(p.type === 'literal' && parts[i + 1]?.type === 'dayPeriod'),
    )
    .map((p) => (p.type === 'dayPeriod' ? p.value.toLowerCase() : p.value))
    .join('')
}

interface TimeRangeProps {
  start: Date
  end: Date
  format: Intl.DateTimeFormat
}

const TimeRange = ({ start, end, format }: TimeRangeProps) => {
  const parts = format.formatRangeToParts(start, end)
  const splitAt = parts.findIndex((p) => p.source === 'endRange')
  let sep: Intl.DateTimeRangeFormatPart | null = parts[splitAt - 1]
  if (sep.type !== 'literal' || sep.source !== 'shared') sep = null
  const startString = formatParts(parts.slice(0, sep ? splitAt - 1 : splitAt))
  const endString = formatParts(parts.slice(splitAt))

  const sameDay = isSameDay(start, end)

  return (
    <>
      <time dateTime={start.toISOString()} suppressHydrationWarning>
        {startString}
      </time>
      <span className="mx-0">
        &nbsp;{sep?.value.trim() || '\u2012'}
        {sameDay ? <>&nbsp;</> : <br />}
      </span>
      <time dateTime={end.toISOString()} suppressHydrationWarning>
        {endString}
      </time>
    </>
  )
}

export interface EventPreviewProps
  extends Pick<
    ImageCardProps,
    'imageSize' | 'imagePosition' | 'linkText' | 'linkLocation' | 'borderColor'
  > {
  url?: string | URL
  title: string
  image: string | ImageMetadata
  alt?: string
  start: string | Date
  end?: string | Date
  tz?: string
  place: string
  description?: ReactNode
  children?: ReactNode
  hLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export default function ArticlePreview({
  url,
  image,
  alt,
  title,
  start: startString,
  end: endString,
  tz = 'America/New_York',
  place,
  children,
  description = children,
  hLevel,
  ...imageCardProps
}: EventPreviewProps) {
  const H = hLevel || 'p'

  const start = new Date(startString)
  const end = endString ? new Date(endString) : null

  const dateFormat = Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: tz,
    timeZoneName: 'short',
  })

  return (
    <Card
      url={url}
      style="card"
      image={image}
      alt={alt}
      linkText="View event"
      aspectRatio="square"
      grow="text"
      {...imageCardProps}
    >
      <div className="flex h-full px-8 py-4 font-serif text-base @container/event-preview">
        <div className="h-full max-w-prose flex-col @sm:text-lg @2xl:text-xl">
          <H className="w-full font-display text-2xl font-semibold leading-tight @sm:text-3xl @2xl:text-4xl">
            {title}
          </H>
          <div
            className={clsx(
              'mb-2 mt-4 after:-bottom-4 after:w-full after:border-b after:border-gray-200',
              {
                separator: description,
              },
            )}
          >
            <div className="fa-ul relative -order-1 ml-6">
              <div>
                <div className="fa-li">
                  <Icon icon={faCalendar} className="fa-inline fa-fw" />{' '}
                </div>
                <div>
                  {end ? (
                    <TimeRange start={start} end={end} format={dateFormat} />
                  ) : (
                    <time
                      dateTime={start.toISOString()}
                      suppressHydrationWarning
                    >
                      {formatParts(dateFormat.formatToParts(start))}
                    </time>
                  )}
                </div>
              </div>
              <div>
                <div className="fa-li">
                  <Icon icon={faLocationDot} className="fa-inline fa-fw" />{' '}
                </div>
                {place}
              </div>
            </div>
          </div>
          {description && <div className="mt-8">{description}</div>}
        </div>
      </div>
    </Card>
  )
}
