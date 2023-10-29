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
