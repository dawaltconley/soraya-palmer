import type { FormContent } from '@browser/forms'
import { useRef } from 'react'
import { useForm, useFormContentChange, getContent } from '@browser/forms'
import Spinner from './Spinner'
import ErrorMessage from './ErrorMessage'

interface EmailSignUpProps {
  content: FormContent
}

export default function EmailSignUp({ content }: EmailSignUpProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const {
    status: formStatus,
    errorMessage,
    handleSubmit,
  } = useForm({
    requiredFields: ['email'],
  })
  const status = useFormContentChange(content) || formStatus

  const lockHeight = () => {
    const container = containerRef.current
    if (!container) return
    container.style.minHeight = `${container.clientHeight.toString()}px`
  }

  const { description } = getContent(content, status)

  return (
    <div ref={containerRef} className="mx-auto w-auto text-center">
      <h2 className="heading-2 mb-4">{getContent(content, status).title}</h2>
      {status === 'error' && errorMessage && (
        <ErrorMessage message={errorMessage} />
      )}
      {description && <p className="mt-2 font-serif">{description}</p>}
      {status !== 'success' && (
        <form
          className="mx-auto mt-4 flex max-w-xl text-lg"
          method="post"
          action="https://script.google.com/macros/s/AKfycbzQdHSp2CwiRcTcOMo7vn4jn74DnrG6f_k8-QAupvoGxyKDEkBLJjkt4P5_x9eZaiv4xA/exec"
          onSubmit={(e) => {
            lockHeight()
            handleSubmit(e)
          }}
        >
          <label htmlFor="sign-up-email" className="sr-only">
            Email
          </label>
          <input
            id="sign-up-email"
            name="email"
            type="email"
            placeholder="Enter your email"
            className="form-field w-full border-r-0"
            autoComplete="email"
            disabled={status === 'submitting'}
            required
          />
          <label htmlFor="sign-up-fax" className="form-label special-input">
            Fax Number
          </label>
          <input
            id="sign-up-fax"
            name="fax_number"
            className="form-field special-input w-full"
            tabIndex={-1}
            autoComplete="off"
            disabled={status === 'submitting'}
          />
          <button
            type="submit"
            className="form-button w-28"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? (
              <Spinner className="fa-inline" />
            ) : (
              'Sign up'
            )}
          </button>
        </form>
      )}
    </div>
  )
}
