import {
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type SyntheticEvent,
} from 'react'

interface Source {
  src: string
  type: string
}

export interface VideoProps extends ComponentPropsWithoutRef<'video'> {
  sources: Source[]
  play?: boolean
  onReady: (e?: SyntheticEvent<HTMLVideoElement>) => void
}

export default function Video({
  sources,
  play = false,
  onReady,
  ...props
}: VideoProps) {
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (video.current && video.current.readyState >= 3) {
      onReady()
    }
  }, [])

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (play) {
      v.currentTime = 0
      v.play()
    } else {
      v.pause()
    }
  }, [play])

  return (
    <video ref={video} onCanPlayThrough={onReady} {...props}>
      {sources.map((s) => (
        <source key={s.src} {...s} />
      ))}
    </video>
  )
}
