// lib/masterclass.ts
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

export type Masterclass = {
  id: string
  slug: string
  title: string
  is_published: boolean
  registration_open: boolean
  event_at: string | null
  pricing_ends_at: string | null
  payment_url: string | null
  top_bar_text: string | null
  eyebrow_text: string | null
  heading: string
  heading_highlight: string | null
  subheading: string | null
  hero_badges: string | null
  cta_text: string | null
  hero_meta_text: string | null
  problems_heading: string | null
  problems: string | null
  problems_footer: string | null
  expert_label: string | null
  expert_name: string | null
  expert_bio: string | null
  testimonial_quote: string | null
  testimonial_author: string | null
  topics_heading: string | null
  topics: { number: string; title: string; description: string }[]
  offer_heading: string | null
  offer_items: { label: string; value_text: string; kind: 'main' | 'bonus' }[]
  offer_total_value_text: string | null
  offer_price_text: string | null
  offer_savings_text: string | null
  offer_note: string | null
  not_for_heading: string | null
  not_for_items: string | null
  for_heading: string | null
  for_items: string | null
  faq_heading: string | null
  faqs: { question: string; answer: string }[]
  closing_heading: string | null
  closing_subline: string | null
  closing_total_line: string | null
  closing_badges: string | null
  price_inr: number | null
  price_usd: number | null
}

export type RegisterResult =
  | { success: true; kind: 'checkout'; paymentSessionId: string; environment: 'sandbox' | 'production' }
  | { success: true; kind: 'redirect'; paymentUrl: string }
  | { success: true; kind: 'done'; message: string }
  | { success: false; error: string }

export const getMasterclassBySlug = cache(async (slug: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('masterclasses').select('*').eq('slug', slug).maybeSingle()
  if (error) console.error('[getMasterclassBySlug] error:', JSON.stringify(error))
  return (data as Masterclass | null) ?? null
})

export function splitLines(text?: string | null): string[] {
  return (text ?? '').split('\n').map((line) => line.trim()).filter(Boolean)
}

export function isRegistrationOpen(mc: { registration_open: boolean; event_at: string | null }) {
  if (!mc.registration_open) return false
  if (mc.event_at && new Date(mc.event_at).getTime() < Date.now()) return false
  return true
}

export function formatEventDate(iso: string | null) {
  if (!iso) return ''
  return (
    new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(iso)) + ' IST'
  )
}

// Admin date inputs are entered and shown in IST
export function toIstInputValue(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('sv-SE', { timeZone: 'Asia/Kolkata' }).replace(' ', 'T').slice(0, 16)
}

export function fromIstInputValue(value: FormDataEntryValue | null) {
  const v = typeof value === 'string' ? value.trim() : ''
  return v ? new Date(`${v}:00+05:30`).toISOString() : null
}