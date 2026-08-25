// components/site/ProgramChecklist.tsx
import { CheckCircle2 } from 'lucide-react'

export function ProgramChecklist({ heading, items }: { heading?: string | null; items: { id: string; text: string }[] }) {
  return (
    <section className="bg-neutral-950 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        {heading && <h2 className="text-2xl font-bold text-white">{heading}</h2>}
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-2 text-sm text-neutral-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}