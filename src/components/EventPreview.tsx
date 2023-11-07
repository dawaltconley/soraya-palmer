import type { ReactNode } from 'react'
import type { ImageMetadata } from '@dawaltconley/responsive-images'
import type { ImageCardProps } from './ImageCard'
import Card from './Card'
import Icon from './Icon'
import dayjs from 'dayjs'
import clsx from 'clsx'

import { faCalendar } from '@fortawesome/pro-regular-svg-icons'
import { faLocationDot } from '@fortawesome/pro-regular-svg-icons'

const formatTime = (date: dayjs.Dayjs): string =>
  // date.format('h:mm')
  date.minute() ? date.format('h:mm') : date.format('h')

export interface EventPreviewProps
  extends Pick<
    ImageCardProps,
    'imageSize' | 'imagePosition' | 'linkText' | 'linkLocation' | 'borderColor'
  > {
  url: string | URL
  title: string
  image: string | ImageMetadata['metadata']
  alt?: string
  start: string | Date
  end?: string | Date
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
  place,
  children,
  description = children,
  hLevel,
  ...imageCardProps
}: EventPreviewProps) {
  const start = dayjs(startString)
  const end = endString ? dayjs(endString) : null
  const H = hLevel || 'p'

  const startPeriod =
    !end || start.format('a') !== end.format('a') ? start.format('a') : ''

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
                  {end && !end.isSame(start, 'date') ? (
                    <>
                      <time
                        className="whitespace-nowrap"
                        dateTime={start.toISOString()}
                      >
                        {`${start.format('dddd, MMMM D')}, ${
                          formatTime(start) + start.format('a')
                        }`}
                      </time>
                      <span className="mx-1">&nbsp;{'\u2012 '}</span>
                      <time
                        className="whitespace-nowrap"
                        dateTime={end.toISOString()}
                      >
                        {`${end.format('dddd, MMMM D')}, ${
                          formatTime(end) + end.format('a')
                        }`}
                      </time>
                    </>
                  ) : (
                    <>
                      <time dateTime={start.toISOString()}>
                        {start.format('dddd, MMMM D')}
                        {', '}
                        {formatTime(start) + startPeriod}
                      </time>
                      {end && (
                        <time
                          dateTime={end.toISOString()}
                          className="before:mx-1 before:content-['\00A0\2012\00A0']"
                        >
                          {formatTime(end) + end.format('a')}
                        </time>
                      )}
                    </>
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
