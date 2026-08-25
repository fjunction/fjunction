// components/site/ProgramSteps.tsx
import { LegalBody } from './legal-body'

type Step = { id: string; step_number: string; title: string; duration_text: string | null; body_text: string | null }

export function ProgramSteps({ heading, steps }: { heading?: string | null; steps: Step[] }) {
  return (
    <section className="bg-neutral-950 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        {heading && <h2 className="text-2xl font-bold text-white">{heading}</h2>}
        <div className="mt-8 space-y-8">
          {steps.map((step) => (
            <div key={step.id} className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-orange-500/10 px-2 py-1 text-xs font-semibold text-orange-500">{step.step_number}</span>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                {step.duration_text && <span className="text-xs text-neutral-500">· {step.duration_text}</span>}
              </div>
              {step.body_text && <div className="mt-4"><LegalBody text={step.body_text} /></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}