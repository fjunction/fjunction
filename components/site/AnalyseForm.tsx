// components/site/AnalyseForm.tsx
'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import ReCAPTCHA from 'react-google-recaptcha'
import { submitHealthAssessment } from '@/lib/actions/health-assessment-actions'

const OBJECTIVES = [
  { key: 'gut_health', title: 'Optimise Gut Health', description: 'Address bloating, reflux, or irregular digestion.' },
  { key: 'metabolic_weight', title: 'Metabolic & Weight Strategy', description: 'Insulin resistance, stubborn fat, or energy crashes.' },
  { key: 'hormonal_balance', title: 'Hormonal Balance', description: 'Testosterone concerns, poor recovery, or libido issues.' },
  { key: 'blood_report_translation', title: 'Blood Report Translation', description: 'Understand what "normal" reports are missing.' },
]

const SYMPTOMS = [
  { key: 'symptom_fatigue', label: 'Persistent Fatigue / Low Energy' },
  { key: 'symptom_brain_fog', label: 'Brain Fog / Lack of Focus' },
  { key: 'symptom_digestive', label: 'Digestive Discomfort (Bloating, Gas)' },
]

const FREQUENCIES = ['rarely', 'sometimes', 'often']

export function AnalyseForm() {
  const [objectives, setObjectives] = useState<string[]>([])
  const [symptoms, setSymptoms] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const captchaRef = useRef<ReCAPTCHA>(null)

  function toggleObjective(key: string) {
    setObjectives((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const token = captchaRef.current?.getValue()
    if (!token) { setErrorMessage('Please complete the captcha.'); return }
    if (SYMPTOMS.some((s) => !symptoms[s.key])) { setErrorMessage('Please answer all symptom questions.'); return }

    const formData = new FormData(e.currentTarget)
    formData.set('captcha_token', token)
    objectives.forEach((key) => formData.append('primary_objectives', key))
    Object.entries(symptoms).forEach(([key, value]) => formData.set(key, value))

    setSubmitting(true)
    setErrorMessage('')
    const result = await submitHealthAssessment(formData)
    setSubmitting(false)

    if (result.success) setSubmitted(true)
    else { setErrorMessage(result.error ?? 'Something went wrong. Please try again.'); captchaRef.current?.reset() }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl bg-neutral-950 px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-white">Thanks — we've got your details.</h2>
        <p className="mt-3 text-sm text-neutral-400">Our team will review your assessment and get back to you shortly.</p>
        <Link href="/services" className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-600">
          Explore Services →
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-12 bg-neutral-950 px-6 py-10">
      <section>
        <h2 className="text-xl font-bold text-white">01. Personal Data</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-300">Full Name</span>
            <input name="name" required placeholder="e.g. John Doe" className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-300">Age</span>
            <input name="age" type="number" min={1} placeholder="Years" className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-300">Email Address</span>
            <input name="email" type="email" required placeholder="john@example.com" className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-300">Phone / WhatsApp</span>
            <input name="phone" placeholder="+91 00000 00000" className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500" />
          </label>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white">02. Primary Objective</h2>
        <p className="mt-1 text-sm text-neutral-400">Select the main areas you wish to investigate and improve.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {OBJECTIVES.map((objective) => (
            <label key={objective.key} className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
              <input type="checkbox" checked={objectives.includes(objective.key)} onChange={() => toggleObjective(objective.key)} className="mt-1" />
              <span>
                <span className="block text-sm font-semibold text-white">{objective.title}</span>
                <span className="mt-0.5 block text-xs text-neutral-400">{objective.description}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white">03. Symptom Mapping</h2>
          <span className="rounded bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-400">Required</span>
        </div>
        <p className="mt-1 text-sm text-neutral-400">Indicate the frequency of the following symptoms over the last 30 days.</p>
        <div className="mt-5 space-y-4">
          {SYMPTOMS.map((symptom) => (
            <div key={symptom.key} className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <span className="text-sm text-neutral-300">{symptom.label}</span>
              <div className="flex gap-4">
                {FREQUENCIES.map((freq) => (
                  <label key={freq} className="flex items-center gap-1.5 text-sm capitalize text-neutral-400">
                    <input type="radio" name={symptom.key} required checked={symptoms[symptom.key] === freq} onChange={() => setSymptoms((prev) => ({ ...prev, [symptom.key]: freq }))} />
                    {freq}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white">04. Existing Data</h2>
        <p className="mt-1 text-sm text-neutral-400">If you have recent blood work (within 3–6 months), please summarise key markers or note anything your physician flagged.</p>
        <textarea
          name="existing_data_notes"
          rows={4}
          placeholder={`E.g., High HbA1c, low Vitamin D, elevated liver enzymes, or 'reports normal but still feel tired...'`}
          className="mt-4 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500"
        />
      </section>

      <div className="flex justify-center">
        <ReCAPTCHA ref={captchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} theme="dark" />
      </div>

      {errorMessage && <p className="text-center text-sm text-red-400">{errorMessage}</p>}

      <div className="text-center">
        <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60">
          {submitting ? 'Submitting…' : 'Submit Assessment'}
          {!submitting && <span>→</span>}
        </button>
        <p className="mt-3 text-xs text-neutral-500">By submitting, you agree to our data handling practices. Information is strictly confidential.</p>
      </div>
    </form>
  )
}