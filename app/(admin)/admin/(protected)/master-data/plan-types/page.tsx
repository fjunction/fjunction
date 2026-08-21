import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { deletePlanType } from './actions'

export default async function PlanTypesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const admin = createAdminClient()

  let query = admin
    .from('plan_types')
    .select('id, name, price, default_duration_days, is_active')
    .order('name', { ascending: true })

  if (q) {
    query = query.ilike('name', `%${q}%`)
  }

  const { data: planTypes, error } = await query

  if (error) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Error loading plan types</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </main>
    )
  }

  return (
    <main style={{ padding: 24, color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Plan Types</h1>

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
            href="/admin/master-data/plan-types/new"
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
            + Add Plan Type
          </Link>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--brand-border)' }}>
            <th style={{ padding: '8px 12px' }}>Name</th>
            <th style={{ padding: '8px 12px' }}>Price</th>
            <th style={{ padding: '8px 12px' }}>Default Duration</th>
            <th style={{ padding: '8px 12px' }}>Status</th>
            <th style={{ padding: '8px 12px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {(planTypes ?? []).map((pt) => (
            <tr key={pt.id} style={{ borderBottom: '1px solid var(--brand-border)' }}>
              <td style={{ padding: '8px 12px' }}>{pt.name}</td>
              <td style={{ padding: '8px 12px' }}>{pt.price != null ? `₹${pt.price}` : '—'}</td>
              <td style={{ padding: '8px 12px' }}>
                {pt.default_duration_days != null ? `${pt.default_duration_days} days` : '—'}
              </td>
              <td style={{ padding: '8px 12px' }}>
                {pt.is_active ? (
                  <span style={{ color: 'var(--brand-yellow)' }}>Active</span>
                ) : (
                  <span style={{ color: '#888' }}>Inactive</span>
                )}
              </td>
              <td style={{ padding: '8px 12px', display: 'flex', gap: 12 }}>
                <Link href={`/admin/master-data/plan-types/${pt.id}/edit`} style={{ color: 'var(--brand-yellow)' }}>
                  Edit
                </Link>
                <form
                  action={async () => {
                    'use server'
                    await deletePlanType(pt.id)
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
          ))}
          {(planTypes ?? []).length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: '16px 12px', color: '#888' }}>
                No plan types found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  )
}