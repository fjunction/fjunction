// lib/actions/health-assessment-actions.ts
'use server'

import { createServiceClient } from '@/lib/supabase/service'

async function verifyCaptcha(token: string) {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: process.env.RECAPTCHA_SECRET_KEY!, response: token }),
  })
  const data = await response.json()
  return data.success === true
}

export async function submitHealthAssessment(formData: FormData) {
  const captchaToken = formData.get('captcha_token') as string
  if (!captchaToken || !(await verifyCaptcha(captchaToken))) {
    return { success: false, error: 'Captcha verification failed. Please try again.' }
  }

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = (formData.get('phone') as string) || null
  const ageRaw = formData.get('age') as string
  const age = ageRaw ? Number(ageRaw) : null

  const symptomFatigue = formData.get('symptom_fatigue') as string
  const symptomBrainFog = formData.get('symptom_brain_fog') as string
  const symptomDigestive = formData.get('symptom_digestive') as string
  const primaryObjectives = formData.getAll('primary_objectives') as string[]
  const existingDataNotes = (formData.get('existing_data_notes') as string) || null

  if (!name || !email || !symptomFatigue || !symptomBrainFog || !symptomDigestive) {
    return { success: false, error: 'Please fill in all required fields.' }
  }

  const supabase = createServiceClient()

  const { data: person, error: personError } = await supabase
    .from('people')
    .upsert({ name, email, phone, age, source: 'website' }, { onConflict: 'email' })
    .select('id')
    .single()

  if (personError || !person) {
    console.error('[submitHealthAssessment] people upsert error:', JSON.stringify(personError))
    return { success: false, error: 'Something went wrong saving your details. Please try again.' }
  }

  const { error: assessmentError } = await supabase.from('health_assessments').insert({
    person_id: person.id,
    primary_objectives: primaryObjectives,
    symptom_fatigue: symptomFatigue,
    symptom_brain_fog: symptomBrainFog,
    symptom_digestive: symptomDigestive,
    existing_data_notes: existingDataNotes,
  })

  if (assessmentError) {
    console.error('[submitHealthAssessment] health_assessments insert error:', JSON.stringify(assessmentError))
    return { success: false, error: 'Something went wrong saving your assessment. Please try again.' }
  }

  return { success: true }
}