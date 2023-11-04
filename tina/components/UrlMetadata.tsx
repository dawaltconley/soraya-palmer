import type { MqlResponse, MicrolinkApiOptions } from '@microlink/mql'
import mql from '@microlink/mql'
import React, { useState, useEffect, useRef } from 'react'
import type { InputProps } from 'tinacms'
import { wrapFieldsWithMeta, Input, LoadingDots } from 'tinacms'
import { get, memoize } from 'lodash'
import { fixTinaMalformedPath } from '../../src/lib/images'

const getMetadata = memoize(
  async (
    urlString: string | URL,
    options?: MicrolinkApiOptions,
  ): Promise<MqlResponse['data']> => {
    let url: URL
    try {
      url = new URL(urlString)
    } catch (e) {
      throw new Error(`Couldn't parse url: ${urlString}`)
    }

    const { status, data } = await mql(url.href, {
      meta: true,
      ...options,
    })
    if (status !== 'success')
      throw new Error(`Error fetching metadata for ${url.href}: ${status}`)

    return data
  },
)

export interface UrlMetadataProps {
  metadataFields: Record<
    string,
    string | ((data: MqlResponse['data']) => string)
  >
  overwriteFields: boolean
  mqlOptions: MicrolinkApiOptions
}

export const UrlMetadata = wrapFieldsWithMeta<InputProps, UrlMetadataProps>(
  ({ field, input, form }) => {
    // ;(window as any).form = form
    const [error, setError] = useState<Error | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const debounce = useRef<number>()
    const onUrlChange = (url: string): void => {
      setIsLoading(true)
      window.clearTimeout(debounce.current)
      debounce.current = window.setTimeout(() => {
        getMetadata(url, field.mqlOptions)
          .then((metadata) => {
            setError(null)
            const { values } = form.getState()
            const updateFields = Object.entries(field.metadataFields).filter(
              ([f]) =>
                field.overwriteFields || // if has overwrite flag
                !values[f] || // if field is empty
                values[f].children?.length === 0 || // if empty AST
                (values[f].children?.length === 1 &&
                  !values[f].children?.[0]?.children?.[0].text),
            )
            form.batch(() => {
              updateFields.forEach(([field, property]) => {
                const value: string =
                  typeof property === 'function'
                    ? property(metadata)
                    : get(metadata, property, '')
                form.change(field, value)
              })
            })
          })
          .catch(setError)
          .finally(() => setIsLoading(false))
      }, 1200)
    }

    useEffect(() => {
      const { values } = form.getState()

      for (let [field, value] of Object.entries(values)) {
        if (typeof value === 'string') {
          const fixed = fixTinaMalformedPath(value)
          if (fixed !== value) {
            form.change(field, fixed)
          }
        }
      }
    }, [])

    return (
      <>
        <div className="relative">
          <Input
            {...input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              input.onChange(e.target.value)
              onUrlChange(e.target.value)
            }}
          />
          {isLoading && (
            <div className="absolute bottom-0 right-2 top-0 flex flex-col justify-center">
              <LoadingDots color="rgb(0, 132, 255)" />
            </div>
          )}
        </div>
        {error && (
          <span className="animate-slide-in undefined m-0 block whitespace-normal pt-3 font-sans text-xs font-normal text-red-500">
            {error.name}: {error.message}
          </span>
        )}
      </>
    )
  },
)
