// lib/payments.ts
import { createServiceClient } from '@/lib/supabase/service'
import { cashfreeEnvironment, fetchCashfreeOrder } from '@/lib/cashfree'

export type SettleResult = 'paid' | 'pending' | 'failed' | 'not_found'

// Safe to call any number of times (webhook retries, page refreshes)
export async function settleOrder(orderId: string): Promise<SettleResult> {
  const supabase = createServiceClient()

  const { data: payment } = await supabase
    .from('payments')
    .select('id, registration_id, status, environment, amount')
    .eq('order_id', orderId)
    .maybeSingle()

  if (!payment || payment.environment !== cashfreeEnvironment) return 'not_found'
  if (payment.status === 'paid') return 'paid'

  // Never trust the browser or the webhook body alone: ask Cashfree directly
  const order = await fetchCashfreeOrder(orderId)
  const orderStatus = String(order.order_status ?? '')

  if (orderStatus === 'PAID') {
    if (Number(order.order_amount) !== Number(payment.amount)) {
      console.error('[settleOrder] amount mismatch for', orderId)
      return 'pending'
    }

    const now = new Date().toISOString()
    const { error: paymentError } = await supabase
      .from('payments')
      .update({ status: 'paid', paid_at: now })
      .eq('id', payment.id)
    if (paymentError) throw new Error(`payments update failed: ${paymentError.message}`)

    const { error: registrationError } = await supabase
      .from('masterclass_registrations')
      .update({ payment_status: 'paid', paid_at: now })
      .eq('id', payment.registration_id)
    if (registrationError) throw new Error(`registration update failed: ${registrationError.message}`)

    return 'paid'
  }

  if (orderStatus === 'EXPIRED' || orderStatus === 'TERMINATED') {
    await supabase.from('payments').update({ status: 'expired' }).eq('id', payment.id)
    return 'failed'
  }

  return 'pending'
}