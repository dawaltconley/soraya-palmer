import type { ResponsiveImageData } from '@lib/build/images'
import { tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import { withTinaWrapper } from '@lib/browser/withTinaWrapper'
import ContactButton from './ContactButton'
import ImageLink from './ImageLink'
import get from 'lodash/get'
import toPath from 'lodash/toPath'

type Components = Parameters<typeof TinaMarkdown>[0]['components']

export interface TinaContentProps {
  path: any
  images?: ResponsiveImageData
}

export default withTinaWrapper<object, TinaContentProps>(
  ({ data, path, images }) => {
    const pathNormalized = toPath(path)
    const content = get(data, pathNormalized)
    if (!content || content?.children?.length === 0) return null

    const formPath = [...pathNormalized]
    const fieldName = formPath.pop()

    const isString = typeof content === 'string'
    const Wrapper = isString ? 'span' : 'div'

    const components: Components = {
      ContactButton: (props) => (
        <ContactButton
          link="#contact"
          text={
            'text' in props && typeof props.text === 'string' && props.text
              ? props.text
              : undefined
          }
        />
      ),
      ImageLink: (props) =>
        'link' in props && 'image' in props ? (
          <ImageLink {...(props as any)} images={images} />
        ) : (
          <></>
        ),
    }

    return (
      <Wrapper data-tina-field={tinaField(get(data, formPath), fieldName)}>
        {isString ? (
          content
        ) : (
          <TinaMarkdown content={content} components={components} />
        )}
      </Wrapper>
    )
  },
)
