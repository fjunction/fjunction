// app/(admin)/admin/(protected)/content/how-it-works-steps/page.tsx
import { createClient } from '@/lib/supabase/server'
import { updateHowItWorksSteps } from '@/lib/admin/content-actions'
import { RepeatableListEditor } from '@/components/admin/RepeatableListEditor'

export default async function HowItWorksStepsContentPage() {
  const supabase = await createClient()
  const { data: steps } = await supabase.from('how_it_works_steps').select('*').order('sort_order')

  return (
    <div className="mx-auto max-w-2xl bg-white px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">How It Works — Steps</h1>
      <p className="mt-1 text-sm text-gray-500">
        Widget type controls the mini preview on each card: "status" (a single status line), "pattern" (a labeled box), "bars" (a priority list — one line per bar in Widget items), or "none".
      </p>
      <form action={updateHowItWorksSteps} className="mt-8 space-y-6">
        <RepeatableListEditor
          name="steps"
          initialItems={steps ?? []}
          emptyItem={{ step_number: '', icon_key: 'search', title: '', description: '', widget_type: 'none', widget_label: '', widget_items: '' }}
          fields={[
            { key: 'step_number', label: 'Step number (e.g. 01)' },
            { key: 'icon_key', label: 'Icon', type: 'select', options: ['search', 'share', 'filter', 'check'] },
            { key: 'title', label: 'Title' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'widget_type', label: 'Widget type', type: 'select', options: ['none', 'status', 'pattern', 'bars'] },
            { key: 'widget_label', label: 'Widget label (status/pattern)' },
            { key: 'widget_items', label: 'Widget items (bars — one per line)', type: 'textarea' },
          ]}
        />
        <button type="submit" className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800">Save changes</button>
      </form>
    </div>
  )
}