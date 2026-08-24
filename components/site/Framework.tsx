// components/site/Framework.tsx
import { Search, Share2, Filter, CheckCircle2, type LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = { search: Search, share: Share2, filter: Filter, check: CheckCircle2 }

type Step = { id: string; step_number: string; icon_key: string; title: string; description: string | null }

export function Framework({
  eyebrowText, heading, subheading, steps,
}: { eyebrowText: string; heading: string; subheading?: string | null; steps: Step[] }) {
  return (
    <section className="bg-neutral-950 py-20">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <span className="text-xs font-semibold uppercase tracking-wide text-orange-500">{eyebrowText}</span>
        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{heading}</h2>
        {subheading && <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-400">{subheading}</p>}
        <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {steps.map((step) => {
            const Icon = ICON_MAP[step.icon_key] ?? Search
            return (
              <div key={step.id}>
                <span className="block text-xs font-semibold text-neutral-600">{step.step_number}</span>
                <span className="mt-2 inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900">
                  <Icon className="h-5 w-5 text-orange-500" />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-white">{step.title}</h3>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}