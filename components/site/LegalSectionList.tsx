// components/site/LegalSectionList.tsx  (Privacy Policy — left-border list style)
import { LegalBody } from './legal-body'

type Section = { id: string; number: string; title: string; body_text: string | null }

export function LegalSectionList({ sections }: { sections: Section[] }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-4">
      {sections.map((section) => (
        <div key={section.id} className="border-l-2 border-gray-100 py-8 pl-6">
          <h2 className="flex items-baseline gap-2 text-2xl font-bold text-gray-900">
            <span className="text-xs font-semibold text-orange-600">{section.number}</span>
            {section.title}
          </h2>
          <div className="mt-4">
            <LegalBody text={section.body_text ?? ''} />
          </div>
        </div>
      ))}
    </div>
  )
}