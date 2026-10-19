// components/masterclass/RegisterProvider.tsx
'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { registerForMasterclass } from '@/lib/actions/masterclass-actions'

type RegisterContextValue = { open: () => void; registrationOpen: boolean }
const RegisterContext = createContext<RegisterContextValue | null>(null)

function loadCashfreeSdk(): Promise<any> {
  return new Promise((resolve, reject) => {
    const existing = (window as any).Cashfree
    if (existing) return resolve(existing)
    const script = document.createElement('script')
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
    script.onload = () => resolve((window as any).Cashfree)
    script.onerror = () => reject(new Error('Could not load the payment SDK.'))
    document.body.appendChild(script)
  })
}

export function RegisterProvider({
  masterclassId,
  title,
  registrationOpen,
  hasUsdPrice = false,
  children,
}: {
  masterclassId: string
  title: string
  registrationOpen: boolean
  hasUsdPrice?: boolean
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [doneMessage, setDoneMessage] = useState('')
  const captchaRef = useRef<ReCAPTCHA>(null)

  useEffect(() => {
    if (!isOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const token = captchaRef.current?.getValue()
    if (!token) {
      setErrorMessage('Please complete the captcha.')
      return
    }

    const formData = new FormData(e.currentTarget)
    formData.set('captcha_token', token)
    formData.set('masterclass_id', masterclassId)

    setSubmitting(true)
    setErrorMessage('')
    const result = await registerForMasterclass(formData)
    setSubmitting(false)

    if (!result.success) {
      setErrorMessage(result.error)
      captchaRef.current?.reset()
      return
    }

    if (result.kind === 'redirect') {
      setRedirecting(true)
      window.location.href = result.paymentUrl
      return
    }

    if (result.kind === 'checkout') {
      setRedirecting(true)
      try {
        const Cashfree = await loadCashfreeSdk()
        const cashfree = Cashfree({ mode: result.environment })
        await cashfree.checkout({ paymentSessionId: result.paymentSessionId, redirectTarget: '_self' })
      } catch (error) {
        console.error('[RegisterProvider] checkout failed:', error)
        setRedirecting(false)
        setErrorMessage('Could not open the payment page. Please try again.')
        captchaRef.current?.reset()
      }
      return
    }

    setDoneMessage(result.message)
  }

  return (
    <RegisterContext.Provider value={{ open: () => setIsOpen(true), registrationOpen }}>
      {children}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={() => setIsOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">Register</h2>
                <p className="mt-1 text-xs text-slate-400">{title}</p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close" className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {doneMessage ? (
              <p className="mt-6 text-sm text-slate-300">{doneMessage}</p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-300">Full name</span>
                  <input name="name" required className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-300">Email</span>
                  <input name="email" type="email" required className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-300">Phone / WhatsApp</span>
                  <input name="phone" required placeholder="+91 00000 00000" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500" />
                </label>

                {hasUsdPrice && (
                  <label className="block text-sm">
                    <span className="mb-1 block text-slate-300">Paying from</span>
                    <select name="region" defaultValue="india" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white">
                      <option value="india">India (INR)</option>
                      <option value="international">Outside India (USD)</option>
                    </select>
                  </label>
                )}

                <div className="flex justify-center">
                  <ReCAPTCHA ref={captchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} theme="dark" />
                </div>

                {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}

                <button
                  type="submit"
                  disabled={submitting || redirecting}
                  className="w-full rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-60"
                >
                  {redirecting ? 'Opening payment…' : submitting ? 'Saving…' : 'Continue to payment'}
                </button>
                <p className="text-center text-xs text-slate-500">Your details are kept confidential.</p>
              </form>
            )}
          </div>
        </div>
      )}
    </RegisterContext.Provider>
  )
}

export function RegisterButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ctx = useContext(RegisterContext)
  if (!ctx) return null

  if (!ctx.registrationOpen) {
    return <span className={`${className ?? ''} cursor-not-allowed opacity-60`}>Registration Closed</span>
  }

  return (
    <button type="button" onClick={ctx.open} className={className}>
      {children}
    </button>
  )
}