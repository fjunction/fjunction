// app/(admin)/admin/(protected)/content/system-section/page.tsx
import { createClient } from '@/lib/supabase/server'
import { updateSystemSection } from '@/lib/admin/content-actions'
import { RepeatableListEditor } from '@/components/admin/RepeatableListEditor'

export default async function SystemSectionContentPage() {
  const supabase = await createClient()
  const [{ data: section }, { data: tags }, { data: nodes }] = await Promise.all([
    supabase.from('home_system_section').select('*').single(),
    supabase.from('home_system_tags').select('*').order('sort_order'),
    supabase.from('home_system_nodes').select('*').order('sort_order'),
  ])

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Your Health Is a System</h1>
      <form action={updateSystemSection} className="mt-8 space-y-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Heading (main line)</span>
          <input name="heading" defaultValue={section?.heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Heading (secondary/muted line)</span>
          <input name="heading_secondary" defaultValue={section?.heading_secondary ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Subheading</span>
          <textarea name="subheading" defaultValue={section?.subheading ?? ''} rows={2} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <div>
          <span className="mb-2 block text-sm font-medium text-gray-700">Left-side tags</span>
          <RepeatableListEditor name="tags" initialItems={tags ?? []} emptyItem={{ label: '', description: '' }} fields={[{ key: 'label', label: 'Label' }, { key: 'description', label: 'Description', type: 'textarea' }]} />
        </div>
        <div>
          <span className="mb-2 block text-sm font-medium text-gray-700">Diagram labels (4, in order: top, right, bottom, left)</span>
          <RepeatableListEditor name="nodes" initialItems={nodes ?? []} emptyItem={{ label: '' }} fields={[{ key: 'label', label: 'Label' }]} />
        </div>
        <button type="submit" className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800">Save changes</button>
      </form>
    </div>
  )
}