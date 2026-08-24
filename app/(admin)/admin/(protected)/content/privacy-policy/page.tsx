// app/(admin)/admin/(protected)/content/privacy-policy/page.tsx
import { createClient } from '@/lib/supabase/server'
import { updatePrivacyPolicy } from '@/lib/admin/content-actions'
import { RepeatableListEditor } from '@/components/admin/RepeatableListEditor'

export default async function PrivacyPolicyContentPage() {
  const supabase = await createClient()
  const [{ data: page }, { data: sections }] = await Promise.all([
    supabase.from('privacy_policy_page').select('*').single(),
    supabase.from('privacy_policy_sections').select('*').order('sort_order'),
  ])

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="mt-1 text-sm text-gray-500">In each section body: a blank line starts a new paragraph, lines starting with "- " become bullets, and **text** becomes bold.</p>
      <form action={updatePrivacyPolicy} className="mt-8 space-y-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
          <input name="heading" defaultValue={page?.heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Effective date label</span>
          <input name="effective_date_label" defaultValue={page?.effective_date_label ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <RepeatableListEditor
          name="sections"
          initialItems={sections ?? []}
          emptyItem={{ number: '', title: '', body_text: '' }}
          fields={[
            { key: 'number', label: 'Number (e.g. 01)' },
            { key: 'title', label: 'Title' },
            { key: 'body_text', label: 'Body', type: 'textarea' },
          ]}
        />
        <button type="submit" className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800">Save changes</button>
      </form>
    </div>
  )
}