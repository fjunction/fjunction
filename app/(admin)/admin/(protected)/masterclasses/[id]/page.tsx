// app/(admin)/admin/(protected)/masterclasses/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateMasterclass } from '@/lib/admin/masterclass-actions'
import { toIstInputValue, type Masterclass } from '@/lib/masterclass'
import { RepeatableListEditor } from '@/components/admin/RepeatableListEditor'

const INPUT = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm'

function TextField({ label, name, defaultValue, hint }: { label: string; name: string; defaultValue?: string | null; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <input name={name} defaultValue={defaultValue ?? ''} className={INPUT} />
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    </label>
  )
}

function TextArea({ label, name, defaultValue, rows = 3, hint }: { label: string; name: string; defaultValue?: string | null; rows?: number; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <textarea name={name} defaultValue={defaultValue ?? ''} rows={rows} className={INPUT} />
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    </label>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {children}
    </section>
  )
}

export default async function EditMasterclassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('masterclasses').select('*').eq('id', id).maybeSingle()
  if (!data) notFound()
  const mc = data as Masterclass & { id: string }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">{mc.title}</h1>
        <div className="flex gap-4 text-sm">
          <Link href={`/admin/masterclasses/${mc.id}/registrations`} className="underline">Registrations</Link>
          <Link href={`/masterclass/${mc.slug}`} target="_blank" className="underline">View page</Link>
          <Link href="/admin/masterclasses" className="underline">All masterclasses</Link>
        </div>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Fields marked "one per line" turn each line into a separate item on the page. Dates are in IST.
      </p>

      <form action={updateMasterclass} className="mt-8 space-y-10">
        <input type="hidden" name="id" value={mc.id} />

        <Section title="Settings">
          <TextField label="Title (used in lists and the browser tab)" name="title" defaultValue={mc.title} />
          <TextField label="URL slug" name="slug" defaultValue={mc.slug} hint="Changing this breaks links that were already shared." />
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="is_published" defaultChecked={mc.is_published} />
              Published (visible to the public)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="registration_open" defaultChecked={mc.registration_open} />
              Registration open (also closes automatically after the event time)
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Event date & time (IST)</span>
              <input type="datetime-local" name="event_at" defaultValue={toIstInputValue(mc.event_at)} className={INPUT} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Special pricing ends (IST)</span>
              <input type="datetime-local" name="pricing_ends_at" defaultValue={toIstInputValue(mc.pricing_ends_at)} className={INPUT} />
            </label>
          </div>
          <TextField label="Payment link" name="payment_url" defaultValue={mc.payment_url} hint="e.g. your Razorpay payment page URL. People are sent here after registering." />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">Price to charge in INR (₹)</span>
                <input type="number" step="0.01" min="0" name="price_inr" defaultValue={mc.price_inr ?? ''} className={INPUT} />
                <span className="mt-1 block text-xs text-gray-500">This is the amount actually charged. Leave empty to keep using the payment link.</span>
            </label>
            <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">Price in USD (optional)</span>
                <input type="number" step="0.01" min="0" name="price_usd" defaultValue={mc.price_usd ?? ''} className={INPUT} />
                <span className="mt-1 block text-xs text-gray-500">If set, visitors can choose "Outside India" and pay in USD.</span>
            </label>
            </div>
        </Section>

        <Section title="Top bar & hero">
          <TextField label="Top bar text" name="top_bar_text" defaultValue={mc.top_bar_text} />
          <TextField label="Eyebrow" name="eyebrow_text" defaultValue={mc.eyebrow_text} />
          <TextArea label="Heading" name="heading" defaultValue={mc.heading} />
          <TextField label="Heading highlight (amber second part)" name="heading_highlight" defaultValue={mc.heading_highlight} />
          <TextArea label="Subheading" name="subheading" defaultValue={mc.subheading} rows={4} />
          <TextArea label="Badges (one per line)" name="hero_badges" defaultValue={mc.hero_badges} />
          <TextField label="Register button text" name="cta_text" defaultValue={mc.cta_text} />
          <TextField label="Line under the button" name="hero_meta_text" defaultValue={mc.hero_meta_text} />
        </Section>

        <Section title="Problems (Does this sound like you?)">
          <TextField label="Heading" name="problems_heading" defaultValue={mc.problems_heading} />
          <TextArea label="Problems (one per line)" name="problems" defaultValue={mc.problems} rows={9} />
          <TextField label="Footer line" name="problems_footer" defaultValue={mc.problems_footer} />
        </Section>

        <Section title="Expert & testimonial">
          <TextField label="Label" name="expert_label" defaultValue={mc.expert_label} />
          <TextField label="Expert name" name="expert_name" defaultValue={mc.expert_name} />
          <TextArea label="Expert bio" name="expert_bio" defaultValue={mc.expert_bio} rows={4} />
          <TextArea label="Testimonial quote (leave empty to hide the card)" name="testimonial_quote" defaultValue={mc.testimonial_quote} rows={4} />
          <TextField label="Testimonial author" name="testimonial_author" defaultValue={mc.testimonial_author} />
        </Section>

        <Section title="What it covers">
          <TextField label="Heading" name="topics_heading" defaultValue={mc.topics_heading} />
          <RepeatableListEditor
            name="topics"
            initialItems={mc.topics ?? []}
            emptyItem={{ number: '', title: '', description: '' }}
            fields={[
              { key: 'number', label: 'Number (e.g. 01)' },
              { key: 'title', label: 'Title' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ]}
          />
        </Section>

        <Section title="Offer & pricing">
          <TextField label="Heading" name="offer_heading" defaultValue={mc.offer_heading} />
          <RepeatableListEditor
            name="offer_items"
            initialItems={mc.offer_items ?? []}
            emptyItem={{ label: '', value_text: '', kind: 'bonus' }}
            fields={[
              { key: 'label', label: 'Label' },
              { key: 'value_text', label: 'Value (e.g. ₹499 or Included)' },
              { key: 'kind', label: 'Type', type: 'select', options: ['main', 'bonus'] },
            ]}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField label="Total value" name="offer_total_value_text" defaultValue={mc.offer_total_value_text} />
            <TextField label="Your price" name="offer_price_text" defaultValue={mc.offer_price_text} />
            <TextField label="Savings text" name="offer_savings_text" defaultValue={mc.offer_savings_text} />
          </div>
          <TextField label="Note under the button" name="offer_note" defaultValue={mc.offer_note} />
        </Section>

        <Section title="Who it is / isn't for">
          <TextField label="'Not for you' heading" name="not_for_heading" defaultValue={mc.not_for_heading} />
          <TextArea label="'Not for you' items (one per line)" name="not_for_items" defaultValue={mc.not_for_items} rows={5} />
          <TextField label="'For you' heading" name="for_heading" defaultValue={mc.for_heading} />
          <TextArea label="'For you' items (one per line)" name="for_items" defaultValue={mc.for_items} rows={5} />
        </Section>

        <Section title="FAQ">
          <TextField label="Heading" name="faq_heading" defaultValue={mc.faq_heading} />
          <RepeatableListEditor
            name="faqs"
            initialItems={mc.faqs ?? []}
            emptyItem={{ question: '', answer: '' }}
            fields={[
              { key: 'question', label: 'Question' },
              { key: 'answer', label: 'Answer', type: 'textarea' },
            ]}
          />
        </Section>

        <Section title="Closing section">
          <TextArea label="Heading" name="closing_heading" defaultValue={mc.closing_heading} rows={3} />
          <TextField label="Sub-line" name="closing_subline" defaultValue={mc.closing_subline} />
          <TextField label="Total value / investment line" name="closing_total_line" defaultValue={mc.closing_total_line} />
          <TextArea label="Badges (one per line)" name="closing_badges" defaultValue={mc.closing_badges} />
        </Section>

        <button type="submit" className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800">
          Save changes
        </button>
      </form>
    </div>
  )
}