// app/(admin)/admin/content/header/page.tsx
import { createClient } from '@/lib/supabase/server'
import { updateHeader } from '@/lib/admin/content-actions'
import { RepeatableListEditor } from '@/components/admin/RepeatableListEditor'

export default async function HeaderContentPage() {
  const supabase = await createClient()
  const { data: header } = await supabase.from('site_header').select('*').single()

  return (
    <div className="mx-auto max-w-2xl bg-white px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Header</h1>

      <form action={updateHeader} className="mt-8 space-y-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Logo text</span>
          <input name="logo_text" defaultValue={header?.logo_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Logo image (optional — leave blank to keep current)</span>
          {header?.logo_image_url && (
            <img src={header.logo_image_url} alt="Current logo" className="mb-2 h-10 w-10 rounded-full object-cover" />
          )}
          <input type="file" name="logo_file" accept="image/*" className="text-sm" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">CTA button text</span>
          <input name="cta_text" defaultValue={header?.cta_text ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">CTA button link</span>
          <input name="cta_href" defaultValue={header?.cta_href ?? ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>

        <div>
          <span className="mb-2 block text-sm font-medium text-gray-700">Nav links</span>
          <RepeatableListEditor
            name="nav_items"
            initialItems={header?.nav_items ?? []}
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