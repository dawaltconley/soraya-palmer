import React, { useState, useEffect, useRef } from 'react'
import type { Media } from 'tinacms'
import { ImageUpload, useCMS } from 'tinacms'

interface ControlledImageUploadProps {
  src?: string
  clearable?: boolean
  onChange?: (src: string) => void
}

export default function ControlledImageUpload({
  src,
  onChange = () => {},
}: ControlledImageUploadProps) {
  const cms = useCMS()

  return (
    <ImageUpload
      src={src}
      value={src}
      onDrop={async (files, fileRejections) => {
        console.log({ files, fileRejections })
      }}
    />
  )
}

export function Test({
  src,
  clearable = true,
  onChange: onChangeHandler = () => {},
}: ControlledImageUploadProps) {
  const ref = React.useRef(null)
  const cms = useCMS()
  const [isImgUploading, setIsImgUploading] = useState(false)
  let onClear: any
  if (clearable) {
    onClear = () => onChangeHandler('')
  }

  async function onChange(media?: Media | Media[]) {
    if (media) {
      const parsedValue =
        // @ts-ignore
        typeof cms?.media?.store?.parse === 'function'
          ? // @ts-ignore
            cms.media.store.parse(media)
          : media

      onChangeHandler(parsedValue)
    }
  }
  const uploadDir = props.field.uploadDir || (() => '')

  return (
    <ImageUpload
      ref={ref}
      value={src}
      src={src}
      loading={isImgUploading}
      onClick={() => {
        const directory = uploadDir(props.form.getState().values)
        cms.media.open({
          allowDelete: true,
          directory,
          onSelect: onChange,
        })
      }}
      onDrop={async ([file]: File[], fileRejections) => {
        setIsImgUploading(true)
        try {
          if (file) {
            const directory = uploadDir(props.form.getState().values)
            const [media] = await cms.media.persist([
              {
                directory: directory,
                file,
              },
            ])
            if (media) {
              await onChange(media)
            }
          }

          // Codes here https://github.com/react-dropzone/react-dropzone/blob/c36ab5bd8b8fd74e2074290d80e3ecb93d26b014/typings/react-dropzone.d.ts#LL13-L18C2
          const errorCodes = {
            'file-invalid-type': 'Invalid file type',
            'file-too-large': 'File too large',
            'file-too-small': 'File too small',
            'too-many-files': 'Too many files',
          }

          const printError = (error: FileError) => {
            const message = errorCodes[error.code]
            if (message) {
              return message
            }
            console.error(error)
            return 'Unknown error'
          }

          // Upload Failed
          if (fileRejections.length > 0) {
            const messages = []
            fileRejections.map((fileRejection) => {
              messages.push(
                `${fileRejection.file.name}: ${fileRejection.errors
                  .map((error) => printError(error))
                  .join(', ')}`,
              )
            })
            // @ts-ignore
            cms.alerts.error(() => {
              return (
                <>
                  Upload Failed. <br />
                  {messages.join('. ')}.
                </>
              )
            })
          }
        } catch (error) {
          console.error('Error uploading media asset: ', error)
        } finally {
          setIsImgUploading(false)
        }
      }}
      onClear={onClear}
    />
  )
}
