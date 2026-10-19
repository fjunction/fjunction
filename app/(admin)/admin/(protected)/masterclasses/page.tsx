// app/(admin)/admin/(protected)/masterclasses/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createMasterclass, duplicateMasterclass } from '@/lib/admin/masterclass-actions'
import { formatEventDate } from '@/lib/masterclass'

export default async function MasterclassesAdminPage() {
  const supabase = await createClient()
  const [{ data: masterclasses }, { data: registrations }] = await Promise.all([
    supabase
      .from('masterclasses')
      .select('id, slug, title, is_published, event_at')
      .order('event_at', { ascending: false, nullsFirst: true }),
    supabase.from('masterclass_registrations').select('masterclass_id, payment_status'),
  ])

  const counts: Record<string, { total: number; paid: number }> = {}
  for (const row of registrations ?? []) {
    const entry = (counts[row.masterclass_id] ??= { total: 0, paid: 0 })
    entry.total += 1
    if (row.payment_status === 'paid') entry.paid += 1
  }

  const now = Date.now()

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Masterclasses</h1>
      <p className="mt-1 text-sm text-gray-500">
        Every masterclass keeps its own page and its registrations, so past ones stay on record.
      </p>

      <form action={createMasterclass} className="mt-8 flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 p-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Title</span>
          <input name="title" required placeholder="e.g. Insulin Resistance Masterclass" className="w-72 rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">URL slug (optional)</span>
          <input name="slug" placeholder="auto from title" className="w-56 rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <button type="submit" className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800">
          + New masterclass
        </button>
      </form>

      <div className="mt-8 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Masterclass</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Registrations</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(masterclasses ?? []).map((mc) => {
              const past = mc.event_at ? new Date(mc.event_at).getTime() < now : false
              const count = counts[mc.id] ?? { total: 0, paid: 0 }
              return (
                <tr key={mc.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{mc.title}</p>
                    <p className="text-xs text-gray-500">/masterclass/{mc.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{mc.event_at ? formatEventDate(mc.event_at) : 'Not set'}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {mc.is_published ? 'Published' : 'Draft'}
                    {mc.event_at && ` · ${past ? 'Past' : 'Upcoming'}`}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {count.total} registered · {count.paid} paid
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link href={`/admin/masterclasses/${mc.id}`} className="font-medium text-gray-900 underline">Edit</Link>
                      <Link href={`/admin/masterclasses/${mc.id}/registrations`} className="text-gray-700 underline">Registrations</Link>
                      <Link href={`/masterclass/${mc.slug}`} target="_blank" className="text-gray-700 underline">View</Link>
                      <form action={duplicateMasterclass}>
                        <input type="hidden" name="id" value={mc.id} />
                        <button type="submit" className="text-gray-700 underline">Duplicate</button>
                      </form>
                    </div>
                  </td>
                </tr>
              )
            })}
            {(masterclasses ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No masterclasses yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}