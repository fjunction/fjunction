// app/(admin)/admin/content/framework/page.tsx
import { createClient } from '@/lib/supabase/server'
import { updateFramework } from '@/lib/admin/content-actions'
import { RepeatableListEditor } from '@/components/admin/RepeatableListEditor'

export default async function FrameworkContentPage() {
  const supabase = await createClient()
  const [{ data: section }, { data: steps }] = await Promise.all([
    supabase.from('home_framework_section').select('*').single(),
    supabase.from('home_framework_steps').select('*').order('sort_order'),
  ])

  const initialSteps = (steps ?? []).map((step) => ({
    ...step,
    checklist_items: Array.isArray(step.checklist_items) ? step.checklist_items.join('\n') : '',
  }))

  return (
    <div className="mx-auto max-w-2xl bg-white px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Clinical Approach</h1>

      <form action={updateFramework} className="mt-8 space-y-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Eyebrow text</span>
          <input name="eyebrow_text" defaultValue={section?.eyebrow_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
          <input name="heading" defaultValue={section?.heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Subheading</span>
          <textarea name="subheading" defaultValue={section?.subheading ?? ''} rows={2} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>

        <div>
          <span className="mb-2 block text-sm font-medium text-gray-700">Steps</span>
          <RepeatableListEditor
            name="steps"
            initialItems={initialSteps}
            emptyItem={{ step_number: '', title: '', description: '', checklist_items: '' }}
            fields={[
              { key: 'step_number', label: 'Step number (e.g. 01)' },
              { key: 'title', label: 'Title' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'checklist_items', label: 'Checklist items (one per line)', type: 'textarea' },
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