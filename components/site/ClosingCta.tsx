// components/site/ClosingCta.tsx
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

export function ClosingCta({
  heading, subheading, primaryCtaText, primaryCtaHref, secondaryCtaText, secondaryCtaHref, linkText, linkHref,
}: {
  heading: string; subheading?: string | null; primaryCtaText?: string | null; primaryCtaHref?: string | null
  secondaryCtaText?: string | null; secondaryCtaHref?: string | null; linkText?: string | null; linkHref?: string | null
}) {
  return (
    <section className="bg-neutral-950 py-24 text-center">
      <div className="mx-auto max-w-xl px-6">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{heading}</h2>
        {subheading && <p className="mt-4 text-sm text-neutral-400">{subheading}</p>}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {primaryCtaText && primaryCtaHref && (
            <Link href={primaryCtaHref} className="rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-200">
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
        {linkText && linkHref && (
          <Link href={linkHref} className="mt-6 inline-block text-xs text-neutral-500 hover:text-neutral-300">{linkText} →</Link>
        )}
      </div>
    </section>
  )
}