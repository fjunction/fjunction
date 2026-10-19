// lib/admin/masterclass-actions.ts
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { fromIstInputValue } from '@/lib/masterclass'

function numberOrNull(formData: FormData, key: string) {
    const value = String(formData.get(key) ?? '').trim()
    const n = Number(value)
    return value !== '' && Number.isFinite(n) && n >= 0 ? n : null
}

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function text(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null
}

function jsonList<T>(formData: FormData, key: string, keep: (item: T) => boolean): T[] {
  try {
    const parsed = JSON.parse(String(formData.get(key) ?? '[]')) as T[]
    return parsed.filter(keep)
  } catch {
    return []
  }
}

export async function createMasterclass(formData: FormData) {
  const supabase = await createClient()
  const title = String(formData.get('title') ?? '').trim()
  const slug = slugify(String(formData.get('slug') ?? '') || title)
  if (!title || !slug) throw new Error('Please enter a title.')

  const { data, error } = await supabase
    .from('masterclasses')
    .insert({ title, slug, heading: title })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[createMasterclass] error:', JSON.stringify(error))
    throw new Error(error?.message ?? 'Could not create masterclass (is the slug already used?).')
  }

  revalidatePath('/admin/masterclasses')
  redirect(`/admin/masterclasses/${data.id}`)
}

export async function duplicateMasterclass(formData: FormData) {
  const supabase = await createClient()
  const id = String(formData.get('id') ?? '')

  const { data: source, error } = await supabase.from('masterclasses').select('*').eq('id', id).single()
  if (error || !source) throw new Error('Masterclass not found.')

  const copy = { ...source } as Record<string, unknown>
  delete copy.id
  delete copy.created_at
  delete copy.updated_at

  const { data, error: insertError } = await supabase
    .from('masterclasses')
    .insert({
      ...copy,
      slug: `${source.slug}-copy-${Date.now().toString(36)}`,
      title: `Copy of ${source.title}`,
      is_published: false,
      event_at: null,
      pricing_ends_at: null,
      payment_url: null,
    })
    .select('id')
    .single()

  if (insertError || !data) {
    console.error('[duplicateMasterclass] error:', JSON.stringify(insertError))
    throw new Error(insertError?.message ?? 'Could not duplicate masterclass.')
  }

  revalidatePath('/admin/masterclasses')
  redirect(`/admin/masterclasses/${data.id}`)
}

export async function updateMasterclass(formData: FormData) {
  const supabase = await createClient()
  const id = String(formData.get('id') ?? '')
  const slug = slugify(String(formData.get('slug') ?? ''))
  
  if (!id || !slug) throw new Error('Slug is required.')

  const { error } = await supabase
    .from('masterclasses')
    .update({
      slug,
      title: text(formData, 'title') ?? '',
      is_published: formData.get('is_published') === 'on',
      registration_open: formData.get('registration_open') === 'on',
      event_at: fromIstInputValue(formData.get('event_at')),
      pricing_ends_at: fromIstInputValue(formData.get('pricing_ends_at')),
      payment_url: text(formData, 'payment_url'),
      price_inr: numberOrNull(formData, 'price_inr'),
      price_usd: numberOrNull(formData, 'price_usd'),
      top_bar_text: text(formData, 'top_bar_text'),
      eyebrow_text: text(formData, 'eyebrow_text'),
      heading: text(formData, 'heading') ?? '',
      heading_highlight: text(formData, 'heading_highlight'),
      subheading: text(formData, 'subheading'),
      hero_badges: text(formData, 'hero_badges'),
      cta_text: text(formData, 'cta_text'),
      hero_meta_text: text(formData, 'hero_meta_text'),

      problems_heading: text(formData, 'problems_heading'),
      problems: text(formData, 'problems'),
      problems_footer: text(formData, 'problems_footer'),

      expert_label: text(formData, 'expert_label'),
      expert_name: text(formData, 'expert_name'),
      expert_bio: text(formData, 'expert_bio'),
      testimonial_quote: text(formData, 'testimonial_quote'),
      testimonial_author: text(formData, 'testimonial_author'),

      topics_heading: text(formData, 'topics_heading'),
      topics: jsonList<{ title: string }>(formData, 'topics', (t) => !!t.title),

      offer_heading: text(formData, 'offer_heading'),
      offer_items: jsonList<{ label: string }>(formData, 'offer_items', (o) => !!o.label),
      offer_total_value_text: text(formData, 'offer_total_value_text'),
      offer_price_text: text(formData, 'offer_price_text'),
      offer_savings_text: text(formData, 'offer_savings_text'),
      offer_note: text(formData, 'offer_note'),

      not_for_heading: text(formData, 'not_for_heading'),
      not_for_items: text(formData, 'not_for_items'),
      for_heading: text(formData, 'for_heading'),
      for_items: text(formData, 'for_items'),

      faq_heading: text(formData, 'faq_heading'),
      faqs: jsonList<{ question: string }>(formData, 'faqs', (f) => !!f.question),

      closing_heading: text(formData, 'closing_heading'),
      closing_subline: text(formData, 'closing_subline'),
      closing_total_line: text(formData, 'closing_total_line'),
      closing_badges: text(formData, 'closing_badges'),

      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('[updateMasterclass] error:', JSON.stringify(error))
    throw new Error(`Failed to save masterclass: ${error.message}`)
  }

  revalidatePath('/masterclass')
  revalidatePath(`/masterclass/${slug}`)
  revalidatePath('/admin/masterclasses')
  revalidatePath(`/admin/masterclasses/${id}`)
}

export async function setRegistrationStatus(formData: FormData) {
  const supabase = await createClient()
  const id = String(formData.get('id') ?? '')
  const masterclassId = String(formData.get('masterclass_id') ?? '')
  const status = formData.get('status') === 'paid' ? 'paid' : 'pending'

  const { error } = await supabase.from('masterclass_registrations').update({ payment_status: status }).eq('id', id)
  if (error) {
    console.error('[setRegistrationStatus] error:', JSON.stringify(error))
    throw new Error(`Failed to update registration: ${error.message}`)
  }

  revalidatePath(`/admin/masterclasses/${masterclassId}/registrations`)
  revalidatePath('/admin/masterclasses')
}