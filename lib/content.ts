// lib/content.ts
import { createClient } from '@/lib/supabase/server'

export async function getHomepageContent() {
  const supabase = await createClient()

  const [
    { data: header },
    { data: hero },
    { data: signalsSection },
    { data: signalCards },
    { data: frameworkSection },
    { data: frameworkSteps },
    { data: footer },
  ] = await Promise.all([
    supabase.from('site_header').select('*').single(),
    supabase.from('home_hero').select('*').single(),
    supabase.from('home_signals_section').select('*').single(),
    supabase.from('home_signal_cards').select('*').order('sort_order'),
    supabase.from('home_framework_section').select('*').single(),
    supabase.from('home_framework_steps').select('*').order('sort_order'),
    supabase.from('site_footer').select('*').single(),
  ])

  return { header, hero, signalsSection, signalCards, frameworkSection, frameworkSteps, footer }
}