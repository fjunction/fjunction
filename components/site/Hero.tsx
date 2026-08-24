// components/site/Hero.tsx
import Link from 'next/link'
import Image from 'next/image'

export function Hero({
  tagLine, heading, subheading, disclaimerText, photoUrl, consultationNoteText,
  primaryCtaText, primaryCtaHref, secondaryCtaText, secondaryCtaHref,
}: {
  tagLine?: string | null
  heading: string
  subheading?: string | null
  disclaimerText?: string | null
  photoUrl?: string | null
  consultationNoteText?: string | null
  primaryCtaText?: string | null
  primaryCtaHref?: string | null
  secondaryCtaText?: string | null
  secondaryCtaHref?: string | null
}) {
  return (
    <section className="relative overflow-hidden bg-neutral-950 py-20">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(to right, #f97316 1px, transparent 1px), linear-gradient(to bottom, #f97316 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 md:items-center">
        <div>
          {tagLine && (
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-500">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              {tagLine}
            </span>
          )}
          <h1 className="mt-5 whitespace-pre-line text-4xl font-bold leading-tight text-white sm:text-5xl">{heading}</h1>
          {subheading && <p className="mt-6 max-w-lg text-base text-neutral-400">{subheading}</p>}
          {disclaimerText && <p className="mt-4 max-w-lg text-xs text-neutral-500">{disclaimerText}</p>}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {primaryCtaText && primaryCtaHref && (
              <Link href={primaryCtaHref} className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-600">
                {primaryCtaText}
                <span>→</span>
              </Link>
            )}
            {secondaryCtaText && secondaryCtaHref && (
              <Link href={secondaryCtaHref} className="rounded-full border border-neutral-700 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-900">
                {secondaryCtaText}
              </Link>
            )}
          </div>
          {consultationNoteText && <p className="mt-4 text-xs text-neutral-500">{consultationNoteText}</p>}
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-neutral-800">
          {photoUrl ? (
            <>
              <Image src={photoUrl} alt="" fill className="object-cover" />
              <span className="absolute right-4 top-4 rounded-md bg-black/70 px-2.5 py-1 text-xs font-medium text-orange-400">Analyzing…</span>
            </>
          ) : (
            <div className="h-full w-full bg-neutral-900" />
          )}
        </div>
      </div>
    </section>
  )
}