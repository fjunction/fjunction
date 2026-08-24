// components/site/ProcessSteps.tsx
import { Search, Share2, Filter, CheckCircle2, type LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = { search: Search, share: Share2, filter: Filter, check: CheckCircle2 }

type Step = {
  id: string
  step_number: string
  icon_key: string
  title: string
  description: string | null
  widget_type: 'status' | 'pattern' | 'bars' | 'none'
  widget_label: string | null
  widget_items: string | null
}

function Widget({ step }: { step: Step }) {
  if (step.widget_type === 'status') {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-md border border-neutral-700 px-3 py-2 text-xs text-neutral-400">
        <span className="h-3 w-3 rounded-full border border-neutral-600" />
        {step.widget_label}
      </div>
    )
  }
  if (step.widget_type === 'pattern') {
    return (
      <div className="mt-4 flex h-24 items-center justify-center rounded-md bg-neutral-800">
        <span className="rounded bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-300 shadow-sm">{step.widget_label}</span>
      </div>
    )
  }
  if (step.widget_type === 'bars') {
    const items = (step.widget_items ?? '').split('\n').filter(Boolean)
    const weights = ['100%', '55%', '20%']
    return (
      <div className="mt-4 space-y-2">
        {items.map((label, i) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <span className="text-xs text-neutral-400">{label}</span>
            <div className="h-1.5 max-w-[120px] flex-1 rounded-full bg-neutral-800">
              <div className={`h-1.5 rounded-full ${i === 0 ? 'bg-orange-500' : 'bg-neutral-600'}`} style={{ width: weights[i] ?? '20%' }} />
            </div>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function ProcessSteps({ steps }: { steps: Step[] }) {
  return (
    <section className="bg-neutral-950 py-20">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 md:grid-cols-2">
        {steps.map((step, index) => {
          const Icon = ICON_MAP[step.icon_key] ?? Search
          return (
            <div key={step.id} className={`relative rounded-xl border border-neutral-800 bg-neutral-900 p-8 ${index % 2 === 1 ? 'md:mt-16' : ''}`}>
              <span className="absolute left-0 top-0 rounded-br-lg rounded-tl-xl bg-orange-500 px-2.5 py-1 text-xs font-semibold text-white">
                {step.step_number}
              </span>
              <div className="mt-2 flex items-center gap-2">
                <Icon className="h-5 w-5 text-orange-500" />
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
              </div>
              {step.description && <p className="mt-3 text-sm text-neutral-400">{step.description}</p>}
              <Widget step={step} />
            </div>
          )
        })}
      </div>
    </section>
  )
}