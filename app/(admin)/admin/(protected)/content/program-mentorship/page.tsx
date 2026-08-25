// app/(admin)/admin/(protected)/content/program-mentorship/page.tsx
import { createClient } from '@/lib/supabase/server'
import { updateProgramMentorship } from '@/lib/admin/content-actions'
import { RepeatableListEditor } from '@/components/admin/RepeatableListEditor'

export default async function ProgramMentorshipContentPage() {
  const supabase = await createClient()
  const [{ data: page }, { data: benefits }, { data: pricingOptions }] = await Promise.all([
    supabase.from('program_mentorship_page').select('*').single(),
    supabase.from('program_mentorship_benefits').select('*').order('sort_order'),
    supabase.from('program_mentorship_pricing_options').select('*').order('sort_order'),
  ])

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Ultimate Health Mentorship</h1>
      <p className="mt-1 text-sm text-gray-500">
        In body fields: a blank line starts a new paragraph, lines starting with "- " become bullets, and **text** becomes bold.
      </p>

      <form action={updateProgramMentorship} className="mt-8 space-y-10">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Hero</h2>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Badge text</span>
            <input name="badge_text" defaultValue={page?.badge_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
            <input name="heading" defaultValue={page?.heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Subheading</span>
            <textarea name="subheading" defaultValue={page?.subheading ?? ''} rows={2} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Mentor name</span>
            <input name="mentor_name" defaultValue={page?.mentor_name ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Primary CTA text</span>
              <input name="primary_cta_text" defaultValue={page?.primary_cta_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Primary CTA link</span>
              <input name="primary_cta_href" defaultValue={page?.primary_cta_href ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Secondary CTA text</span>
              <input name="secondary_cta_text" defaultValue={page?.secondary_cta_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Secondary CTA link</span>
              <input name="secondary_cta_href" defaultValue={page?.secondary_cta_href ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">About</h2>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Body</span>
            <textarea name="about_body" defaultValue={page?.about_body ?? ''} rows={7} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">What You Get</h2>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
            <input name="benefits_heading" defaultValue={page?.benefits_heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <RepeatableListEditor
            name="benefits"
            initialItems={benefits ?? []}
            emptyItem={{ text: '' }}
            fields={[{ key: 'text', label: 'Benefit' }]}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Program Options</h2>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
            <input name="pricing_heading" defaultValue={page?.pricing_heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <RepeatableListEditor
            name="pricing_options"
            initialItems={pricingOptions ?? []}
            emptyItem={{ duration_label: '', diet_training_price: '', diet_only_price: '' }}
            fields={[
              { key: 'duration_label', label: 'Duration (e.g. "3 Months")' },
              { key: 'diet_training_price', label: 'Diet + Training price' },
              { key: 'diet_only_price', label: 'Diet Only price' },
            ]}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Important Note</h2>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
            <input name="note_heading" defaultValue={page?.note_heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Body</span>
            <textarea name="note_body" defaultValue={page?.note_body ?? ''} rows={4} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Closing CTA</h2>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
            <input name="cta_heading" defaultValue={page?.cta_heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Subheading</span>
            <textarea name="cta_subheading" defaultValue={page?.cta_subheading ?? ''} rows={2} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">CTA text</span>
              <input name="cta_text" defaultValue={page?.cta_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">CTA link</span>
              <input name="cta_href" defaultValue={page?.cta_href ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </label>
          </div>
        </section>

        <button type="submit" className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800">
          Save changes
        </button>
      </form>
    </div>
  )
}