// components/site/Hero.tsx
import Link from 'next/link'

export function Hero({
  eyebrowText,
  heading,
  subheading,
  primaryCtaText,
  primaryCtaHref,
  secondaryCtaText,
  secondaryCtaHref,
}: {
  eyebrowText: string
  heading: string
  subheading?: string | null
  primaryCtaText?: string | null
  primaryCtaHref?: string | null
  secondaryCtaText?: string | null
  secondaryCtaHref?: string | null
}) {
  return (
    <section className="mx-auto max-w-7xl bg-white px-6 py-20">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
          {eyebrowText}
        </span>

        <h1 className="mt-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
          {heading}
        </h1>

        {subheading && (
          <p className="mt-6 max-w-xl text-base text-gray-500">{subheading}</p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {primaryCtaText && primaryCtaHref && (
            <Link
              href={primaryCtaHref}
              className="rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              {primaryCtaText}
            </Link>
          )}
          {secondaryCtaText && secondaryCtaHref && (
            <Link
              href={secondaryCtaHref}
              className="rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              {secondaryCtaText}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}