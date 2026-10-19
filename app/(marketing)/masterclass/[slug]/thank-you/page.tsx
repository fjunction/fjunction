// app/(marketing)/masterclass/[slug]/thank-you/page.tsx
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/service'
import { settleOrder } from '@/lib/payments'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Payment status', robots: { index: false, follow: false } }

type PaymentRow = {
  amount: number
  currency: string
  masterclass_registrations: { masterclasses: { title: string } | null } | null
}

export default async function MasterclassThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ order_id?: string }>
}) {
  const { slug } = await params
  const { order_id: orderId } = await searchParams

  const result = orderId ? await settleOrder(orderId) : 'not_found'

  let payment: PaymentRow | null = null
  if (orderId && result !== 'not_found') {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('payments')
      .select('amount, currency, masterclass_registrations(masterclasses(title))')
      .eq('order_id', orderId)
      .maybeSingle()
    payment = data as unknown as PaymentRow | null
  }

  const title = payment?.masterclass_registrations?.masterclasses?.title
  const amount = payment ? `${payment.currency === 'USD' ? '$' : '₹'}${Number(payment.amount).toLocaleString('en-IN')}` : ''
  const linkClass = 'mt-8 inline-block rounded-full bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-600'

  return (
    <section className="bg-neutral-950 px-6 py-24">
      <div className="mx-auto max-w-xl text-center">
        {result === 'paid' && (
          <>
            <h1 className="text-3xl font-bold text-white">Payment received — you're registered</h1>
            {title && <p className="mt-4 text-sm text-neutral-300">{title} · {amount}</p>}
            <p className="mt-3 text-sm text-neutral-400">
              We'll share the joining details using the email and phone number you gave us.
            </p>
            <Link href="/masterclass" className={linkClass}>Back to masterclasses</Link>
          </>
        )}

        {result === 'pending' && (
          <>
            <h1 className="text-3xl font-bold text-white">We're still confirming your payment</h1>
            <p className="mt-3 text-sm text-neutral-400">
              If money was deducted, please don't pay again. Refresh this page in a minute, or contact us and quote
              your order ID: <span className="font-mono text-neutral-200">{orderId}</span>
            </p>
            <Link href={`/masterclass/${slug}/thank-you?order_id=${orderId}`} className={linkClass}>Refresh status</Link>
          </>
        )}

        {result === 'failed' && (
          <>
            <h1 className="text-3xl font-bold text-white">That payment didn't go through</h1>
            <p className="mt-3 text-sm text-neutral-400">No worries — you can try again.</p>
            <Link href={`/masterclass/${slug}`} className={linkClass}>Try again</Link>
          </>
        )}

        {result === 'not_found' && (
          <>
            <h1 className="text-3xl font-bold text-white">We couldn't find that payment</h1>
            <Link href={`/masterclass/${slug}`} className={linkClass}>Back to the masterclass</Link>
          </>
        )}
      </div>
    </section>
  )
}