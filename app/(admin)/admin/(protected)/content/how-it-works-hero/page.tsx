// app/(admin)/admin/(protected)/content/how-it-works-hero/page.tsx
import { createClient } from '@/lib/supabase/server'
import { updateHowItWorksHero } from '@/lib/admin/content-actions'

export default async function HowItWorksHeroContentPage() {
  const supabase = await createClient()
  const { data: hero } = await supabase.from('how_it_works_hero').select('*').single()

  return (
    <div className="mx-auto max-w-2xl bg-white px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">How It Works — Hero</h1>
      <form action={updateHowItWorksHero} className="mt-8 space-y-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Eyebrow text</span>
          <input name="eyebrow_text" defaultValue={hero?.eyebrow_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
          <textarea name="heading" defaultValue={hero?.heading ?? ''} rows={2} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Subheading</span>
          <textarea name="subheading" defaultValue={hero?.subheading ?? ''} rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <button type="submit" className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800">Save changes</button>
      </form>
    </div>
  )
}