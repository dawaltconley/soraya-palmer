import type { FormEvent } from 'react'
import { useState, useRef } from 'react'

export const copyFormData = (data: FormData): FormData => {
  const copy = new FormData()
  for (const [key, value] of data.entries()) {
    copy.append(key, value)
  }
  return copy
}

export const formDataToSearchParams = (formData: FormData): URLSearchParams => {
  const formEntries = Array.from(formData, ([key, value]) => [
    key,
    typeof value === 'string' ? value : value.name,
  ])
  return new URLSearchParams(formEntries)
}

export interface SubmitFormOps {
  action: string | URL
  method?: 'GET' | 'POST'
  encType?: 'application/x-www-form-urlencoded' | 'multipart/form-data'
}

export const submitForm = (
  data: FormData,
  {
    action,
    method = 'GET',
    encType = 'application/x-www-form-urlencoded',
  }: SubmitFormOps,
): Promise<Response> => {
  const target = new URL(action)
  const opts: RequestInit = { method, redirect: 'follow' }
  const dataCopy = copyFormData(data)
  const subject = dataCopy.get('subject')
  if (subject) dataCopy.set('subject', `[${window.location.host}] ${subject}`)

  if (method === 'GET') {
    if (encType === 'multipart/form-data')
      throw new Error(
        'Unupported: GET method with multipart/form-data encoding',
      )
    target.search = formDataToSearchParams(dataCopy).toString()
  } else if (method === 'POST') {
    opts.body =
      encType === 'application/x-www-form-urlencoded'
        ? formDataToSearchParams(dataCopy)
        : dataCopy
  } else {
    throw new Error(`Invalid ${method} request method`)
  }

  return fetch(target, opts)
}

export const restoreForm = (form: HTMLFormElement, data: FormData): void => {
  for (const [name, value] of data.entries()) {
    const field = form.querySelector(`[name=${name}]`)
    if (field && 'value' in field) field.value = value
  }
}

export interface FormProps {
  action: string | URL
  method?: 'GET' | 'POST'
  encType?: 'application/x-www-form-urlencoded' | 'multipart/form-data'
  requiredFields?: readonly string[]
}

export interface FormGetProps extends FormProps {
  method?: 'GET'
  encType?: 'application/x-www-form-urlencoded'
}

export interface FormPostProps extends FormProps {
  method: 'POST'
}

export type FormStatus = 'initial' | 'submitting' | 'error' | 'success'

export const useForm = ({
  action,
  method = 'GET',
  encType = 'application/x-www-form-urlencoded',
  requiredFields = [],
}: FormProps) => {
  if (method === 'GET' && encType === 'multipart/form-data') {
    throw new Error('Unupported: GET method with multipart/form-data encoding')
  }

  const formData = useRef(new FormData())
  const [status, setStatus] = useState<FormStatus>('initial')
  const [errorMessage, setErrorMessage] = useState<string>()

  const isValid = (data: FormData): boolean =>
    requiredFields.every((field) => data.get(field))

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    const data = new FormData(e.currentTarget)
    if (!isValid(data)) {
      return handleError('Missing required fields in contact form')
    }
    formData.current = data

    setStatus('submitting')
    await new Promise((resolve) => window.setTimeout(resolve, 2000))

    try {
      const response = await submitForm(data, { action, method, encType })
      if (response.status >= 400) {
        const body = await response.json()
        console.error(body)
        if ('message' in body && typeof body.message === 'string') {
          return handleError(`${response.status}: ${body.message}`)
        }
        return handleError(`Status code ${response.status}`)
      }
      return setStatus('success')
    } catch (e) {
      // NetworkError when attempting to fetch resource (bad CORS)
      console.error(e)
      return e instanceof Error
        ? handleError(`${e.name}: ${e.message}`)
        : handleError()
    }
  }

  const handleError = (message?: string): void => {
    setErrorMessage(message)
    setStatus('error')
  }

  return {
    status,
    data: formData.current,
    errorMessage,
    handleSubmit,
    handleError,
  }
}
