// lib/cashfree.ts
import crypto from 'crypto'

export type CashfreeEnvironment = 'sandbox' | 'production'

export const cashfreeEnvironment: CashfreeEnvironment =
  process.env.CASHFREE_ENV === 'production' ? 'production' : 'sandbox'

const BASE_URL =
  cashfreeEnvironment === 'production' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg'

// The live site must never run on sandbox keys
export const paymentsAllowedHere = !(
  process.env.VERCEL_ENV === 'production' && cashfreeEnvironment !== 'production'
)

function credentials() {
  const appId = process.env.CASHFREE_APP_ID
  const secret = process.env.CASHFREE_SECRET_KEY
  if (!appId || !secret) throw new Error('Cashfree keys are not configured.')

  // Deliberately loose check: key formats vary, but test and live keys should never be mixed up
  const looksTest = /^TEST/i.test(appId) || /(^|_)test_/i.test(secret)
  const looksLive = /^PROD/i.test(appId) || /(^|_)prod_/i.test(secret)
  if (cashfreeEnvironment === 'production' && looksTest) {
    throw new Error('CASHFREE_ENV is production but the keys look like test keys.')
  }
  if (cashfreeEnvironment === 'sandbox' && looksLive) {
    throw new Error('CASHFREE_ENV is sandbox but the keys look like live keys.')
  }
  return { appId, secret }
}

function apiHeaders() {
  const { appId, secret } = credentials()
  return {
    'Content-Type': 'application/json',
    'x-api-version': '2025-01-01',
    'x-client-id': appId,
    'x-client-secret': secret,
  }
}

// Cashfree expects a plain phone number: digits only, no country code for Indian numbers
export function cashfreePhone(raw: string) {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2)
  if (digits.length > 10) return digits.slice(-10)
  return digits
}

export async function createCashfreeOrder(input: {
  orderId: string
  amount: number
  currency: 'INR' | 'USD'
  customer: { id: string; name: string; email: string; phone: string }
  returnUrl: string
  notifyUrl?: string
  note?: string
}) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: apiHeaders(),
    cache: 'no-store',
    body: JSON.stringify({
      order_id: input.orderId,
      order_amount: input.amount,
      order_currency: input.currency,
      order_note: input.note?.slice(0, 200),
      customer_details: {
        customer_id: input.customer.id,
        customer_name: input.customer.name,
        customer_email: input.customer.email,
        customer_phone: cashfreePhone(input.customer.phone),
      },
      order_meta: {
        return_url: input.returnUrl,
        ...(input.notifyUrl ? { notify_url: input.notifyUrl } : {}),
      },
    }),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.payment_session_id) {
    console.error('[createCashfreeOrder] error:', res.status, JSON.stringify(data))
    throw new Error(data?.message ?? 'Could not create the payment order.')
  }

  return { cfOrderId: String(data.cf_order_id ?? ''), paymentSessionId: data.payment_session_id as string }
}

export async function fetchCashfreeOrder(orderId: string) {
  const res = await fetch(`${BASE_URL}/orders/${encodeURIComponent(orderId)}`, {
    headers: apiHeaders(),
    cache: 'no-store',
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    console.error('[fetchCashfreeOrder] error:', res.status, JSON.stringify(data))
    throw new Error(data?.message ?? 'Could not fetch the order from Cashfree.')
  }
  return data as { order_status?: string; order_amount?: number | string }
}

// Signature = base64(HMAC-SHA256(timestamp + rawBody, secretKey))
export function verifyWebhookSignature(rawBody: string, signature: string, timestamp: string) {
  const { secret } = credentials()
  const expected = crypto.createHmac('sha256', secret).update(timestamp + rawBody).digest('base64')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}