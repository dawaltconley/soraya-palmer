import type {
  PressPageQuery,
  PressConnectionQuery,
} from '@tina/__generated__/types'
import type { TinaData } from '@lib/browser/withTinaWrapper'
import type { ResponsiveImageData } from '@lib/build/images'
import { useTina } from 'tinacms/dist/react'
import { isNotEmpty } from '@lib/utils'
import CardList, { type CardListProps } from './CardList'

export interface PressListProps {
  data: TinaData<PressConnectionQuery>
  images?: ResponsiveImageData
  exclude: TinaData<PressPageQuery>
  hLevel?: CardListProps['hLevel']
}

export default function PressList({
  data,
  exclude: excludeQuery,
  ...props
}: PressListProps) {
  const exclude = useTina(excludeQuery)
    .data.pressPage.press.map((p) =>
      p.__typename === 'PressPagePressArticle' ? p.article?.id : null,
    )
    .filter(isNotEmpty)

  return <CardList data={data} exclude={exclude} {...props} />
}
