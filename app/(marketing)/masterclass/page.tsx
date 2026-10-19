// app/(marketing)/masterclass/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatEventDate } from '@/lib/masterclass'

export const metadata = { title: 'Masterclasses' }

type Row = { id: string; slug: string; title: string; eyebrow_text: string | null; subheading: string | null; event_at: string | null }

function MasterclassCard({ mc, past }: { mc: Row; past?: boolean }) {
  return (
    <Link
      href={`/masterclass/${mc.slug}`}
      className="block rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition hover:border-neutral-700"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-orange-500">
          {past ? 'Completed' : 'Upcoming'}
        </span>
        {mc.event_at && <span className="text-xs text-neutral-500">{formatEventDate(mc.event_at)}</span>}
      </div>
      <h3 className="mt-3 text-xl font-semibold text-white">{mc.title}</h3>
      {mc.subheading && <p className="mt-2 line-clamp-2 text-sm text-neutral-400">{mc.subheading}</p>}
    </Link>
  )
}

export default async function MasterclassIndexPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('masterclasses')
    .select('id, slug, title, eyebrow_text, subheading, event_at')
    .eq('is_published', true)

  if (error) console.error('[MasterclassIndexPage] error:', JSON.stringify(error))

  const rows = (data ?? []) as Row[]
  const now = Date.now()
  const upcoming = rows
    .filter((mc) => !mc.event_at || new Date(mc.event_at).getTime() >= now)
    .sort((a, b) => new Date(a.event_at ?? 0).getTime() - new Date(b.event_at ?? 0).getTime())
  const past = rows
    .filter((mc) => mc.event_at && new Date(mc.event_at).getTime() < now)
    .sort((a, b) => new Date(b.event_at!).getTime() - new Date(a.event_at!).getTime())

  return (
    <section className="bg-neutral-950 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wide text-orange-500">Live Sessions</span>
        <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Masterclasses</h1>
        <p className="mt-4 max-w-xl text-sm text-neutral-400">
          Deep-dive live sessions on the health topics people ask about most.
        </p>

        <h2 className="mt-12 text-lg font-semibold text-white">Upcoming</h2>
        <div className="mt-4 space-y-4">
          {upcoming.length > 0 ? (
            upcoming.map((mc) => <MasterclassCard key={mc.id} mc={mc} />)
          ) : (
            <p className="text-sm text-neutral-500">No upcoming masterclass right now — check back soon.</p>
          )}
        </div>

        {past.length > 0 && (
          <>
            <h2 className="mt-12 text-lg font-semibold text-white">Past masterclasses</h2>
            <div className="mt-4 space-y-4">
              {past.map((mc) => (
                <MasterclassCard key={mc.id} mc={mc} past />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}