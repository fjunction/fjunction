// app/(admin)/admin/content/signals/page.tsx
import { createClient } from '@/lib/supabase/server'
import { updateSignals } from '@/lib/admin/content-actions'
import { RepeatableListEditor } from '@/components/admin/RepeatableListEditor'

export default async function SignalsContentPage() {
  const supabase = await createClient()
  const [{ data: section }, { data: cards }] = await Promise.all([
    supabase.from('home_signals_section').select('*').single(),
    supabase.from('home_signal_cards').select('*').order('sort_order'),
  ])

  return (
    <div className="mx-auto max-w-2xl bg-white px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Recognize the Signals</h1>

      <form action={updateSignals} className="mt-8 space-y-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
          <input name="heading" defaultValue={section?.heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Subheading</span>
          <textarea name="subheading" defaultValue={section?.subheading ?? ''} rows={2} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>

        <div>
          <span className="mb-2 block text-sm font-medium text-gray-700">Cards</span>
          <RepeatableListEditor
            name="cards"
            initialItems={cards ?? []}
            emptyItem={{ icon_key: 'bed', title: '', description: '' }}
            fields={[
              { key: 'icon_key', label: 'Icon', type: 'select', options: ['bed', 'activity', 'hourglass'] },
              { key: 'title', label: 'Title' },
              { key: 'description', label: 'Description', type: 'textarea' },
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