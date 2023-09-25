import type { MqlResponse } from '@microlink/mql'
import mql from '@microlink/mql'
import React, { useState, useEffect, useRef } from 'react'
import { Input, FieldLabel, GroupLabel, wrapFieldsWithMeta } from 'tinacms'
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

const UrlMetadata = ({ field, input, meta }: any) => {
  // console.log({ input, meta })

  const [url, setUrl] = useState('')
  const [metadata, setMetadata] = useState<MqlResponse['data']>()
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const debounce = useRef<number>()
  const onUrlChange = (url: string): void => {
    window.clearTimeout(debounce.current)
    debounce.current = window.setTimeout(() => {
      getMetadata(url)
        .then((data) => {
          setMetadata(data)
          input.onChange({
            ...data,
            url,
            foo: 'bar',
            bar: 'baz',
          })
          setError(null)
        })
        .catch(setError)
        .finally(() => setIsLoading(false))
    }, 1200)
  }

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
          setUrl(value)
          onUrlChange(value)
        }}
      />
      {
        // <Input
        // onChange={(e: any) => {
        //   // console.log(e)
        //   const value = e.target.value
        //   input.onChange({
        //     url,
        //     foo: value,
        //   })
        //   }}
        // />
      }
    </fieldset>
  )
}

export default UrlMetadata

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
