import { useRef } from 'react'
import { useForm } from '@browser/forms'
import Spinner from './Spinner'

interface EmailSignUpContent {
  title: string
  description?: string | null
}

interface EmailSignUpProps {
  initial: EmailSignUpContent
  error: EmailSignUpContent
  success: EmailSignUpContent
}

const content: EmailSignUpProps = {
  initial: {
    title: 'Join my mailing list',
    description: 'Sign up to receive updates when I’m doing an event near you.',
  },
  error: {
    title: 'Something went wrong',
    description: null,
  },
  success: {
    title: 'Success!',
    description: 'You are now subscribed.',
  },
}

export default function EmailSignUp() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { status, errorMessage, handleSubmit } = useForm({
    requiredFields: ['email'],
  })

  const contentStatus: keyof EmailSignUpProps =
    status === 'submitting' ? 'initial' : status
  const title = content[contentStatus].title
  const description = content[contentStatus].description

  const lockHeight = () => {
    const container = containerRef.current
    if (!container) return
    container.style.minHeight = `${container.clientHeight.toString()}px`
  }

  return (
    <div ref={containerRef} className="mx-auto w-auto space-y-4 text-center">
      <h2 className="font-display text-3xl font-bold capitalize">{title}</h2>
      {status === 'error' && errorMessage && (
        <pre className="my-2 inline-block border border-gray-900 bg-white px-4 py-2 text-sm text-red-900 drop-shadow">
          {errorMessage}
        </pre>
      )}
      {description && <p className="font-serif">{description}</p>}
      {status !== 'success' && (
        <form
          className="mx-auto flex max-w-xl text-lg"
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
