// app/(admin)/admin/(protected)/content/services-cta/page.tsx
import { createClient } from '@/lib/supabase/server'
import { updateServicesCta } from '@/lib/admin/content-actions'

export default async function ServicesCtaContentPage() {
  const supabase = await createClient()
  const { data: cta } = await supabase.from('services_cta').select('*').single()

  return (
    <div className="mx-auto max-w-2xl bg-white px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Services — Clarity CTA</h1>
      <form action={updateServicesCta} className="mt-8 space-y-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
          <input name="heading" defaultValue={cta?.heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Subheading</span>
          <textarea name="subheading" defaultValue={cta?.subheading ?? ''} rows={2} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">CTA text</span>
            <input name="cta_text" defaultValue={cta?.cta_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">CTA link</span>
            <input name="cta_href" defaultValue={cta?.cta_href ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
        </div>
        <button type="submit" className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800">Save changes</button>
      </form>
    </div>
  )
}