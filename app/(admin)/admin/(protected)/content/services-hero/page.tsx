// app/(admin)/admin/(protected)/content/services-hero/page.tsx
import { createClient } from '@/lib/supabase/server'
import { updateServicesHero } from '@/lib/admin/content-actions'

export default async function ServicesHeroContentPage() {
  const supabase = await createClient()
  const { data: hero } = await supabase.from('services_hero').select('*').single()

  return (
    <div className="mx-auto max-w-2xl bg-white px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Services — Hero</h1>
      <form action={updateServicesHero} className="mt-8 space-y-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Eyebrow text</span>
          <input name="eyebrow_text" defaultValue={hero?.eyebrow_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
          <input name="heading" defaultValue={hero?.heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Subheading</span>
          <textarea name="subheading" defaultValue={hero?.subheading ?? ''} rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Photo (optional — leave blank to keep current)</span>
          {hero?.photo_url && <img src={hero.photo_url} alt="Current" className="mb-2 h-24 w-32 rounded-lg object-cover" />}
          <input type="file" name="photo_file" accept="image/*" className="text-sm" />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Primary CTA text</span>
            <input name="primary_cta_text" defaultValue={hero?.primary_cta_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Primary CTA link</span>
            <input name="primary_cta_href" defaultValue={hero?.primary_cta_href ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Secondary CTA text</span>
            <input name="secondary_cta_text" defaultValue={hero?.secondary_cta_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Secondary CTA link</span>
            <input name="secondary_cta_href" defaultValue={hero?.secondary_cta_href ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
        </div>
        <button type="submit" className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800">Save changes</button>
      </form>
    </div>
  )
}