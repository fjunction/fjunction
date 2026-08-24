// app/(marketing)/analyse/page.tsx
import { AnalyseForm } from '@/components/site/AnalyseForm'

export default function AnalysePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gray-50 py-16">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative mx-auto max-w-2xl px-6">
          <span className="text-xs font-semibold uppercase tracking-wide text-orange-600">Stage 01 — Investigate</span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">Analyse My Health.</h1>
          <p className="mt-5 text-sm text-gray-500">
            Before we design a strategy, we must understand the system. Please provide the details below to help construct a comprehensive map of your current physiological state, symptoms, and lifestyle factors.
          </p>
        </div>
      </section>

      <AnalyseForm />
    </>
  )
}