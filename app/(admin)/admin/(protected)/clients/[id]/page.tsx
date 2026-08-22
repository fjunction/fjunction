import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { addClientNote } from './actions'

export default async function ClientDetailPage({
    params,
    searchParams,
  }: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ notice?: string }>
  }) {
    const { id } = await params
    const { notice } = await searchParams
    const admin = createAdminClient()

  const { data: person, error: personError } = await admin
    .from('people')
    .select('id, name, email, phone, gender, age, is_client, created_at')
    .eq('id', id)
    .single()

  if (personError || !person) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Client not found</h1>
      </main>
    )
  }

  const { data: plans } = await admin
    .from('plans')
    .select('id, plan_type_id, start_date, duration_days, is_active, plan_types(name)')
    .eq('person_id', id)
    .order('start_date', { ascending: false })

  const { data: dietPlans } = await admin
    .from('diet_plans')
    .select('id, week_number, choice_number, header, total_calories, created_at')
    .eq('person_id', id)
    .order('week_number', { ascending: false })
    .order('choice_number', { ascending: true })

  const { data: notes } = await admin
    .from('client_notes')
    .select('id, note, created_by, created_at')
    .eq('person_id', id)
    .order('created_at', { ascending: false })

  const addNoteAction = addClientNote.bind(null, person.id)
  const latestWeek = dietPlans && dietPlans.length > 0 ? dietPlans[0].week_number : 0

  return (
    <main style={{ padding: 24, color: '#fff' }}>
    {notice === 'duplicate_email' && (
      <div
        style={{
          padding: '10px 16px',
          borderRadius: 8,
          background: 'var(--brand-surface)',
          border: '1px solid var(--brand-yellow)',
          color: 'var(--brand-yellow)',
          marginBottom: 16,
        }}
      >
        That email already belonged to this person — showing their existing record instead of creating a duplicate.
      </div>
    )}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>{person.name}</h1>
          <p style={{ color: '#888', marginTop: 4 }}>
            {person.email || '—'} · {person.phone || '—'} · {person.gender || '—'}
            {person.age ? `, ${person.age} yrs` : ''}
          </p>
        </div>
        <Link
          href={`/admin/diet-plans/new?person_id=${person.id}`}
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            background: 'var(--brand-gradient)',
            color: '#fff',
            fontWeight: 600,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          + New Diet Plan
        </Link>
      </div>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#ccc' }}>Plan History</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--brand-border)' }}>
              <th style={{ padding: '6px 12px' }}>Plan Type</th>
              <th style={{ padding: '6px 12px' }}>Start Date</th>
              <th style={{ padding: '6px 12px' }}>Duration</th>
              <th style={{ padding: '6px 12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {(plans ?? []).map((plan: any) => (
              <tr key={plan.id} style={{ borderBottom: '1px solid var(--brand-border)' }}>
                <td style={{ padding: '6px 12px' }}>{plan.plan_types?.name ?? '—'}</td>
                <td style={{ padding: '6px 12px' }}>{plan.start_date}</td>
                <td style={{ padding: '6px 12px' }}>{plan.duration_days} days</td>
                <td style={{ padding: '6px 12px' }}>
                  {plan.is_active ? (
                    <span style={{ color: 'var(--brand-yellow)' }}>Active</span>
                  ) : (
                    <span style={{ color: '#888' }}>Inactive</span>
                  )}
                </td>
              </tr>
            ))}
            {(plans ?? []).length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '12px', color: '#888' }}>
                  No plans yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#ccc' }}>Diet Plans</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--brand-border)' }}>
              <th style={{ padding: '6px 12px' }}>Week</th>
              <th style={{ padding: '6px 12px' }}>Choice</th>
              <th style={{ padding: '6px 12px' }}>Header</th>
              <th style={{ padding: '6px 12px' }}>Calories</th>
              <th style={{ padding: '6px 12px' }}>Created</th>
              <th style={{ padding: '6px 12px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {(dietPlans ?? []).map((dp) => (
              <tr key={dp.id} style={{ borderBottom: '1px solid var(--brand-border)' }}>
                <td style={{ padding: '6px 12px' }}>{dp.week_number}</td>
                <td style={{ padding: '6px 12px' }}>{dp.choice_number}</td>
                <td style={{ padding: '6px 12px' }}>{dp.header || '—'}</td>
                <td style={{ padding: '6px 12px' }}>{dp.total_calories ?? '—'}</td>
                <td style={{ padding: '6px 12px' }}>{new Date(dp.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '6px 12px', display: 'flex', gap: 10 }}>
                  <Link href={`/admin/diet-plans/${dp.id}`} style={{ color: 'var(--brand-yellow)' }}>
                    View
                  </Link>
                  <Link
                    href={`/admin/diet-plans/new?clone_from=${dp.id}&person_id=${person.id}`}
                    style={{ color: 'var(--brand-yellow)' }}
                  >
                    Clone
                  </Link>
                </td>
              </tr>
            ))}
            {(dietPlans ?? []).length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '12px', color: '#888' }}>
                  No diet plans yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#ccc' }}>Discussion Notes</h2>

        <form action={addNoteAction} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <textarea
            name="note"
            required
            placeholder="Add a note…"
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid var(--brand-border)',
              background: 'var(--brand-surface)',
              color: '#fff',
              minHeight: 60,
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--brand-gradient)',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            Add Note
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(notes ?? []).map((n) => (
            <div
              key={n.id}
              style={{
                padding: 12,
                borderRadius: 8,
                background: 'var(--brand-surface)',
                border: '1px solid var(--brand-border)',
              }}
            >
              <p style={{ margin: 0 }}>{n.note}</p>
              <p style={{ margin: '6px 0 0', fontSize: 12, color: '#888' }}>
                {n.created_by ?? 'Unknown'} · {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
          ))}
          {(notes ?? []).length === 0 && <p style={{ color: '#888' }}>No notes yet.</p>}
        </div>
      </section>
    </main>
  )
}