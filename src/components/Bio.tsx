import type { HomeQuery } from '@tina/__generated__/types'
import type { ResponsiveImageData } from '@lib/build/images'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import { tinaField } from 'tinacms/dist/react'
import { withTinaWrapper } from '@lib/browser/withTinaWrapper'
import Image from './Image'
import { getMetadata } from '@lib/images'

export interface BioProps {
  images?: ResponsiveImageData
}

export default withTinaWrapper<HomeQuery, BioProps>(function Bio({
  data,
  images,
}) {
  const { image, title, bio } = data.home.about
  const metadata = getMetadata(image, images)

  return (
    <div
      id="about"
      className="bg-white py-16"
      data-tina-field={tinaField(data.home, 'about')}
    >
      <div className="container mx-auto justify-center lg:flex">
        <Image
          className="layer-children mx-auto mb-8 block aspect-square max-w-sm shrink-0 self-start lg:mx-0 lg:mb-0 lg:w-1/2"
          metadata={metadata}
          alt="Headshot of Soraya Palmer"
          imgProps={{
            className: 'rounded-full object-cover',
          }}
          data-tina-field={tinaField(data.home.about, 'image')}
        />
        <div className="peer mx-auto max-w-prose self-center font-serif lg:ml-16 lg:mr-0 lg:w-1/2">
          <span className="inline-next-p heading-2 mr-1 inline underline decoration-amber-300 decoration-4">
            {title}
          </span>{' '}
          <TinaMarkdown content={bio} />
        </div>
      </div>
    </div>
  )
})
