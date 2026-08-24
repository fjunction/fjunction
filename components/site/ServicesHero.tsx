// components/site/ServicesHero.tsx
import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle } from 'lucide-react'

export function ServicesHero({
  eyebrowText,
  heading,
  subheading,
  photoUrl,
  primaryCtaText,
  primaryCtaHref,
  secondaryCtaText,
  secondaryCtaHref,
}: {
  eyebrowText: string
  heading: string
  subheading?: string | null
  photoUrl?: string | null
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
      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-orange-500">{eyebrowText}</span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">{heading}</h1>
          {subheading && <p className="mt-5 max-w-md text-base text-neutral-400">{subheading}</p>}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {primaryCtaText && primaryCtaHref && (
              <Link href={primaryCtaHref} className="rounded-full bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-600">
                {primaryCtaText}
              </Link>
            )}
            {secondaryCtaText && secondaryCtaHref && (
              <Link href={secondaryCtaHref} className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-900">
                <MessageCircle className="h-4 w-4" />
                {secondaryCtaText}
              </Link>
            )}
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-neutral-800">
          {photoUrl ? (
            <Image src={photoUrl} alt={heading} fill className="object-cover" />
          ) : (
            <div className="h-full w-full bg-neutral-900" />
          )}
        </div>
      </div>
    </section>
  )
}