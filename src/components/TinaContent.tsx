import { tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import { withTinaWrapper } from '@lib/browser/withTinaWrapper'
import { get, toPath } from 'lodash'

export interface TinaContentProps {
  path: any
}

export default withTinaWrapper<object, TinaContentProps>(({ data, path }) => {
  const pathNormalized = toPath(path)
  const content = get(data, pathNormalized)
  if (!content || content?.children?.length === 0) return null

  const formPath = [...pathNormalized]
  const fieldName = formPath.pop()

  const isString = typeof content === 'string'
  const Wrapper = isString ? 'span' : 'div'

  return (
    <Wrapper data-tina-field={tinaField(get(data, formPath), fieldName)}>
      {isString ? content : <TinaMarkdown content={content} />}
    </Wrapper>
  )
})
