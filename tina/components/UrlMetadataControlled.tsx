import type { MqlResponse } from '@microlink/mql'
import mql from '@microlink/mql'
// import { Media } from '@toolkit/core'
// import { useCMS } from '@toolkit/react-core'
import React, { useState, useEffect, useRef } from 'react'
import {
  Input,
  ImageField,
  ImageUpload,
  type Media,
  useCMS,
  FieldLabel,
  GroupLabel,
  wrapFieldsWithMeta,
} from 'tinacms'
import { memoize } from 'lodash'

const getMetadata = memoize(
  async (urlString: string | URL): Promise<MqlResponse['data']> => {
    let url: URL
    try {
      url = new URL(urlString)
    } catch (e) {
      throw new Error(`Couldn't parse url: ${urlString}`)
    }

    console.log('fetching...', urlString)
    const { status, data } = await mql(url.href, { meta: true })
    if (status !== 'success')
      throw new Error(`Error fetching metadata for ${url.href}: ${status}`)
    console.log('fetched', urlString)

    return data
  },
)

// const getMetadataDebounced = (urlString: string | URL):

const UrlMetadata = ({ field, input, meta, form }: any) => {
  console.log({ field, input, meta, form })
  console.log('form', form.getState().values)
  if (!('form' in window)) {
    ;(window as any).form = form
  }

  const cms = useCMS()

  const [url, setUrl] = useState('')
  const [metadata, setMetadata] = useState<MqlResponse['data']>({})
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const debounce = useRef<number>()
  const onUrlChange = (url: string): void => {
    setUrl(url)
    setIsLoading(true)
    window.clearTimeout(debounce.current)
    debounce.current = window.setTimeout(() => {
      getMetadata(url)
        .then((data) => {
          setMetadata(data)
          input.onChange({
            ...data,
            url,
          })
          setError(null)
          form.batch(() => {
            if (data.title) form.change('title', data.title)
            if (data.image?.url) form.change('image', data.image.url)
            if (data.description) form.change('description', data.description)
            if (data.publisher) form.change('publisher', data.publisher)
          })
        })
        .catch(setError)
        .finally(() => setIsLoading(false))
    }, 1200)
  }

  // useEffect(() => {
  //   input.onChange({
  //     ...metadata,
  //     url,
  //   })
  // }, [metadata])

  console.log({ metadata })

  return (
    <fieldset className="space-y-2">
      <legend>{field.label}</legend>
      <div>{JSON.stringify({ error, isLoading })}</div>
      {/*  <FieldLabel name={field.name}>{field.label}</FieldLabel>  */}
      <Input
        {...input}
        value={url}
        onChange={(e: any) => {
          // console.log(e)
          const value = e.target.value
          onUrlChange(value)
        }}
      />
      <Input
        value={metadata.title || ''}
        onChange={(e: any) => {
          // console.log(e)
          const value = e.target.value
          setMetadata((m) => ({ ...m, title: value }))
        }}
        disabled={isLoading}
      />
      {
        // <ImageField
        //   field={imageField}
        //   input={{
        //     ...input,
        //     value: input?.value?.image?.url,
        //   }}
        //   meta={meta}
        //   form={form}
        // />
      }
      <ImageUpload
        src={metadata.image?.url || ''}
        value={metadata.image?.url || ''}
        onDrop={async (files, fileRejections) => {
          setMetadata((m) => ({
            ...m,
            image: {
              url: files[0].path,
            },
          }))
          console.log({ files, fileRejections })
        }}
      />
    </fieldset>
  )
}

export default UrlMetadata

const imageField = {
  type: 'image',
  name: 'image',
  clearable: true,
}

export const urlMetadataFields = {
  type: 'object',
  name: 'metadata',
  label: 'Metadata',
  ui: {
    component: UrlMetadata,
  },
  fields: [
    {
      type: 'string',
      name: 'url',
      label: 'URL',
      required: 'true',
    },
    {
      type: 'string',
      name: 'title',
      label: 'Title',
    },
    {
      type: 'image',
      name: 'image',
      label: 'Image',
    },
    {
      type: 'string',
      name: 'publisher',
      label: 'Publisher',
    },
    {
      type: 'string',
      name: 'description',
      label: 'Description',
    },
  ],
}
