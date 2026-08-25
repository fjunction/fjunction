// components/site/ProgramTextSection.tsx
import { LegalBody } from './legal-body'

export function ProgramTextSection({ heading, body }: { heading?: string | null; body?: string | null }) {
  if (!body) return null
  return (
    <section className="bg-neutral-950 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        {heading && <h2 className="text-2xl font-bold text-white">{heading}</h2>}
        <div className="mt-4"><LegalBody text={body} /></div>
      </div>
    </section>
  )
}