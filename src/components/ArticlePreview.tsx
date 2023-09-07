import type { MqlPayload } from '@microlink/mql'
import { useState } from 'react'
import { getMetadata } from '@lib/url-metadata'

type ArticlePreviewProps = Partial<MqlPayload['data']> & {
  url: string | URL
}

export default function ArticlePreview({
  url: initUrl,
  ...props
}: ArticlePreviewProps) {
  const [{ url, title, description, image, publisher }, setMetadata] =
    useState<ArticlePreviewProps>({
      url: initUrl,
      ...props,
    })
  const [didFetch, setDidFetch] = useState(false)

  if (!title || !image) {
    if (!didFetch) {
      getMetadata(url)
        .then((fetched) => {
          console.log('fetched', fetched)
          setDidFetch(true)
          setMetadata((manual) => ({
            ...fetched,
            ...manual,
          }))
        })
        .catch((e) => console.error(e))
      return <div>Loading...</div>
    } else {
      return <div>Missing data!</div>
    }
  }

  const H = 'h3'

  return (
    <div className="relative font-serif text-base">
      <div className="layer-children aspect-video">
        <img className="object-cover" src={image.url} alt="" />
      </div>
      <H className="mt-2 font-display text-2xl font-bold">
        <a href={url.toString()} className="pseudo-fill-parent">
          {title}
        </a>
      </H>
      {publisher && <p className="italic text-gray-500">{publisher}</p>}
      {description && <p className="mt-2">{description}</p>}
    </div>
  )
}
