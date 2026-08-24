// app/(admin)/admin/content/panel/page.tsx
import { createClient } from '@/lib/supabase/server'
import { updatePanel } from '@/lib/admin/content-actions'
import { RepeatableListEditor } from '@/components/admin/RepeatableListEditor'

export default async function PanelContentPage() {
  const supabase = await createClient()
  const [{ data: section }, { data: stats }] = await Promise.all([
    supabase.from('home_panel_section').select('*').single(),
    supabase.from('home_panel_stats').select('*').order('sort_order'),
  ])

  return (
    <div className="mx-auto max-w-2xl bg-white px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Panel</h1>

      <form action={updatePanel} className="mt-8 space-y-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Eyebrow text</span>
          <input name="eyebrow_text" defaultValue={section?.eyebrow_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
          <textarea name="heading" defaultValue={section?.heading ?? ''} rows={2} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Body text</span>
          <textarea name="body_text" defaultValue={section?.body_text ?? ''} rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Photo (optional — leave blank to keep current)</span>
          {section?.photo_url && (
            <img src={section.photo_url} alt="Current photo" className="mb-2 h-24 w-24 rounded-lg object-cover" />
          )}
          <input type="file" name="photo_file" accept="image/*" className="text-sm" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Status badge text</span>
          <input name="status_badge_text" defaultValue={section?.status_badge_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Person name</span>
            <input name="person_name" defaultValue={section?.person_name ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Person experience</span>
            <input name="person_experience_text" defaultValue={section?.person_experience_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-gray-700">Stats</span>
          <RepeatableListEditor
            name="stats"
            initialItems={stats ?? []}
            emptyItem={{ value: '', label: '' }}
            fields={[
              { key: 'value', label: 'Value (e.g. 500k+)' },
              { key: 'label', label: 'Label (e.g. YouTube Comm.)' },
            ]}
          />
        </div>

        <button type="submit" className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800">
          Save changes
        </button>
      </form>
    </div>
  )
}