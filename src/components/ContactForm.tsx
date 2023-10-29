import type {
  FunctionComponent,
  ReactNode,
  FormEvent,
  ComponentPropsWithoutRef,
} from 'react'
import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import Spinner from './Spinner'

type ContactFormStatus = 'initial' | 'submitting' | 'error' | 'success'

const requiredFields = ['name', 'email', 'subject', 'message'] as const

const isValid = (data: FormData): boolean =>
  requiredFields.every((field) => data.get(field))

const copyFormData = (data: FormData): FormData => {
  const copy = new FormData()
  for (const [key, value] of data.entries()) {
    copy.append(key, value)
  }
  return copy
}

const formDataToSearchParams = (formData: FormData): URLSearchParams => {
  const formEntries = Array.from(formData, ([key, value]) => [
    key,
    typeof value === 'string' ? value : value.name,
  ])
  return new URLSearchParams(formEntries)
}

interface SubmitFormOps {
  action: string | URL
  method?: 'GET' | 'POST'
  encType?: 'application/x-www-form-urlencoded' | 'multipart/form-data'
}

const submitForm = (
  data: FormData,
  { action, method, encType }: Required<SubmitFormOps>,
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

interface ContactFormProps {
  action: string | URL
  method?: 'GET' | 'POST'
  encType?: 'application/x-www-form-urlencoded' | 'multipart/form-data'
}

interface ContactFormGetProps extends ContactFormProps {
  method?: 'GET'
  encType?: 'application/x-www-form-urlencoded'
}

interface ContactFormPostProps extends ContactFormProps {
  method: 'POST'
}

export default function ContactForm({
  action,
  method = 'GET',
  encType = 'application/x-www-form-urlencoded',
}: ContactFormGetProps | ContactFormPostProps): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const formData = useRef<FormData>()

  const [status, setStatus] = useState<ContactFormStatus>('initial')
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    const container = containerRef.current
    const form = formRef.current
    if (!container || !form) return

    container.style.minHeight = `${container.clientHeight.toString()}px`
    setStatus('submitting')

    const data = new FormData(form)
    if (!isValid(data)) {
      return handleError('Missing required fields in contact form')
    }
    formData.current = data

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

  const restoreForm = (form: HTMLFormElement, data: FormData): void => {
    for (const [name, value] of data.entries()) {
      const field = form.querySelector(`[name=${name}]`)
      if (field && 'value' in field) field.value = value
    }
  }

  const showForm = status !== 'success'

  useEffect(() => {
    const form = formRef.current
    const data = formData.current
    if (form && data && showForm) restoreForm(form, data)
  }, [showForm])

  return (
    <div ref={containerRef} className="text-center">
      <FormMessage status={status} errorMessage={errorMessage} />
      {showForm && (
        <form
          ref={formRef}
          className="contact-form mx-auto mt-8 w-full max-w-xl grid-cols-2 text-lg"
          method={method.toLowerCase()}
          encType={encType}
          action={action.toString()}
          onSubmit={handleSubmit}
        >
          <label htmlFor="contact-name" className="form-label sm:col-span-1">
            <span className="form-label__text">Name</span>
            <input
              id="contact-name"
              name="name"
              type="text"
              className="form-field w-full"
              autoComplete="name"
            />
          </label>
          <label htmlFor="contact-email" className="form-label sm:col-span-1">
            <span className="form-label__text">Email</span>
            <input
              id="contact-email"
              name="email"
              type="email"
              className="form-field w-full"
              autoComplete="email"
            />
          </label>
          <label htmlFor="contact-subject" className="form-label">
            <span className="form-label__text">Subject</span>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              className="form-field w-full"
            />
          </label>
          <label htmlFor="contact-message" className="form-label">
            <span className="form-label__text">Message</span>
            <textarea
              id="contact-message"
              name="message"
              className="form-field min-h-[12rem] w-full"
            ></textarea>
          </label>
          <button type="submit" className="form-button col-span-2">
            {status === 'submitting' ? <Spinner /> : 'Send'}
          </button>
        </form>
      )}
    </div>
  )
}

// type LabeledInputProps<T extends 'input' | 'textarea' = 'input' | 'textarea'> =
//   {
//     id: string
//     label: string
//   } & ComponentPropsWithoutRef<T>
//
// const LabeledInput = ({
//   id,
//   label,
//   className,
//   ...props
// }: LabeledInputProps<'input'>) => (
//   <label htmlFor={id} className={clsx('form-label', className)}>
//     <span className="form-label__text">{label}</span>
//     <input id={id} className="form-field w-full" {...props} />
//   </label>
// )
//
// const LabeledTextArea = ({
//   id,
//   label,
//   className,
//   ...props
// }: LabeledInputProps<'textarea'>) => (
//   <label htmlFor={id} className={clsx('form-label', className)}>
//     <span className="form-label__text">{label}</span>
//     <textarea id={id} className="form-field min-h-[12rem] w-full" {...props} />
//   </label>
// )

interface FormMessageProps {
  status: ContactFormStatus
  errorMessage?: string
}

const FormMessage: FunctionComponent<FormMessageProps> = ({
  status,
  errorMessage,
}) => {
  const title: Record<typeof status, string | JSX.Element> = {
    initial: 'Contact me',
    submitting: 'Sending...',
    error: 'Something went wrong',
    success: 'Thank you!',
  }

  let message: ReactNode = null
  if (status === 'error') {
    message = <ErrorMessage message={errorMessage} />
  } else if (status === 'success') {
    message = <SuccessMessage />
  }

  return (
    <>
      <h2 className="mb-4 text-center font-display text-3xl font-bold capitalize">
        {title[status]}
      </h2>
      <div
        className={clsx('font-serif font-medium', {
          'min-h-[6rem]': status === 'submitting' || status === 'success',
        })}
      >
        {message}
      </div>
    </>
  )
}

const InitialMessage = () => null

const SendingMessage = () => <Spinner className="text-6xl" />

const ErrorMessage: FunctionComponent<{ message?: string }> = ({ message }) =>
  message && (
    <pre className="my-2 inline-block border border-gray-900 bg-white px-4 py-2 text-sm text-red-900 drop-shadow">
      {message}
    </pre>
  )

const SuccessMessage = () => (
  <>
    <p>Thank you for contacting me.</p>
    <p>I'll be in touch soon.</p>
  </>
)
