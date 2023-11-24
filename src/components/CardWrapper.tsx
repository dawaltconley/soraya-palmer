import type { ReactNode } from 'react'
import clsx from 'clsx'

export interface CardWrapperProps {
  children: ReactNode
  hover?: boolean
}

export default ({ children, hover }: CardWrapperProps) => (
  <div
    className={clsx('drop-shadow', {
      'duration-200 hover:drop-shadow-md': hover,
    })}
  >
    <div className="overflow-hidden rounded-sm bg-white">{children}</div>
  </div>
)
