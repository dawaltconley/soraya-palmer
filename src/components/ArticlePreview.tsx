import type { ReactNode } from 'react'
import ImageCard from './ImageCard'

export interface ArticlePreviewProps {
  url: string | URL
  title: string
  image: string
  description?: ReactNode
  publisher?: string | null
  hLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export default function ArticlePreview({
  url,
  title,
  description,
  publisher,
  image,
  hLevel,
}: ArticlePreviewProps) {
  const H = hLevel || 'p'
  return (
    <ImageCard
      url={url}
      style="card"
      image={image}
      imgClass="aspect-video grow-0 shrink-0"
    >
      <div className="font-serif text-base">
        <H className="mt-2 font-display text-2xl font-bold">{title}</H>
        {publisher && <p className="italic text-gray-500">{publisher}</p>}
        {description && <div className="mt-2">{description}</div>}
      </div>
    </ImageCard>
  )
}
