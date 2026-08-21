import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

function isAdminEmail(email: string | null | undefined) {
  if (!email) return false
  const admins = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return admins.includes(email.toLowerCase())
}

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const admin = createAdminClient()
  const isOwner = isAdminEmail(user?.email)

  let personIds: string[] | null = null

  if (!isOwner) {
    const { data: assignments, error: assignmentsError } = await admin
      .from('client_assignments')
      .select('person_id')
      .eq('trainer_email', user?.email ?? '')

    if (assignmentsError) {
      return (
        <main style={{ padding: 24 }}>
          <h1>Error loading assignments</h1>
          <pre>{assignmentsError.message}</pre>
        </main>
      )
    }

    personIds = (assignments ?? []).map((a) => a.person_id)

    if (personIds.length === 0) {
      return (
        <main style={{ padding: 24, color: '#fff', background: 'var(--brand-bg)', minHeight: '100vh' }}>
          <h1>Clients</h1>
          <p>No clients are assigned to you yet.</p>
        </main>
      )
    }
  }

  let clientsQuery = admin
    .from('people')
    .select('id, name, email, phone')
    .eq('is_client', true)
    .order('name', { ascending: true })

  if (personIds) {
    clientsQuery = clientsQuery.in('id', personIds)
  }

  if (q) {
    clientsQuery = clientsQuery.ilike('name', `%${q}%`)
  }

  const { data: clients, error: clientsError } = await clientsQuery

  if (clientsError) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Error loading clients</h1>
        <pre>{clientsError.message}</pre>
      </main>
    )
  }

  const clientIds = (clients ?? []).map((c) => c.id)

  const plansByPerson: Record<string, { count: number; lastDate: string | null; active: boolean }> = {}

  if (clientIds.length > 0) {
    const { data: plans, error: plansError } = await admin
    .from('plans')
    .select('person_id, start_date, is_active')
    .order('start_date', { ascending: false })

      if (plansError) {
        return (
          <main style={{ padding: 24 }}>
            <h1>Error loading plans</h1>
            <pre>{JSON.stringify(plansError, null, 2)}</pre>
          </main>
        )
      }

    for (const plan of plans ?? []) {
      const entry = plansByPerson[plan.person_id] ?? {
        count: 0,
        lastDate: null,
        active: false,
      }
      entry.count += 1
      if (!entry.lastDate) entry.lastDate = plan.start_date
      if (plan.is_active) entry.active = true
      plansByPerson[plan.person_id] = entry
    }
  }

  return (
    <main style={{ padding: 24, color: '#fff', background: 'var(--brand-bg)', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Clients</h1>

      <form method="GET" style={{ marginBottom: 20 }}>
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
            width: 280,
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: 8,
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

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--brand-border)' }}>
            <th style={{ padding: '8px 12px' }}>Name</th>
            <th style={{ padding: '8px 12px' }}>Contact</th>
            <th style={{ padding: '8px 12px' }}>Active Plan</th>
            <th style={{ padding: '8px 12px' }}>Plan Count</th>
            <th style={{ padding: '8px 12px' }}>Last Plan Date</th>
          </tr>
        </thead>
        <tbody>
          {(clients ?? []).map((client) => {
            const planInfo = plansByPerson[client.id] ?? {
              count: 0,
              lastDate: null,
              active: false,
            }
            return (
              <tr key={client.id} style={{ borderBottom: '1px solid var(--brand-border)' }}>
                <td style={{ padding: '8px 12px' }}>{client.name}</td>
                <td style={{ padding: '8px 12px' }}>{client.phone || client.email || '—'}</td>
                <td style={{ padding: '8px 12px' }}>
                  {planInfo.active ? (
                    <span style={{ color: 'var(--brand-yellow)' }}>Active</span>
                  ) : (
                    <span style={{ color: '#888' }}>Inactive</span>
                  )}
                </td>
                <td style={{ padding: '8px 12px' }}>{planInfo.count}</td>
                <td style={{ padding: '8px 12px' }}>
                  {planInfo.lastDate ? new Date(planInfo.lastDate).toLocaleDateString() : '—'}
                </td>
              </tr>
            )
          })}
          {(clients ?? []).length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: '16px 12px', color: '#888' }}>
                No clients found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  )
}