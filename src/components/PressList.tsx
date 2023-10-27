import type {
  PressPageQuery,
  PressConnectionQuery,
} from '@tina/__generated__/types'
import type { TinaData } from '@lib/browser/withTinaWrapper'
import { useTina } from 'tinacms/dist/react'
import { isNotEmpty } from '@lib/utils'
import CardList from './CardList'

export interface PressListProps {
  data: TinaData<PressConnectionQuery>
  exclude: TinaData<PressPageQuery>
}

export default function PressList({
  data,
  exclude: excludeQuery,
}: PressListProps) {
  const exclude = useTina(excludeQuery)
    .data.pressPage.press.map((p) =>
      p.__typename === 'PressPagePressArticle' ? p.article?.id : null,
    )
    .filter(isNotEmpty)

  return <CardList data={data} exclude={exclude} />
}
