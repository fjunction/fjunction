// components/site/Framework.tsx
import { CheckCircle2 } from 'lucide-react'

type FrameworkStep = {
  id: string
  step_number: string
  title: string
  description: string | null
  checklist_items: string[]
}

export function Framework({
  eyebrowText,
  heading,
  subheading,
  steps,
}: {
  eyebrowText: string
  heading: string
  subheading?: string | null
  steps: FrameworkStep[]
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <span className="text-xs font-semibold uppercase tracking-wide text-orange-600">
        {eyebrowText}
      </span>
      <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">{heading}</h2>
      {subheading && <p className="mt-3 max-w-2xl text-sm text-gray-500">{subheading}</p>}

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {steps.map((step) => (
          <div key={step.id} className="relative overflow-hidden rounded-xl bg-gray-50 p-8">
            <span className="pointer-events-none absolute -right-2 -top-4 text-8xl font-bold text-gray-200">
              {step.step_number}
            </span>
            <div className="relative">
              <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
              {step.description && (
                <p className="mt-2 max-w-sm text-sm text-gray-500">{step.description}</p>
              )}
              <ul className="mt-5 space-y-2">
                {step.checklist_items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-orange-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}