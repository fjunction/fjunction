// app/(admin)/admin/(protected)/masterclasses/[id]/registrations/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { setRegistrationStatus } from '@/lib/admin/masterclass-actions'

type PaymentInfo = {
  order_id: string
  environment: 'sandbox' | 'production'
  amount: number
  currency: string
  status: string
  created_at: string
}

export default async function MasterclassRegistrationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: mc }, { data: rows }] = await Promise.all([
    supabase.from('masterclasses').select('id, title').eq('id', id).maybeSingle(),
    supabase
      .from('masterclass_registrations')
      .select('id, payment_status, created_at, people(name, email, phone), payments(order_id, environment, amount, currency, status, created_at)')
      .eq('masterclass_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (!mc) notFound()

  const paid = (rows ?? []).filter((row) => row.payment_status === 'paid').length

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/admin/masterclasses" className="text-sm underline">← All masterclasses</Link>
      <h1 className="mt-3 text-2xl font-bold text-gray-900">{mc.title} — Registrations</h1>
      <p className="mt-1 text-sm text-gray-500">
        {(rows ?? []).length} registered · {paid} paid. Online payments are marked paid automatically. Use "Mark paid" only for payments made outside the website.
      </p>

      <div className="mt-8 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Registered</th>
              <th className="px-4 py-3">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(rows ?? []).map((row) => {
              const person = row.people as unknown as { name: string | null; email: string | null; phone: string | null } | null
              const payments = ((row.payments as unknown as PaymentInfo[] | null) ?? [])
                .slice()
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              const latest = payments.find((p) => p.status === 'paid') ?? payments[0]
              const isPaid = row.payment_status === 'paid'
              return (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{person?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{person?.email ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{person?.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(row.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                  <td className="px-4 py-3">
                    <form action={setRegistrationStatus} className="flex flex-wrap items-center gap-3">
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="masterclass_id" value={mc.id} />
                      <input type="hidden" name="status" value={isPaid ? 'pending' : 'paid'} />
                      <span className={isPaid ? 'font-medium text-green-600' : 'text-amber-600'}>{isPaid ? 'Paid' : 'Pending'}</span>
                      {latest && (
                        <span className="text-xs text-gray-500">
                          {latest.currency === 'USD' ? '$' : '₹'}{Number(latest.amount).toLocaleString('en-IN')} · {latest.status}
                          {latest.environment === 'sandbox' && (
                            <span className="ml-1 rounded bg-purple-100 px-1.5 py-0.5 font-semibold text-purple-700">TEST</span>
                          )}
                        </span>
                      )}
                      <button type="submit" className="text-xs underline">{isPaid ? 'Mark pending' : 'Mark paid'}</button>
                    </form>
                  </td>
                </tr>
              )
            })}
            {(rows ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No registrations yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}