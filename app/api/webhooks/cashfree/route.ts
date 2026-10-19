// app/api/webhooks/cashfree/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/cashfree'
import { settleOrder } from '@/lib/payments'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const rawBody = await req.text() // signature is computed on the raw body, so don't parse first
  const signature = req.headers.get('x-webhook-signature')
  const timestamp = req.headers.get('x-webhook-timestamp')

  if (!signature || !timestamp || !verifyWebhookSignature(rawBody, signature, timestamp)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let orderId: string | undefined
  try {
    orderId = JSON.parse(rawBody)?.data?.order?.order_id
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  try {
    if (orderId) await settleOrder(orderId)
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[cashfree webhook] error:', error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 }) // Cashfree will retry
  }
}