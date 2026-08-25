// app/(admin)/admin/(protected)/content/program-assessment/page.tsx
import { createClient } from '@/lib/supabase/server'
import { updateProgramAssessment } from '@/lib/admin/content-actions'
import { RepeatableListEditor } from '@/components/admin/RepeatableListEditor'

export default async function ProgramAssessmentContentPage() {
  const supabase = await createClient()
  const [{ data: page }, { data: steps }] = await Promise.all([
    supabase.from('program_assessment_page').select('*').single(),
    supabase.from('program_assessment_steps').select('*').order('sort_order'),
  ])

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Nutrition Clarity Strategy</h1>
      <p className="mt-1 text-sm text-gray-500">
        In body fields: a blank line starts a new paragraph, lines starting with "- " become bullets, and **text** becomes bold.
      </p>

      <form action={updateProgramAssessment} className="mt-8 space-y-10">
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
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Conducted by</span>
              <input name="conducted_by" defaultValue={page?.conducted_by ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Fee</span>
              <input name="fee_text" defaultValue={page?.fee_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Format</span>
              <input name="format_text" defaultValue={page?.format_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Timeline</span>
              <input name="timeline_text" defaultValue={page?.timeline_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </label>
          </div>
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
          <h2 className="text-lg font-semibold text-gray-900">About This Program</h2>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
            <input name="about_heading" defaultValue={page?.about_heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Body</span>
            <textarea name="about_body" defaultValue={page?.about_body ?? ''} rows={6} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Who This Program Is For</h2>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
            <input name="audience_heading" defaultValue={page?.audience_heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Body</span>
            <textarea name="audience_body" defaultValue={page?.audience_body ?? ''} rows={8} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Program Structure</h2>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Section heading</span>
            <input name="structure_heading" defaultValue={page?.structure_heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <RepeatableListEditor
            name="steps"
            initialItems={steps ?? []}
            emptyItem={{ step_number: '', title: '', duration_text: '', body_text: '' }}
            fields={[
              { key: 'step_number', label: 'Step number (e.g. 01)' },
              { key: 'title', label: 'Title' },
              { key: 'duration_text', label: 'Duration (optional, e.g. "30 to 40 minutes")' },
              { key: 'body_text', label: 'Body', type: 'textarea' },
            ]}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">What This Program Does Not Include</h2>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
            <input name="exclusions_heading" defaultValue={page?.exclusions_heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Body</span>
            <textarea name="exclusions_body" defaultValue={page?.exclusions_body ?? ''} rows={8} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Fee Box</h2>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Fee</span>
              <input name="pricing_fee_text" defaultValue={page?.pricing_fee_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Timeline</span>
              <input name="pricing_timeline_text" defaultValue={page?.pricing_timeline_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Includes (bullets)</span>
            <textarea name="pricing_includes_body" defaultValue={page?.pricing_includes_body ?? ''} rows={4} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Important Note</h2>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Heading</span>
            <input name="note_heading" defaultValue={page?.note_heading ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Body</span>
            <textarea name="note_body" defaultValue={page?.note_body ?? ''} rows={5} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
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