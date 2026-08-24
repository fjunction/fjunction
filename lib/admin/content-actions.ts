// lib/admin/content-actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const CONTENT_BUCKET = 'site-content'

async function uploadImageIfProvided(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File | null,
  pathPrefix: string
) {
  if (!file || file.size === 0) return null

  const fileExt = file.name.split('.').pop()
  const filePath = `${pathPrefix}-${Date.now()}.${fileExt}`

  const { error } = await supabase.storage.from(CONTENT_BUCKET).upload(filePath, file, { upsert: true })
  if (error) throw error

  const { data } = supabase.storage.from(CONTENT_BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}

// ---------- Header ----------
export async function updateHeader(formData: FormData) {
  const supabase = await createClient()
  const { data: existing } = await supabase.from('site_header').select('id').single()

  const logoFile = formData.get('logo_file') as File | null
  const logoUrl = await uploadImageIfProvided(supabase, logoFile, 'header-logo')

  await supabase
    .from('site_header')
    .update({
      logo_text: formData.get('logo_text'),
      ...(logoUrl ? { logo_image_url: logoUrl } : {}),
      cta_text: formData.get('cta_text'),
      cta_href: formData.get('cta_href'),
      nav_items: JSON.parse(formData.get('nav_items') as string),
      updated_at: new Date().toISOString(),
    })
    .eq('id', existing!.id)

  revalidatePath('/')
  revalidatePath('/admin/content/header')
}

// ---------- Hero ----------
export async function updateHero(formData: FormData) {
  const supabase = await createClient()
  const { data: existing } = await supabase.from('home_hero').select('id').single()

  await supabase
    .from('home_hero')
    .update({
      eyebrow_text: formData.get('eyebrow_text'),
      heading: formData.get('heading'),
      subheading: formData.get('subheading'),
      primary_cta_text: formData.get('primary_cta_text'),
      primary_cta_href: formData.get('primary_cta_href'),
      secondary_cta_text: formData.get('secondary_cta_text'),
      secondary_cta_href: formData.get('secondary_cta_href'),
      updated_at: new Date().toISOString(),
    })
    .eq('id', existing!.id)

  revalidatePath('/')
  revalidatePath('/admin/content/hero')
}

// ---------- Signals ----------
export async function updateSignals(formData: FormData) {
  const supabase = await createClient()
  const { data: existingSection } = await supabase.from('home_signals_section').select('id').single()

  await supabase
    .from('home_signals_section')
    .update({
      heading: formData.get('heading'),
      subheading: formData.get('subheading'),
      updated_at: new Date().toISOString(),
    })
    .eq('id', existingSection!.id)

  const cards = JSON.parse(formData.get('cards') as string) as Array<{
    icon_key: string
    title: string
    description: string
  }>

  await supabase.from('home_signal_cards').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  if (cards.length > 0) {
    await supabase.from('home_signal_cards').insert(
      cards.map((card, index) => ({ ...card, sort_order: index + 1 }))
    )
  }

  revalidatePath('/')
  revalidatePath('/admin/content/signals')
}

// ---------- Framework ----------
export async function updateFramework(formData: FormData) {
  const supabase = await createClient()
  const { data: existingSection } = await supabase.from('home_framework_section').select('id').single()

  await supabase
    .from('home_framework_section')
    .update({
      eyebrow_text: formData.get('eyebrow_text'),
      heading: formData.get('heading'),
      subheading: formData.get('subheading'),
      updated_at: new Date().toISOString(),
    })
    .eq('id', existingSection!.id)

  const steps = JSON.parse(formData.get('steps') as string) as Array<{
    step_number: string
    title: string
    description: string
    checklist_items: string // newline-separated, converted below
  }>

  await supabase.from('home_framework_steps').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  if (steps.length > 0) {
    await supabase.from('home_framework_steps').insert(
      steps.map((step, index) => ({
        step_number: step.step_number,
        title: step.title,
        description: step.description,
        checklist_items: step.checklist_items.split('\n').map((line) => line.trim()).filter(Boolean),
        sort_order: index + 1,
      }))
    )
  }

  revalidatePath('/')
  revalidatePath('/admin/content/framework')
}

// ---------- Panel ----------
export async function updatePanel(formData: FormData) {
  const supabase = await createClient()
  const { data: existingSection } = await supabase.from('home_panel_section').select('id').single()

  const photoFile = formData.get('photo_file') as File | null
  const photoUrl = await uploadImageIfProvided(supabase, photoFile, 'panel-photo')

  await supabase
    .from('home_panel_section')
    .update({
      eyebrow_text: formData.get('eyebrow_text'),
      heading: formData.get('heading'),
      body_text: formData.get('body_text'),
      ...(photoUrl ? { photo_url: photoUrl } : {}),
      status_badge_text: formData.get('status_badge_text'),
      person_name: formData.get('person_name'),
      person_experience_text: formData.get('person_experience_text'),
      updated_at: new Date().toISOString(),
    })
    .eq('id', existingSection!.id)

  const stats = JSON.parse(formData.get('stats') as string) as Array<{ value: string; label: string }>

  await supabase.from('home_panel_stats').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  if (stats.length > 0) {
    await supabase.from('home_panel_stats').insert(
      stats.map((stat, index) => ({ ...stat, sort_order: index + 1 }))
    )
  }

  revalidatePath('/')
  revalidatePath('/admin/content/panel')
}

// ---------- Footer ----------
export async function updateFooter(formData: FormData) {
  const supabase = await createClient()
  const { data: existing } = await supabase.from('site_footer').select('id').single()

  await supabase
    .from('site_footer')
    .update({
      logo_text: formData.get('logo_text'),
      disclaimer_text: formData.get('disclaimer_text'),
      links: JSON.parse(formData.get('links') as string),
      socials: JSON.parse(formData.get('socials') as string),
      updated_at: new Date().toISOString(),
    })
    .eq('id', existing!.id)

  revalidatePath('/')
  revalidatePath('/admin/content/footer')
}

export async function updateHowItWorksHero(formData: FormData) {
    const supabase = await createClient()
    const { data: existing } = await supabase.from('how_it_works_hero').select('id').single()
    await supabase.from('how_it_works_hero').update({
      eyebrow_text: formData.get('eyebrow_text'),
      heading: formData.get('heading'),
      subheading: formData.get('subheading'),
      updated_at: new Date().toISOString(),
    }).eq('id', existing!.id)
    revalidatePath('/how-it-works')
    revalidatePath('/admin/content/how-it-works-hero')
  }
  
  export async function updateHowItWorksSteps(formData: FormData) {
    const supabase = await createClient()
    const steps = JSON.parse(formData.get('steps') as string)
    await supabase.from('how_it_works_steps').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (steps.length > 0) {
      await supabase.from('how_it_works_steps').insert(steps.map((s: any, i: number) => ({ ...s, sort_order: i + 1 })))
    }
    revalidatePath('/how-it-works')
    revalidatePath('/admin/content/how-it-works-steps')
  }
  
  export async function updateHowItWorksCta(formData: FormData) {
    const supabase = await createClient()
    const { data: existing } = await supabase.from('how_it_works_cta').select('id').single()
    await supabase.from('how_it_works_cta').update({
      heading: formData.get('heading'),
      subheading: formData.get('subheading'),
      cta_text: formData.get('cta_text'),
      cta_href: formData.get('cta_href'),
      updated_at: new Date().toISOString(),
    }).eq('id', existing!.id)
    revalidatePath('/how-it-works')
    revalidatePath('/admin/content/how-it-works-cta')
  }

  export async function updateServicesHero(formData: FormData) {
    const supabase = await createClient()
    const { data: existing } = await supabase.from('services_hero').select('id').single()
    const photoFile = formData.get('photo_file') as File | null
    const photoUrl = await uploadImageIfProvided(supabase, photoFile, 'services-hero')
  
    await supabase.from('services_hero').update({
      eyebrow_text: formData.get('eyebrow_text'),
      heading: formData.get('heading'),
      subheading: formData.get('subheading'),
      ...(photoUrl ? { photo_url: photoUrl } : {}),
      primary_cta_text: formData.get('primary_cta_text'),
      primary_cta_href: formData.get('primary_cta_href'),
      secondary_cta_text: formData.get('secondary_cta_text'),
      secondary_cta_href: formData.get('secondary_cta_href'),
      updated_at: new Date().toISOString(),
    }).eq('id', existing!.id)
  
    revalidatePath('/services')
    revalidatePath('/admin/content/services-hero')
  }
  
  export async function updateServicesProtocol(formData: FormData) {
    const supabase = await createClient()
    const { data: existingSection } = await supabase.from('services_protocol_section').select('id').single()
  
    await supabase.from('services_protocol_section').update({
      heading: formData.get('heading'),
      subheading: formData.get('subheading'),
      updated_at: new Date().toISOString(),
    }).eq('id', existingSection!.id)
  
    const cards = JSON.parse(formData.get('cards') as string)
    await supabase.from('services_protocol_cards').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (cards.length > 0) {
      await supabase.from('services_protocol_cards').insert(cards.map((c: any, i: number) => ({ ...c, sort_order: i + 1 })))
    }
  
    revalidatePath('/services')
    revalidatePath('/admin/content/services-protocol')
  }
  
  export async function updateServicesCta(formData: FormData) {
    const supabase = await createClient()
    const { data: existing } = await supabase.from('services_cta').select('id').single()
  
    await supabase.from('services_cta').update({
      heading: formData.get('heading'),
      subheading: formData.get('subheading'),
      cta_text: formData.get('cta_text'),
      cta_href: formData.get('cta_href'),
      updated_at: new Date().toISOString(),
    }).eq('id', existing!.id)
  
    revalidatePath('/services')
    revalidatePath('/admin/content/services-cta')
  }

  export async function updatePrivacyPolicy(formData: FormData) {
    const supabase = await createClient()
    const { data: existing } = await supabase.from('privacy_policy_page').select('id').single()
  
    await supabase.from('privacy_policy_page').update({
      heading: formData.get('heading'),
      effective_date_label: formData.get('effective_date_label'),
      updated_at: new Date().toISOString(),
    }).eq('id', existing!.id)
  
    const sections = JSON.parse(formData.get('sections') as string)
    await supabase.from('privacy_policy_sections').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (sections.length > 0) {
      await supabase.from('privacy_policy_sections').insert(sections.map((s: any, i: number) => ({ ...s, sort_order: i + 1 })))
    }
  
    revalidatePath('/privacy-policy')
    revalidatePath('/admin/content/privacy-policy')
  }
  
  export async function updateTerms(formData: FormData) {
    const supabase = await createClient()
    const { data: existing } = await supabase.from('terms_page').select('id').single()
  
    await supabase.from('terms_page').update({
      heading: formData.get('heading'),
      updated_label: formData.get('updated_label'),
      updated_at: new Date().toISOString(),
    }).eq('id', existing!.id)
  
    const sections = JSON.parse(formData.get('sections') as string)
    await supabase.from('terms_sections').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (sections.length > 0) {
      await supabase.from('terms_sections').insert(sections.map((s: any, i: number) => ({ ...s, sort_order: i + 1 })))
    }
  
    revalidatePath('/terms-of-service')
    revalidatePath('/admin/content/terms')
  }