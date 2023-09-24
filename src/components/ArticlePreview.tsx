export interface ArticlePreviewProps {
  url: string | URL
  title?: string | null
  image?: string | null
  description?: string | null
  publisher?: string | null
  hLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export default function ArticlePreview({
  url,
  title,
  description,
  publisher,
  image,
  hLevel: H = 'h3',
}: ArticlePreviewProps) {
  return (
    <div className="relative flex flex-col font-serif text-base">
      <div className="layer-children aspect-video shrink-0">
        <img
          className="object-cover"
          src={image || ''}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="h-full">
        <H className="mt-2 font-display text-2xl font-bold">
          <a href={url.toString()} className="pseudo-fill-parent">
            {title}
          </a>
        </H>
        {publisher && <p className="italic text-gray-500">{publisher}</p>}
        {description && <p className="mt-2">{description}</p>}
      </div>
    </div>
  )
}
