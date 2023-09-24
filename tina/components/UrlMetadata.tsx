import type { MqlResponse } from '@microlink/mql'
import mql from '@microlink/mql'
import React, { useState, useRef } from 'react'
import type { InputProps } from 'tinacms'
import { wrapFieldsWithMeta, Input, LoadingDots } from 'tinacms'
import { get, memoize } from 'lodash'

const getMetadata = memoize(
  async (urlString: string | URL): Promise<MqlResponse['data']> => {
    let url: URL
    try {
      url = new URL(urlString)
    } catch (e) {
      throw new Error(`Couldn't parse url: ${urlString}`)
    }

    const { status, data } = await mql(url.href, { meta: true })
    if (status !== 'success')
      throw new Error(`Error fetching metadata for ${url.href}: ${status}`)

    return data
  },
)

export interface UrlMetadataProps {
  metadataFields: Record<string, string>
}

export const UrlMetadata = wrapFieldsWithMeta<InputProps, UrlMetadataProps>(
  ({ field, input, form }) => {
    if (!('form' in window)) {
      ;(window as any).form = form
    }

    const [error, setError] = useState<Error | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const debounce = useRef<number>()
    const onUrlChange = (url: string): void => {
      setIsLoading(true)
      window.clearTimeout(debounce.current)
      debounce.current = window.setTimeout(() => {
        getMetadata(url)
          .then((metadata) => {
            setError(null)
            if (metadata.url) input.onChange(metadata.url)
            form.batch(() => {
              Object.entries(field.metadataFields).forEach(
                ([field, property]) => {
                  form.change(field, get(metadata, property, ''))
                },
              )
            })
          })
          .catch(setError)
          .finally(() => setIsLoading(false))
      }, 1200)
    }

    return (
      <>
        <div className="relative">
          <Input
            {...input}
            // value={input.value}
            error={error}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              input.onChange(e.target.value)
              onUrlChange(e.target.value)
            }}
          />
          {isLoading && (
            <div className="absolute bottom-0 right-2 top-0 flex flex-col justify-center">
              <LoadingDots color="rgb(67 62 82)" />
            </div>
          )}
        </div>
      </>
    )
  },
)
