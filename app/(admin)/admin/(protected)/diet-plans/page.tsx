import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

const PAGE_SIZE = 25

function parseNum(value?: string) {
  if (!value) return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

export default async function DietPlansPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    page?: string
    calories_min?: string
    calories_max?: string
    carbs_min?: string
    carbs_max?: string
    fats_min?: string
    fats_max?: string
    protein_min?: string
    protein_max?: string
  }>
}) {
  const sp = await searchParams
  const page = Math.max(1, Number(sp.page) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const admin = createAdminClient()

  let query = admin
    .from('diet_plans')
    .select(
      'id, week_number, choice_number, total_calories, total_carbs, total_fats, total_protein, created_at, people!inner(name)',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false, nullsFirst: false })
    .range(from, to)

  if (sp.q) {
    query = query.ilike('people.name', `%${sp.q}%`)
  }

  const caloriesMin = parseNum(sp.calories_min)
  const caloriesMax = parseNum(sp.calories_max)
  const carbsMin = parseNum(sp.carbs_min)
  const carbsMax = parseNum(sp.carbs_max)
  const fatsMin = parseNum(sp.fats_min)
  const fatsMax = parseNum(sp.fats_max)
  const proteinMin = parseNum(sp.protein_min)
  const proteinMax = parseNum(sp.protein_max)

  if (caloriesMin != null) query = query.gte('total_calories', caloriesMin)
  if (caloriesMax != null) query = query.lte('total_calories', caloriesMax)
  if (carbsMin != null) query = query.gte('total_carbs', carbsMin)
  if (carbsMax != null) query = query.lte('total_carbs', carbsMax)
  if (fatsMin != null) query = query.gte('total_fats', fatsMin)
  if (fatsMax != null) query = query.lte('total_fats', fatsMax)
  if (proteinMin != null) query = query.gte('total_protein', proteinMin)
  if (proteinMax != null) query = query.lte('total_protein', proteinMax)

  const { data: dietPlans, count, error } = await query

  if (error) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Error loading diet plans</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </main>
    )
  }

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1

  function pageHref(targetPage: number) {
    const params = new URLSearchParams()
    if (sp.q) params.set('q', sp.q)
    if (sp.calories_min) params.set('calories_min', sp.calories_min)
    if (sp.calories_max) params.set('calories_max', sp.calories_max)
    if (sp.carbs_min) params.set('carbs_min', sp.carbs_min)
    if (sp.carbs_max) params.set('carbs_max', sp.carbs_max)
    if (sp.fats_min) params.set('fats_min', sp.fats_min)
    if (sp.fats_max) params.set('fats_max', sp.fats_max)
    if (sp.protein_min) params.set('protein_min', sp.protein_min)
    if (sp.protein_max) params.set('protein_max', sp.protein_max)
    params.set('page', String(targetPage))
    return `/admin/diet-plans?${params.toString()}`
  }

  const filterInputStyle: React.CSSProperties = {
    padding: '6px 8px',
    borderRadius: 6,
    border: '1px solid var(--brand-border)',
    background: 'var(--brand-bg)',
    color: '#fff',
    width: 80,
    fontSize: 12,
  }

  return (
    <main style={{ padding: 24, color: '#fff' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Diet Plan Management</h1>

      <form method="GET" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
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
              width: 260,
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
            padding: 12,
            borderRadius: 8,
            background: 'var(--brand-surface)',
            border: '1px solid var(--brand-border)',
            marginBottom: 12,
          }}
        >
          <div>
            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>
              Total Calories
            </label>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input type="number" name="calories_min" defaultValue={sp.calories_min ?? ''} placeholder="From" style={filterInputStyle} />
              <span style={{ color: '#888' }}>–</span>
              <input type="number" name="calories_max" defaultValue={sp.calories_max ?? ''} placeholder="To" style={filterInputStyle} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Carbs (g)</label>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input type="number" name="carbs_min" defaultValue={sp.carbs_min ?? ''} placeholder="From" style={filterInputStyle} />
              <span style={{ color: '#888' }}>–</span>
              <input type="number" name="carbs_max" defaultValue={sp.carbs_max ?? ''} placeholder="To" style={filterInputStyle} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Fats (g)</label>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input type="number" name="fats_min" defaultValue={sp.fats_min ?? ''} placeholder="From" style={filterInputStyle} />
              <span style={{ color: '#888' }}>–</span>
              <input type="number" name="fats_max" defaultValue={sp.fats_max ?? ''} placeholder="To" style={filterInputStyle} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Protein (g)</label>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input type="number" name="protein_min" defaultValue={sp.protein_min ?? ''} placeholder="From" style={filterInputStyle} />
              <span style={{ color: '#888' }}>–</span>
              <input type="number" name="protein_max" defaultValue={sp.protein_max ?? ''} placeholder="To" style={filterInputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
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
              href="/admin/diet-plans"
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
        </div>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--brand-border)' }}>
            <th style={{ padding: '8px 12px' }}>Client (Week / Option)</th>
            <th style={{ padding: '8px 12px' }}>Total Calories</th>
            <th style={{ padding: '8px 12px' }}>Carbs</th>
            <th style={{ padding: '8px 12px' }}>Fats</th>
            <th style={{ padding: '8px 12px' }}>Protein</th>
            <th style={{ padding: '8px 12px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {(dietPlans ?? []).map((dp: any) => (
            <tr key={dp.id} style={{ borderBottom: '1px solid var(--brand-border)' }}>
              <td style={{ padding: '8px 12px' }}>
                {dp.people?.name ?? '—'} (Week {dp.week_number}, Option {dp.choice_number})
              </td>
              <td style={{ padding: '8px 12px' }}>{dp.total_calories ?? '—'}</td>
              <td style={{ padding: '8px 12px' }}>{dp.total_carbs ?? '—'}</td>
              <td style={{ padding: '8px 12px' }}>{dp.total_fats ?? '—'}</td>
              <td style={{ padding: '8px 12px' }}>{dp.total_protein ?? '—'}</td>
              <td style={{ padding: '8px 12px' }}>
                <Link href={`/admin/diet-plans/${dp.id}`} style={{ color: 'var(--brand-yellow)' }}>
                  View
                </Link>
              </td>
            </tr>
          ))}
          {(dietPlans ?? []).length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: '16px 12px', color: '#888' }}>
                No diet plans found.
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