// components/site/LegalSectionCards.tsx  (Terms of Service — white card style)
import { LegalBody } from './legal-body'

type Section = { id: string; number: string; title: string; body_text: string | null }

export function LegalSectionCards({ sections }: { sections: Section[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      {sections.map((section) => (
        <div key={section.id} className="rounded-xl border border-gray-100 bg-white p-8">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-600">{section.number}</span>
            <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
          </div>
          <hr className="my-4 border-gray-100" />
          <LegalBody text={section.body_text ?? ''} />
        </div>
      ))}
    </div>
  )
}