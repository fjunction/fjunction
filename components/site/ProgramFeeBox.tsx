// components/site/ProgramFeeBox.tsx
import { LegalBody } from './legal-body'

export function ProgramFeeBox({ feeText, includesBody, timelineText }: { feeText?: string | null; includesBody?: string | null; timelineText?: string | null }) {
  return (
    <section className="bg-neutral-950 px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-xl border border-orange-500/30 bg-neutral-900 p-8 text-center">
        {feeText && <p className="text-3xl font-bold text-white">{feeText}</p>}
        {includesBody && <div className="mt-4 text-left"><LegalBody text={includesBody} /></div>}
        {timelineText && <p className="mt-4 text-xs uppercase tracking-wide text-neutral-500">Typical completion time: {timelineText}</p>}
      </div>
    </section>
  )
}