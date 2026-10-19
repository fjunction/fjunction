// components/masterclass/MasterclassSections.tsx
import { Check, X } from 'lucide-react'
import { RegisterButton } from './RegisterProvider'
import { Countdown } from './Countdown'
import { splitLines, type Masterclass } from '@/lib/masterclass'

const BUTTON = 'rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400'

export function MasterclassTopBar({ text, countdownTarget }: { text?: string | null; countdownTarget: string | null }) {
  return (
    <div className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-2">
        <p className="truncate text-xs text-slate-300">{text}</p>
        <div className="flex shrink-0 items-center gap-3">
          {countdownTarget && (
            <div className="hidden sm:block">
              <Countdown target={countdownTarget} size="sm" />
            </div>
          )}
          <RegisterButton className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-400">
            Register Now
          </RegisterButton>
        </div>
      </div>
    </div>
  )
}

export function HeroSection({ mc }: { mc: Masterclass }) {
  const badges = splitLines(mc.hero_badges)
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        {mc.eyebrow_text && (
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">{mc.eyebrow_text}</p>
        )}
        <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
          {mc.heading}
          {mc.heading_highlight && <span className="block text-amber-500">{mc.heading_highlight}</span>}
        </h1>
        {mc.subheading && <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-400">{mc.subheading}</p>}
        {badges.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span key={badge} className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300">
                {badge}
              </span>
            ))}
          </div>
        )}
        <RegisterButton className={`mt-8 inline-block ${BUTTON}`}>{mc.cta_text || 'Register Now'}</RegisterButton>
        {mc.hero_meta_text && <p className="mt-4 text-xs text-slate-500">{mc.hero_meta_text}</p>}
      </div>
    </section>
  )
}

export function ProblemSection({ mc }: { mc: Masterclass }) {
  const items = splitLines(mc.problems)
  if (items.length === 0) return null
  return (
    <section className="bg-slate-900/50 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        {mc.problems_heading && <h2 className="text-center text-2xl font-bold sm:text-3xl">{mc.problems_heading}</h2>}
        <ul className="mt-10 gap-x-10 md:columns-2">
          {items.map((item) => (
            <li key={item} className="mb-4 flex break-inside-avoid gap-3 text-sm text-slate-300">
              <span className="text-amber-500">→</span>
              {item}
            </li>
          ))}
        </ul>
        {mc.problems_footer && (
          <p className="mt-8 text-center text-sm font-semibold text-amber-500">{mc.problems_footer}</p>
        )}
      </div>
    </section>
  )
}

export function ExpertSection({ mc }: { mc: Masterclass }) {
  if (!mc.expert_name && !mc.testimonial_quote) return null
  return (
    <section className="px-6 py-16">
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <div>
          {mc.expert_label && (
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">{mc.expert_label}</p>
          )}
          {mc.expert_name && <h2 className="mt-3 text-2xl font-bold">{mc.expert_name}</h2>}
          {mc.expert_bio && <p className="mt-4 text-sm leading-relaxed text-slate-400">{mc.expert_bio}</p>}
        </div>
        {mc.testimonial_quote && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <span className="text-3xl leading-none text-amber-500">“</span>
            <p className="mt-2 text-sm italic leading-relaxed text-slate-300">{mc.testimonial_quote}</p>
            {mc.testimonial_author && <p className="mt-4 text-xs text-slate-500">— {mc.testimonial_author}</p>}
          </div>
        )}
      </div>
    </section>
  )
}

