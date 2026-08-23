import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { PLACE_LABELS, GOAL_LABELS, EXPERIENCE_LABELS } from '@/lib/workoutPlanLabels'

const PAGE_SIZE = 25

export default async function WorkoutPlansPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    plan_name?: string
    place?: string
    goal?: string
    experience?: string
    page?: string
  }>
}) {
  const sp = await searchParams
  const page = Math.max(1, Number(sp.page) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const admin = createAdminClient()

  let query = admin
    .from('workout_plans')
    .select('id, person_id, plan_name, total_days, place, goal, experience, created_at, people!inner(name)', {
      count: 'exact',
    })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (sp.q) query = query.ilike('people.name', `%${sp.q}%`)
  if (sp.plan_name) query = query.ilike('plan_name', `%${sp.plan_name}%`)
  if (sp.place) query = query.eq('place', Number(sp.place))
  if (sp.goal) query = query.eq('goal', Number(sp.goal))
  if (sp.experience) query = query.eq('experience', Number(sp.experience))

  const { data: workoutPlans, count, error } = await query

  if (error) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Error loading workout plans</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </main>
    )
  }

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1

  function pageHref(targetPage: number) {
    const params = new URLSearchParams()
    if (sp.q) params.set('q', sp.q)
    if (sp.plan_name) params.set('plan_name', sp.plan_name)
    if (sp.place) params.set('place', sp.place)
    if (sp.goal) params.set('goal', sp.goal)
    if (sp.experience) params.set('experience', sp.experience)
    params.set('page', String(targetPage))
    return `/admin/workout-plans?${params.toString()}`
  }

  const filterSelectStyle: React.CSSProperties = {
    padding: '6px 8px',
    borderRadius: 6,
    border: '1px solid var(--brand-border)',
    background: 'var(--brand-bg)',
    color: '#fff',
    fontSize: 12,
  }

  return (
    <main style={{ padding: 24, color: '#fff' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Workout Plan Management</h1>

      <form method="GET" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <input
            type="text"
            name="q"
            defaultValue={sp.q ?? ''}
            placeholder="Search by client name…"
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid var(--brand-border)',
              background: 'var(--brand-surface)',
              color: '#fff',
              width: 220,
            }}
          />
          <input
            type="text"
            name="plan_name"
            defaultValue={sp.plan_name ?? ''}
            placeholder="Search by plan name…"
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid var(--brand-border)',
              background: 'var(--brand-surface)',
              color: '#fff',
              width: 220,
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            padding: 12,
            borderRadius: 8,
            background: 'var(--brand-surface)',
            border: '1px solid var(--brand-border)',
            marginBottom: 12,
            alignItems: 'flex-end',
          }}
        >
          <div>
            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Place</label>
            <select name="place" defaultValue={sp.place ?? ''} style={filterSelectStyle}>
              <option value="">Any</option>
              <option value="1">Home</option>
              <option value="2">Gym</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Goal</label>
            <select name="goal" defaultValue={sp.goal ?? ''} style={filterSelectStyle}>
              <option value="">Any</option>
              <option value="1">Weight Loss</option>
              <option value="2">Muscle Gain</option>
              <option value="3">Strength</option>
              <option value="4">General Fitness / Endurance</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Experience</label>
            <select name="experience" defaultValue={sp.experience ?? ''} style={filterSelectStyle}>
              <option value="">Any</option>
              <option value="1">Basic</option>
              <option value="2">Intermediate</option>
              <option value="3">Advance</option>
            </select>
          </div>
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
              fontSize: 13,
            }}
          >
            Apply
          </button>
          <Link
            href="/admin/workout-plans"
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid var(--brand-border)',
              color: '#ccc',
              textDecoration: 'none',
              fontSize: 13,
            }}
          >
            Clear
          </Link>
        </div>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--brand-border)' }}>
            <th style={{ padding: '8px 12px' }}>Client</th>
            <th style={{ padding: '8px 12px' }}>Plan Name</th>
            <th style={{ padding: '8px 12px' }}>Total Days</th>
            <th style={{ padding: '8px 12px' }}>Place</th>
            <th style={{ padding: '8px 12px' }}>Goal</th>
            <th style={{ padding: '8px 12px' }}>Experience</th>
            <th style={{ padding: '8px 12px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {(workoutPlans ?? []).map((wp: any) => (
            <tr key={wp.id} style={{ borderBottom: '1px solid var(--brand-border)' }}>
              <td style={{ padding: '8px 12px' }}>{wp.people?.name ?? '—'}</td>
              <td style={{ padding: '8px 12px' }}>{wp.plan_name}</td>
              <td style={{ padding: '8px 12px' }}>{wp.total_days ?? '—'}</td>
              <td style={{ padding: '8px 12px' }}>{wp.place != null ? PLACE_LABELS[wp.place] : '—'}</td>
              <td style={{ padding: '8px 12px' }}>{wp.goal != null ? GOAL_LABELS[wp.goal] : '—'}</td>
              <td style={{ padding: '8px 12px' }}>{wp.experience != null ? EXPERIENCE_LABELS[wp.experience] : '—'}</td>
              <td style={{ padding: '8px 12px' }}>
                <Link href={`/admin/workout-plans/${wp.id}`} style={{ color: 'var(--brand-yellow)' }}>
                  View
                </Link>
              </td>
            </tr>
          ))}
          {(workoutPlans ?? []).length === 0 && (
            <tr>
              <td colSpan={7} style={{ padding: '16px 12px', color: '#888' }}>
                No workout plans found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
        <span style={{ color: '#888', fontSize: 13 }}>
          Page {page} of {totalPages} ({count ?? 0} total)
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {page > 1 && (
            <Link href={pageHref(page - 1)} style={{ color: 'var(--brand-yellow)' }}>
              ← Previous
            </Link>
          )}
          {page < totalPages && (
            <Link href={pageHref(page + 1)} style={{ color: 'var(--brand-yellow)' }}>
              Next →
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}