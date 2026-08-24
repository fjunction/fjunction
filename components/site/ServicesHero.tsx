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
    <section className="relative overflow-hidden bg-gray-50 py-20">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-orange-600">{eyebrowText}</span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">{heading}</h1>
          {subheading && <p className="mt-5 max-w-md text-base text-gray-500">{subheading}</p>}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {primaryCtaText && primaryCtaHref && (
              <Link href={primaryCtaHref} className="rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800">
                {primaryCtaText}
              </Link>
            )}
            {secondaryCtaText && secondaryCtaHref && (
              <Link href={secondaryCtaHref} className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50">
                <MessageCircle className="h-4 w-4" />
                {secondaryCtaText}
              </Link>
            )}
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          {photoUrl ? (
            <Image src={photoUrl} alt={heading} fill className="object-cover" />
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </div>
      </div>
    </section>
  )
}