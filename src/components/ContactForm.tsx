import type { FunctionComponent, ReactNode } from 'react'
import type { FormStatus, FormGetProps, FormPostProps } from '@browser/forms'
import { useEffect, useRef } from 'react'
import { useForm, restoreForm } from '@browser/forms'
import clsx from 'clsx'
import Spinner from './Spinner'

const requiredFields = ['name', 'email', 'subject', 'message'] as const

export default function ContactForm({
  action,
  method = 'GET',
  encType = 'application/x-www-form-urlencoded',
}: FormGetProps | FormPostProps): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const { status, data, errorMessage, handleSubmit } = useForm({
    action,
    method,
    encType,
    requiredFields,
  })

  const showForm = status !== 'success'

  useEffect(() => {
    const form = formRef.current
    if (form && showForm) restoreForm(form, data)
  }, [showForm])

  return (
    <div ref={containerRef} className="text-center">
      <FormMessage status={status} errorMessage={errorMessage} />
      {showForm && (
        <form
          ref={formRef}
          className="contact-form mx-auto mt-8 w-full max-w-xl grid-cols-2 text-lg @container/contact-form"
          method={method.toLowerCase()}
          encType={encType}
          action={action.toString()}
          onSubmit={(e) => {
            const container = containerRef.current
            if (container) {
              container.style.minHeight = `${container.clientHeight.toString()}px`
            }
            handleSubmit(e)
          }}
        >
          <label htmlFor="contact-name" className="form-label @md:col-span-1">
            <span className="form-label__text">Name</span>
            <input
              id="contact-name"
              name="name"
              type="text"
              className="form-field w-full"
              autoComplete="name"
              disabled={status === 'submitting'}
              required
            />
          </label>
          <label htmlFor="contact-email" className="form-label @md:col-span-1">
            <span className="form-label__text">Email</span>
            <input
              id="contact-email"
              name="email"
              type="email"
              className="form-field w-full"
              autoComplete="email"
              disabled={status === 'submitting'}
              required
            />
          </label>
          <label htmlFor="contact-subject" className="form-label">
            <span className="form-label__text">Subject</span>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              className="form-field w-full"
              disabled={status === 'submitting'}
              required
            />
          </label>
          <label htmlFor="contact-fax" className="form-label special-input">
            <span className="form-label__text">Fax number</span>
            <input
              id="contact-fax"
              name="fax_number"
              className="form-field w-full"
              disabled={status === 'submitting'}
              tabIndex={-1}
              autoComplete="off"
            ></input>
          </label>
          <label htmlFor="contact-message" className="form-label">
            <span className="form-label__text">Message</span>
            <textarea
              id="contact-message"
              name="message"
              className="form-field min-h-[12rem] w-full"
              disabled={status === 'submitting'}
              required
            ></textarea>
          </label>
          <button
            type="submit"
            className="form-button col-span-2 text-base @lg:text-lg"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? (
              <>
                <Spinner /> Sending
              </>
            ) : (
              'Send'
            )}
          </button>
        </form>
      )}
    </div>
  )
}

interface FormMessageProps {
  status: FormStatus
  errorMessage?: string
}

const FormMessage: FunctionComponent<FormMessageProps> = ({
  status,
  errorMessage,
}) => {
  const title: Record<typeof status, string | JSX.Element> = {
    initial: 'Contact me',
    submitting: 'Contact me',
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
      <h2
        className={clsx('mb-4 text-center font-display text-3xl font-bold', {
          capitalize: status !== 'error',
        })}
      >
        {title[status]}
      </h2>
      {message && (
        <div
          className={clsx('font-serif font-medium', {
            'min-h-[6rem]': status === 'submitting' || status === 'success',
          })}
        >
          {message}
        </div>
      )}
    </>
  )
}

const ErrorMessage: FunctionComponent<{ message?: string }> = ({ message }) =>
  message && (
    <pre className="my-2 inline-block border border-gray-900 bg-white px-4 py-2 text-sm text-red-900 drop-shadow">
      {message}
    </pre>
  )

const SuccessMessage = () => (
  <p>I've received your message and will be in touch soon.</p>
)
