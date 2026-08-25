// components/site/ProgramHero.tsx
import Link from 'next/link'

type Fact = { label: string; value: string }

export function ProgramHero({
  badgeText, heading, subheading, facts, primaryCtaText, primaryCtaHref, secondaryCtaText, secondaryCtaHref,
}: {
  badgeText?: string | null; heading: string; subheading?: string | null; facts?: Fact[]
  primaryCtaText?: string | null; primaryCtaHref?: string | null; secondaryCtaText?: string | null; secondaryCtaHref?: string | null
}) {
  return (
    <section className="relative overflow-hidden bg-neutral-950 py-20">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(to right, #f97316 1px, transparent 1px), linear-gradient(to bottom, #f97316 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="relative mx-auto max-w-3xl px-6">
        {badgeText && <span className="text-xs font-semibold uppercase tracking-wide text-orange-500">{badgeText}</span>}
        <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">{heading}</h1>
        {subheading && <p className="mt-5 max-w-xl text-base text-neutral-400">{subheading}</p>}
        {facts && facts.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-6 border-t border-neutral-800 pt-6">
            {facts.map((fact) => (
              <div key={fact.label}>
                <p className="text-xs uppercase tracking-wide text-neutral-500">{fact.label}</p>
                <p className="mt-1 text-sm font-semibold text-white">{fact.value}</p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {primaryCtaText && primaryCtaHref && <Link href={primaryCtaHref} className="rounded-full bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-600">{primaryCtaText}</Link>}
          {secondaryCtaText && secondaryCtaHref && <Link href={secondaryCtaHref} className="rounded-full border border-neutral-700 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-900">{secondaryCtaText}</Link>}
        </div>
      </div>
    </section>
  )
}