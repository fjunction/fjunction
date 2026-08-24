// app/(admin)/admin/(protected)/content/isolation-callout/page.tsx
import { createClient } from '@/lib/supabase/server'
import { updateIsolationCallout } from '@/lib/admin/content-actions'

export default async function IsolationCalloutContentPage() {
  const supabase = await createClient()
  const { data: callout } = await supabase.from('home_isolation_callout').select('*').single()

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Isolation Callout</h1>
      <form action={updateIsolationCallout} className="mt-8 space-y-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
          <input name="heading" defaultValue={callout?.heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Body text</span>
          <textarea name="body_text" defaultValue={callout?.body_text ?? ''} rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <button type="submit" className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800">Save changes</button>
      </form>
    </div>
  )
}