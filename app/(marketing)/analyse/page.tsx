// app/(marketing)/analyse/page.tsx
import { AnalyseForm } from '@/components/site/AnalyseForm'

export default function AnalysePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-neutral-950 py-16">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(to right, #f97316 1px, transparent 1px), linear-gradient(to bottom, #f97316 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative mx-auto max-w-2xl px-6">
          <span className="text-xs font-semibold uppercase tracking-wide text-orange-500">Stage 01 — Investigate</span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">Analyse My Health.</h1>
          <p className="mt-5 text-sm text-neutral-400">
            Before we design a strategy, we must understand the system. Please provide the details below to help construct a comprehensive map of your current physiological state, symptoms, and lifestyle factors.
          </p>
        </div>
      </section>

      <AnalyseForm />
    </>
  )
}