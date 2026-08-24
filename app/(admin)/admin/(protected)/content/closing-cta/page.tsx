// app/(admin)/admin/(protected)/content/closing-cta/page.tsx
import { createClient } from '@/lib/supabase/server'
import { updateClosingCta } from '@/lib/admin/content-actions'

export default async function ClosingCtaContentPage() {
  const supabase = await createClient()
  const { data: cta } = await supabase.from('home_closing_cta').select('*').single()

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Closing CTA</h1>
      <form action={updateClosingCta} className="mt-8 space-y-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
          <input name="heading" defaultValue={cta?.heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Subheading</span>
          <textarea name="subheading" defaultValue={cta?.subheading ?? ''} rows={2} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">Primary CTA text</span><input name="primary_cta_text" defaultValue={cta?.primary_cta_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" /></label>
          <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">Primary CTA link</span><input name="primary_cta_href" defaultValue={cta?.primary_cta_href ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" /></label>
          <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">Secondary CTA text</span><input name="secondary_cta_text" defaultValue={cta?.secondary_cta_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" /></label>
          <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">Secondary CTA link</span><input name="secondary_cta_href" defaultValue={cta?.secondary_cta_href ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" /></label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">Below-link text</span><input name="link_text" defaultValue={cta?.link_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" /></label>
          <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">Below-link URL</span><input name="link_href" defaultValue={cta?.link_href ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" /></label>
        </div>
        <button type="submit" className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800">Save changes</button>
      </form>
    </div>
  )
}