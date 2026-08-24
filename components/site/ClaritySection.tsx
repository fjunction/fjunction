// components/site/ClaritySection.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function ClaritySection({
  heading,
  subheading,
  ctaText,
  ctaHref,
  showArrow = true,
}: {
  heading: string
  subheading?: string | null
  ctaText?: string | null
  ctaHref?: string | null
  showArrow?: boolean
}) {
  return (
    <section className="bg-neutral-950 py-24 text-center">
      <div className="mx-auto max-w-xl px-6">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{heading}</h2>
        {subheading && <p className="mt-4 text-sm text-neutral-400">{subheading}</p>}
        {ctaText && ctaHref && (
          <Link href={ctaHref} className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-200">
            {ctaText}
            {showArrow && <ArrowRight className="h-4 w-4" />}
          </Link>
        )}
      </div>
    </section>
  )
}