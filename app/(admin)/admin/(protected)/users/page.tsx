import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const admin = createAdminClient()

  let query = admin.from('people').select('id, name, email, phone, is_client').order('name', { ascending: true })

  if (q) {
    query = query.ilike('name', `%${q}%`)
  }

  const { data: people, error } = await query

  if (error) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Error loading users</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </main>
    )
  }

  return (
    <main style={{ padding: 24, color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>User Management</h1>

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
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--brand-border)' }}>
            <th style={{ padding: '8px 12px', width: '30%' }}>Name</th>
            <th style={{ padding: '8px 12px', width: '25%' }}>Email</th>
            <th style={{ padding: '8px 12px', width: '15%' }}>Phone</th>
            <th style={{ padding: '8px 12px', width: '10%' }}>Status</th>
            <th style={{ padding: '8px 12px', width: '20%' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {(people ?? []).map((person) => (
            <tr key={person.id} style={{ borderBottom: '1px solid var(--brand-border)' }}>
              <td style={{ padding: '8px 12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {person.name}
              </td>
              <td style={{ padding: '8px 12px' }}>{person.email || '—'}</td>
              <td style={{ padding: '8px 12px' }}>{person.phone || '—'}</td>
              <td style={{ padding: '8px 12px' }}>
                {person.is_client ? (
                  <span style={{ color: 'var(--brand-yellow)' }}>Client</span>
                ) : (
                  <span style={{ color: '#888' }}>Not a client</span>
                )}
              </td>
              <td style={{ padding: '8px 12px' }}>
                {person.is_client ? (
                  <Link
                    href={`/admin/clients?q=${encodeURIComponent(person.name)}`}
                    style={{ color: 'var(--brand-yellow)' }}
                  >
                    View in Clients
                  </Link>
                ) : (
                  <Link
                    href={`/admin/users/${person.id}/convert`}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      background: 'var(--brand-gradient)',
                      color: '#fff',
                      fontWeight: 600,
                      textDecoration: 'none',
                      fontSize: 13,
                    }}
                  >
                    Convert to Client
                  </Link>
                )}
              </td>
            </tr>
          ))}
          {(people ?? []).length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: '16px 12px', color: '#888' }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  )
}