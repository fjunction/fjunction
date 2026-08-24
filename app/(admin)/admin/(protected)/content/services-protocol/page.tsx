// app/(admin)/admin/(protected)/content/services-protocol/page.tsx
import { createClient } from '@/lib/supabase/server'
import { updateServicesProtocol } from '@/lib/admin/content-actions'
import { RepeatableListEditor } from '@/components/admin/RepeatableListEditor'

export default async function ServicesProtocolContentPage() {
  const supabase = await createClient()
  const [{ data: section }, { data: cards }] = await Promise.all([
    supabase.from('services_protocol_section').select('*').single(),
    supabase.from('services_protocol_cards').select('*').order('sort_order'),
  ])

  return (
    <div className="mx-auto max-w-2xl bg-white px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Services — The Protocol</h1>
      <p className="mt-1 text-sm text-gray-500">
        Widget type controls what shows below the description: "tags" (short labels, one per line in Widget items), "image" (paste a Supabase Storage URL after uploading it), or "none". The layout (which cards are wide vs. narrow) is fixed to match the design.
      </p>
      <form action={updateServicesProtocol} className="mt-8 space-y-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
          <input name="heading" defaultValue={section?.heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Subheading</span>
          <textarea name="subheading" defaultValue={section?.subheading ?? ''} rows={2} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <RepeatableListEditor
          name="cards"
          initialItems={cards ?? []}
          emptyItem={{ icon_key: 'trending-up', title: '', description: '', widget_type: 'none', widget_items: '', image_url: '' }}
          fields={[
            { key: 'icon_key', label: 'Icon', type: 'select', options: ['trending-up', 'sliders', 'dna'] },
            { key: 'title', label: 'Title' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'widget_type', label: 'Widget type', type: 'select', options: ['none', 'tags', 'image'] },
            { key: 'widget_items', label: 'Widget items (tags — one per line)', type: 'textarea' },
            { key: 'image_url', label: 'Image URL (for "image" widget)' },
          ]}
        />
        <button type="submit" className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800">Save changes</button>
      </form>
    </div>
  )
}