export function TopicsSection({ mc }: { mc: Masterclass }) {
  if (!mc.topics || mc.topics.length === 0) return null
  return (
    <section className="bg-slate-900/50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        {mc.topics_heading && <h2 className="text-center text-2xl font-bold sm:text-3xl">{mc.topics_heading}</h2>}
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {mc.topics.map((topic) => (
            <div key={`${topic.number}-${topic.title}`} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
              <span className="font-mono text-xs font-semibold text-amber-500">{topic.number}</span>
              <h3 className="mt-2 text-sm font-semibold">{topic.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{topic.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function OfferSection({ mc }: { mc: Masterclass }) {
  const main = (mc.offer_items ?? []).filter((item) => item.kind !== 'bonus')
  const bonuses = (mc.offer_items ?? []).filter((item) => item.kind === 'bonus')
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-xl">
        {mc.offer_heading && <h2 className="text-center text-2xl font-bold sm:text-3xl">{mc.offer_heading}</h2>}
        <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="space-y-3">
            {main.map((item) => (
              <div key={item.label} className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-slate-200">{item.label}</span>
                <span className={item.value_text.toLowerCase() === 'included' ? 'text-amber-500' : 'text-slate-400'}>
                  {item.value_text}
                </span>
              </div>
            ))}
          </div>

          {bonuses.length > 0 && (
            <div className="mt-6 border-t border-slate-800 pt-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Bonuses</p>
              <div className="mt-3 space-y-3">
                {bonuses.map((item) => (
                  <div key={item.label} className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-slate-400">{item.value_text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 space-y-3 border-t border-slate-800 pt-4">
            {mc.offer_total_value_text && (
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-slate-400">Total Value</span>
                <span className="text-slate-500 line-through">{mc.offer_total_value_text}</span>
              </div>
            )}
            {mc.offer_price_text && (
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold">Your Investment Today</span>
                <span className="text-right">
                  <span className="block text-2xl font-bold text-amber-500">{mc.offer_price_text}</span>
                  {mc.offer_savings_text && <span className="text-xs text-green-400">{mc.offer_savings_text}</span>}
                </span>
              </div>
            )}
          </div>

          <RegisterButton className={`mt-6 block w-full text-center ${BUTTON}`}>
            {mc.cta_text || 'Register Now'}
          </RegisterButton>
          {mc.offer_note && <p className="mt-3 text-center text-xs text-slate-500">{mc.offer_note}</p>}
        </div>
      </div>
    </section>
  )
}

export function FitSection({ mc }: { mc: Masterclass }) {
  const notFor = splitLines(mc.not_for_items)
  const isFor = splitLines(mc.for_items)
  if (notFor.length === 0 && isFor.length === 0) return null
  return (
    <section className="bg-slate-900/50 px-6 py-16">
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-red-500/20 bg-slate-900 p-6">
          <h3 className="text-sm font-bold text-red-400">{mc.not_for_heading}</h3>
          <ul className="mt-4 space-y-3">
            {notFor.map((item) => (
              <li key={item} className="flex gap-2 text-xs text-slate-300">
                <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-slate-900 p-6">
          <h3 className="text-sm font-bold text-green-400">{mc.for_heading}</h3>
          <ul className="mt-4 space-y-3">
            {isFor.map((item) => (
              <li key={item} className="flex gap-2 text-xs text-slate-300">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function FaqSection({ mc }: { mc: Masterclass }) {
  if (!mc.faqs || mc.faqs.length === 0) return null
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-2xl">
        {mc.faq_heading && <h2 className="text-center text-2xl font-bold sm:text-3xl">{mc.faq_heading}</h2>}
        <div className="mt-10 space-y-3">
          {mc.faqs.map((faq) => (
            <details key={faq.question} className="group rounded-lg border border-slate-800 bg-slate-900">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span className="text-amber-500 transition group-open:rotate-45">+</span>
              </summary>
              <p className="px-5 pb-4 text-sm leading-relaxed text-slate-400">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ClosingSection({
  mc,
  countdownTarget,
  countdownLabel,
}: {
  mc: Masterclass
  countdownTarget: string | null
  countdownLabel: string
}) {
  const badges = splitLines(mc.closing_badges)
  return (
    <section className="bg-slate-900/50 px-6 py-20 text-center">
      <div className="mx-auto max-w-2xl">
        {countdownTarget && (
          <div className="mb-10 flex flex-col items-center gap-3">
            <span className="rounded-full border border-amber-500/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-amber-500">
              {countdownLabel}
            </span>
            <Countdown target={countdownTarget} size="lg" />
          </div>
        )}
        {mc.closing_heading && (
          <h2 className="whitespace-pre-line text-3xl font-bold leading-tight sm:text-4xl">{mc.closing_heading}</h2>
        )}
        {mc.closing_subline && <p className="mt-5 text-xs text-slate-400">{mc.closing_subline}</p>}
        {mc.closing_total_line && (
          <p className="mt-2 text-sm font-semibold text-amber-500">{mc.closing_total_line}</p>
        )}
        <RegisterButton className={`mt-8 inline-block ${BUTTON}`}>{mc.cta_text || 'Register Now'}</RegisterButton>
        {badges.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
            {badges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}