import type { MqlPayload } from '@microlink/mql'
import type { ReactNode } from 'react'
import Spinner from './Spinner'
import { useState, useEffect } from 'react'
import { useEditState } from 'tinacms/dist/react'
import { getMetadata } from '@lib/url-metadata'
import { memoize, mergeWith } from 'lodash'
import clsx from 'clsx'

const getMemoizedMetadata = memoize(getMetadata)

const Fallback = ({
  height,
  children,
}: {
  height?: number
  children: ReactNode
}) => (
  <div
    className="flex flex-col items-center justify-center bg-gray-100 p-4"
    style={{
      height: height ? height + 'px' : 'auto',
    }}
  >
    {children}
  </div>
)

const Error = ({ message }: { message: string }) => (
  <Fallback>
    <div className="text-2xl font-bold">Something went wrong</div>
    <div className="mt-2 rounded bg-gray-800 px-4 py-2 font-mono text-red-200">
      {message}
    </div>
  </Fallback>
)

export interface ArticlePreviewProps {
  url: string | URL
  title?: string | null
  description?: string | null
  publisher?: string | null
  image?: string | null
  hLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export default function ArticlePreview({
  hLevel: H = 'h3',
  ...override
}: ArticlePreviewProps) {
  const [fetched, setFetched] = useState<MqlPayload['data']>()
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { edit: editState } = useEditState()

  let { url, title, description, image, publisher } = mergeWith(
    { ...fetched, image: fetched?.image?.url },
    override,
    (a, b) => (!b ? a : undefined),
  )

  // fetch metadata from url if missing critical properties
  useEffect(() => {
    if (title && image) return
    setIsLoading(true)
    const debounce = window.setTimeout(() => {
      getMemoizedMetadata(url)
        .then((data) => {
          setFetched(data)
          setError(null)
        })
        .catch(setError)
        .finally(() => setIsLoading(false))
    }, 1200)
    return () => {
      window.clearTimeout(debounce)
    }
  }, [url, title, image])

  if (isLoading) {
    return (
      <Fallback key="loading">
        <Spinner key="spinner" className="my-8 text-4xl" />
      </Fallback>
    )
  }

  if (error) {
    return <Error message={error.toString()} />
  }

  if (!title || !image) {
    const missing = [title && 'title', image && 'image']
      .filter(Boolean)
      .join(', ')
    return <Error message={`Missing data: ${missing}`} />
  }

  return (
    <div className="relative flex flex-col font-serif text-base">
      <div className="layer-children aspect-video shrink-0">
        <img
          className="object-cover"
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="h-full">
        <H className="mt-2 font-display text-2xl font-bold">
          <a
            href={url.toString()}
            className={clsx({ 'pseudo-fill-parent': !editState })}
          >
            {title}
          </a>
        </H>
        {publisher && <p className="italic text-gray-500">{publisher}</p>}
        {description && <p className="mt-2">{description}</p>}
      </div>
    </div>
  )
}
