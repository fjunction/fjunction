import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { deleteExercise } from './actions'

function exerciseImageUrl(path: string | null) {
  if (!path) return null
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`
}

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const admin = createAdminClient()

  let query = admin
    .from('exercises')
    .select('id, name, image, body_parts, muscles, levels, pursuits')
    .order('name', { ascending: true })

  if (q) {
    query = query.ilike('name', `%${q}%`)
  }

  const { data: exercises, error } = await query

  if (error) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Error loading exercises</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </main>
    )
  }

  return (
    <main style={{ padding: 24, color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Exercises</h1>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <form method="GET" style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              name="q"
              defaultValue={q ?? ''}
              placeholder="Search by name…"
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--brand-border)',
                background: 'var(--brand-surface)',
                color: '#fff',
                width: 220,
              }}
            />
            <button
              type="submit"
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: 'none',
                background: 'var(--brand-gradient)',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Search
            </button>
          </form>

          <Link
            href="/admin/master-data/exercises/new"
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              background: 'var(--brand-gradient)',
              color: '#fff',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            + Add Exercise
          </Link>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--brand-border)' }}>
            <th style={{ padding: '8px 12px', width: '30%' }}>Name</th>
            <th style={{ padding: '8px 12px', width: '20%' }}>Body Parts</th>
            <th style={{ padding: '8px 12px', width: '20%' }}>Muscles</th>
            <th style={{ padding: '8px 12px', width: '12%' }}>Level</th>
            <th style={{ padding: '8px 12px', width: '10%' }}>Pursuit</th>
            <th style={{ padding: '8px 12px', width: '8%' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {(exercises ?? []).map((ex) => {
            const imageUrl = exerciseImageUrl(ex.image)
            return (
              <tr key={ex.id} style={{ borderBottom: '1px solid var(--brand-border)' }}>
                <td style={{ padding: '8px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={ex.name ?? ''}
                        width={36}
                        height={36}
                        style={{ borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 6,
                          background: 'var(--brand-border)',
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ex.name}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '8px 12px' }}>{ex.body_parts}</td>
                <td style={{ padding: '8px 12px' }}>{ex.muscles}</td>
                <td style={{ padding: '8px 12px' }}>{ex.levels}</td>
                <td style={{ padding: '8px 12px' }}>{ex.pursuits}</td>
                <td style={{ padding: '8px 12px', display: 'flex', gap: 12 }}>
                  <Link href={`/admin/master-data/exercises/${ex.id}/edit`} style={{ color: 'var(--brand-yellow)' }}>
                    Edit
                  </Link>
                  <form
                    action={async () => {
                      'use server'
                      await deleteExercise(ex.id)
                    }}
                  >
                    <button
                      type="submit"
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 0 }}
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            )
          })}
          {(exercises ?? []).length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: '16px 12px', color: '#888' }}>
                No exercises found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  )
}