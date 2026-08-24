// app/(admin)/admin/content/footer/page.tsx
import { createClient } from '@/lib/supabase/server'
import { updateFooter } from '@/lib/admin/content-actions'
import { RepeatableListEditor } from '@/components/admin/RepeatableListEditor'

export default async function FooterContentPage() {
  const supabase = await createClient()
  const { data: footer } = await supabase.from('site_footer').select('*').single()

  return (
    <div className="mx-auto max-w-2xl bg-white px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Footer</h1>

      <form action={updateFooter} className="mt-8 space-y-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Logo text</span>
          <input name="logo_text" defaultValue={footer?.logo_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Disclaimer text</span>
          <textarea name="disclaimer_text" defaultValue={footer?.disclaimer_text ?? ''} rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>

        <div>
          <span className="mb-2 block text-sm font-medium text-gray-700">Links</span>
          <RepeatableListEditor
            name="links"
            initialItems={footer?.links ?? []}
            emptyItem={{ label: '', href: '' }}
            fields={[
              { key: 'label', label: 'Label' },
              { key: 'href', label: 'Link' },
            ]}
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-gray-700">Social links</span>
          <RepeatableListEditor
            name="socials"
            initialItems={footer?.socials ?? []}
            emptyItem={{ label: '', href: '' }}
            fields={[
              { key: 'label', label: 'Label' },
              { key: 'href', label: 'Link' },
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