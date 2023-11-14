import type { CSSProperties } from 'react'
import { withTinaWrapper } from '@lib/browser/withTinaWrapper'

type BackgroundImageData = {
  workWithMePage: {
    headerImage: string
    imageControls?: {
      posX?: number | null
      posY?: number | null
    } | null
  }
}

interface BackgroundImageProps {
  optimized: string
}

export default withTinaWrapper<BackgroundImageData, BackgroundImageProps>(
  function BackgroundImage({ data, optimized }) {
    const { headerImage, imageControls } = data.workWithMePage
    const previewImage =
      headerImage === optimized ? null : `url("${headerImage}")`
    return (
      <div
        className="bg-img-header absolute inset-0 -z-10"
        style={
          {
            backgroundImage: previewImage || undefined,
            '--background-position-x': imageControls?.posX,
            '--background-position-y': imageControls?.posY,
          } as CSSProperties
        }
      ></div>
    )
  },
)
