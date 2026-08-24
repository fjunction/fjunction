// lib/content.ts
import { createClient } from '@/lib/supabase/server'

export async function getSiteChrome() {
  const supabase = await createClient()
  const [{ data: header, error: headerError }, { data: footer, error: footerError }] = await Promise.all([
    supabase.from('site_header').select('*').single(),
    supabase.from('site_footer').select('*').single(),
  ])
  if (headerError) console.error('[getSiteChrome] site_header error:', JSON.stringify(headerError))
  if (footerError) console.error('[getSiteChrome] site_footer error:', JSON.stringify(footerError))
  return { header, footer }
}

export async function getHomepageContent() {
  const supabase = await createClient()
  const results = await Promise.all([
    supabase.from('home_hero').select('*').single(),
    supabase.from('home_signals_section').select('*').single(),
    supabase.from('home_signal_cards').select('*').order('sort_order'),
    supabase.from('home_framework_section').select('*').single(),
    supabase.from('home_framework_steps').select('*').order('sort_order'),
    supabase.from('home_panel_section').select('*').single(),
    supabase.from('home_panel_stats').select('*').order('sort_order'),
  ])
  const tableNames = ['home_hero', 'home_signals_section', 'home_signal_cards', 'home_framework_section', 'home_framework_steps', 'home_panel_section', 'home_panel_stats']
  results.forEach((r, i) => r.error && console.error(`[getHomepageContent] ${tableNames[i]} error:`, JSON.stringify(r.error)))
  const [hero, signalsSection, signalCards, frameworkSection, frameworkSteps, panelSection, panelStats] = results.map((r) => r.data)
  return { hero, signalsSection, signalCards, frameworkSection, frameworkSteps, panelSection, panelStats }
}

export async function getHowItWorksContent() {
  const supabase = await createClient()
  const results = await Promise.all([
    supabase.from('how_it_works_hero').select('*').single(),
    supabase.from('how_it_works_steps').select('*').order('sort_order'),
    supabase.from('how_it_works_cta').select('*').single(),
  ])
  const tableNames = ['how_it_works_hero', 'how_it_works_steps', 'how_it_works_cta']
  results.forEach((r, i) => r.error && console.error(`[getHowItWorksContent] ${tableNames[i]} error:`, JSON.stringify(r.error)))
  const [hero, steps, cta] = results.map((r) => r.data)
  return { hero, steps, cta }
}

export async function getServicesContent() {
    const supabase = await createClient()
    const results = await Promise.all([
      supabase.from('services_hero').select('*').single(),
      supabase.from('services_protocol_section').select('*').single(),
      supabase.from('services_protocol_cards').select('*').order('sort_order'),
      supabase.from('services_cta').select('*').single(),
    ])
    const tableNames = ['services_hero', 'services_protocol_section', 'services_protocol_cards', 'services_cta']
    results.forEach((r, i) => r.error && console.error(`[getServicesContent] ${tableNames[i]} error:`, JSON.stringify(r.error)))
    const [hero, protocolSection, protocolCards, cta] = results.map((r) => r.data)
    return { hero, protocolSection, protocolCards, cta }
  }

  export async function getPrivacyPolicyContent() {
    const supabase = await createClient()
    const [{ data: page, error: pageError }, { data: sections, error: sectionsError }] = await Promise.all([
      supabase.from('privacy_policy_page').select('*').single(),
      supabase.from('privacy_policy_sections').select('*').order('sort_order'),
    ])
    if (pageError) console.error('[getPrivacyPolicyContent] privacy_policy_page error:', JSON.stringify(pageError))
    if (sectionsError) console.error('[getPrivacyPolicyContent] privacy_policy_sections error:', JSON.stringify(sectionsError))
    return { page, sections }
  }
  
  export async function getTermsContent() {
    const supabase = await createClient()
    const [{ data: page, error: pageError }, { data: sections, error: sectionsError }] = await Promise.all([
      supabase.from('terms_page').select('*').single(),
      supabase.from('terms_sections').select('*').order('sort_order'),
    ])
    if (pageError) console.error('[getTermsContent] terms_page error:', JSON.stringify(pageError))
    if (sectionsError) console.error('[getTermsContent] terms_sections error:', JSON.stringify(sectionsError))
    return { page, sections }
  }