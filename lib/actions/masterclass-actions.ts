// lib/actions/masterclass-actions.ts
'use server'

import crypto from 'crypto'
import { headers } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/service'
import { verifyCaptcha } from '@/lib/captcha'
import { isRegistrationOpen, type RegisterResult } from '@/lib/masterclass'
import { cashfreeEnvironment, createCashfreeOrder, paymentsAllowedHere } from '@/lib/cashfree'

const CLOSED: RegisterResult = { success: false, error: 'Registration for this masterclass is closed.' }

export async function registerForMasterclass(formData: FormData): Promise<RegisterResult> {
  const captchaToken = String(formData.get('captcha_token') ?? '')
  if (!captchaToken || !(await verifyCaptcha(captchaToken))) {
    return { success: false, error: 'Captcha verification failed. Please try again.' }
  }

  const masterclassId = String(formData.get('masterclass_id') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const phone = String(formData.get('phone') ?? '').trim()
  const region = String(formData.get('region') ?? 'india')

  if (!masterclassId || !name || !email || !phone) {
    return { success: false, error: 'Please fill in your name, email and phone number.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }
  if (phone.replace(/\D/g, '').length < 10) {
    return { success: false, error: 'Please enter a valid phone number (at least 10 digits).' }
  }

  const supabase = createServiceClient()

  const { data: masterclass, error: masterclassError } = await supabase
    .from('masterclasses')
    .select('id, slug, title, is_published, registration_open, event_at, payment_url, price_inr, price_usd')
    .eq('id', masterclassId)
    .maybeSingle()

  // Draft masterclasses can be test-registered only with sandbox keys on a non-production deployment
  const draftsAllowed = cashfreeEnvironment === 'sandbox' && process.env.VERCEL_ENV !== 'production'

  if (
    masterclassError ||
    !masterclass ||
    (!masterclass.is_published && !draftsAllowed) ||
    !isRegistrationOpen(masterclass)
  ) {
    return CLOSED
  }

  // Find or create the person (existing people are never overwritten, only missing name/phone are filled)
  const { data: existing } = await supabase.from('people').select('id, name, phone').eq('email', email).maybeSingle()

  let personId: string
  if (existing) {
    personId = existing.id
    const patch: Record<string, string> = {}
    if (!existing.name) patch.name = name
    if (!existing.phone) patch.phone = phone
    if (Object.keys(patch).length > 0) {
      await supabase.from('people').update(patch).eq('id', personId)
    }
  } else {
    const { data: created, error: createError } = await supabase
      .from('people')
      .insert({ name, email, phone, source: 'masterclass' })
      .select('id')
      .single()
    if (createError || !created) {
      console.error('[registerForMasterclass] people insert error:', JSON.stringify(createError))
      return { success: false, error: 'Something went wrong saving your details. Please try again.' }
    }
    personId = created.id
  }

  const { data: existingRegistration } = await supabase
    .from('masterclass_registrations')
    .select('id, payment_status')
    .eq('masterclass_id', masterclassId)
    .eq('person_id', personId)
    .maybeSingle()

  if (existingRegistration?.payment_status === 'paid') {
    return { success: true, kind: 'done', message: "You're already registered for this masterclass. See you there!" }
  }

  let registrationId: string
  if (existingRegistration) {
    registrationId = existingRegistration.id
  } else {
    const { data: createdRegistration, error: registrationError } = await supabase
      .from('masterclass_registrations')
      .insert({ masterclass_id: masterclassId, person_id: personId })
      .select('id')
      .single()
    if (registrationError || !createdRegistration) {
      console.error('[registerForMasterclass] registration insert error:', JSON.stringify(registrationError))
      return { success: false, error: 'Something went wrong saving your registration. Please try again.' }
    }
    registrationId = createdRegistration.id
  }

  // What to charge
  const useUsd = region === 'international' && masterclass.price_usd != null
  const amount = useUsd
    ? Number(masterclass.price_usd)
    : masterclass.price_inr != null
      ? Number(masterclass.price_inr)
      : null
  const currency = useUsd ? 'USD' : 'INR'

  // No price configured yet: keep the old behaviour (payment link) so the live page keeps working
  if (amount === null) {
    if (masterclass.payment_url) return { success: true, kind: 'redirect', paymentUrl: masterclass.payment_url }
    return {
      success: true,
      kind: 'done',
      message: "Thanks — we've saved your details. We'll contact you shortly with payment instructions.",
    }
  }

  if (!paymentsAllowedHere) {
    return {
      success: true,
      kind: 'done',
      message: "Thanks — we've saved your details. Online payment isn't available just yet, so we'll contact you with payment instructions.",
    }
  }

  const headerList = await headers()
  const origin = headerList.get('origin') ?? process.env.SITE_URL ?? ''
  if (!origin) {
    console.error('[registerForMasterclass] no origin or SITE_URL available')
    return { success: false, error: 'Payments are not configured correctly. Please contact us.' }
  }

  const orderId = `mc_${crypto.randomBytes(10).toString('hex')}`

  const { error: paymentInsertError } = await supabase.from('payments').insert({
    registration_id: registrationId,
    order_id: orderId,
    environment: cashfreeEnvironment,
    amount,
    currency,
    status: 'created',
  })
  if (paymentInsertError) {
    console.error('[registerForMasterclass] payment insert error:', JSON.stringify(paymentInsertError))
    return { success: false, error: 'Something went wrong starting your payment. Please try again.' }
  }

  try {
    const order = await createCashfreeOrder({
      orderId,
      amount,
      currency,
      customer: { id: personId, name, email, phone },
      returnUrl: `${origin}/masterclass/${masterclass.slug}/thank-you?order_id={order_id}`,
      // Cashfree needs an https webhook URL, so it is skipped on localhost (the thank-you page still confirms payment)
      notifyUrl: origin.startsWith('https://') ? `${origin}/api/webhooks/cashfree` : undefined,
      note: masterclass.title,
    })

    await supabase.from('payments').update({ cf_order_id: order.cfOrderId }).eq('order_id', orderId)

    return {
      success: true,
      kind: 'checkout',
      paymentSessionId: order.paymentSessionId,
      environment: cashfreeEnvironment,
    }
  } catch (error) {
    console.error('[registerForMasterclass] order creation failed:', error)
    await supabase.from('payments').update({ status: 'failed' }).eq('order_id', orderId)
    return { success: false, error: 'We could not start the payment. Please try again in a moment.' }
  }
}