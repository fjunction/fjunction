import { createAdminClient } from '@/lib/supabase/admin'
import { DashboardCharts } from './DashboardCharts'

export const metadata = {
  title: 'Dashboard',
}

const CARD_STYLE: React.CSSProperties = {
  padding: 20,
  borderRadius: 12,
  background: 'var(--brand-surface)',
  border: '1px solid var(--brand-border)',
}

function isPlanActive(startDate: string | null, durationDays: number | null) {
  if (!startDate || durationDays == null) return false
  const start = new Date(startDate)
  const end = new Date(start)
  end.setDate(end.getDate() + durationDays)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return end >= today
}

export default async function AdminDashboardPage() {
  const admin = createAdminClient()

  const [
    { count: totalUsers },
    { count: totalClients },
    { count: totalDietPlans },
    { count: totalWorkoutPlans },
    { count: totalRecipes },
    { count: totalFoods },
    { count: totalExercises },
  ] = await Promise.all([
    admin.from('people').select('*', { count: 'exact', head: true }),
    admin.from('people').select('*', { count: 'exact', head: true }).eq('is_client', true),
    admin.from('diet_plans').select('*', { count: 'exact', head: true }),
    admin.from('workout_plans').select('*', { count: 'exact', head: true }),
    admin.from('recipes').select('*', { count: 'exact', head: true }),
    admin.from('foods').select('*', { count: 'exact', head: true }),
    admin.from('exercises').select('*', { count: 'exact', head: true }),
  ])

  const { data: allPlans } = await admin
    .from('plans')
    .select('person_id, plan_type_id, start_date, duration_days, created_at, plan_types(name)')

  const activePersonIds = new Set<string>()
  const planTypeCounts: Record<string, number> = {}

  for (const plan of allPlans ?? []) {
    const active = isPlanActive(plan.start_date, plan.duration_days)
    if (active) {
      activePersonIds.add(plan.person_id)
      const planTypeName = (plan as any).plan_types?.name ?? 'Unknown'
      planTypeCounts[planTypeName] = (planTypeCounts[planTypeName] ?? 0) + 1
    }
  }

  const activeClients = activePersonIds.size

  const now = new Date()
  const monthBuckets: { label: string; year: number; month: number; count: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    monthBuckets.push({
      label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      year: d.getFullYear(),
      month: d.getMonth(),
      count: 0,
    })
  }

  const firstPlanByPerson: Record<string, string> = {}
  for (const plan of allPlans ?? []) {
    const existing = firstPlanByPerson[plan.person_id]
    if (!existing || new Date(plan.created_at) < new Date(existing)) {
      firstPlanByPerson[plan.person_id] = plan.created_at
    }
  }

  for (const createdAt of Object.values(firstPlanByPerson)) {
    const d = new Date(createdAt)
    const bucket = monthBuckets.find((b) => b.year === d.getFullYear() && b.month === d.getMonth())
    if (bucket) bucket.count += 1
  }

  const [{ count: vegCount }, { count: nonVegCount }, { count: eggCount }] = await Promise.all([
    admin.from('diet_plans').select('*', { count: 'exact', head: true }).eq('veg_type', 0),
    admin.from('diet_plans').select('*', { count: 'exact', head: true }).eq('veg_type', 1),
    admin.from('diet_plans').select('*', { count: 'exact', head: true }).eq('veg_type', 2),
  ])

  const unspecifiedVegCount = Math.max(
    0,
    (totalDietPlans ?? 0) - (vegCount ?? 0) - (nonVegCount ?? 0) - (eggCount ?? 0)
  )

  const { data: assignments } = await admin.from('client_assignments').select('trainer_email')

  const trainerCounts: Record<string, number> = {}
  for (const a of assignments ?? []) {
    const email = a.trainer_email ?? 'Unassigned'
    trainerCounts[email] = (trainerCounts[email] ?? 0) + 1
  }

  return (
    <main style={{ padding: 24, color: '#fff' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Dashboard</h1>

      <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'center' }}>
        <div style={{ ...CARD_STYLE, flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>Total Users</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{totalUsers ?? 0}</div>
        </div>
        <div style={{ fontSize: 24, color: '#888' }}>→</div>
        <div style={{ ...CARD_STYLE, flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>Total Clients</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{totalClients ?? 0}</div>
        </div>
        <div style={{ fontSize: 24, color: '#888' }}>→</div>
        <div style={{ ...CARD_STYLE, flex: 1, textAlign: 'center', border: '1px solid var(--brand-yellow)' }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>Active Clients</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--brand-yellow)' }}>{activeClients}</div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          { label: 'Diet Plans', value: totalDietPlans ?? 0 },
          { label: 'Workout Plans', value: totalWorkoutPlans ?? 0 },
          { label: 'Recipes', value: totalRecipes ?? 0 },
          { label: 'Foods (Master Data)', value: totalFoods ?? 0 },
          { label: 'Exercises (Master Data)', value: totalExercises ?? 0 },
        ].map((card) => (
          <div key={card.label} style={CARD_STYLE}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>{card.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{card.value}</div>
          </div>
        ))}
      </div>

      <DashboardCharts
        newClientsByMonth={monthBuckets.map((b) => ({ label: b.label, count: b.count }))}
        planTypeCounts={Object.entries(planTypeCounts).map(([name, count]) => ({ name, count }))}
        vegTypeCounts={[
          { name: 'Veg', value: vegCount ?? 0 },
          { name: 'Non-Veg', value: nonVegCount ?? 0 },
          { name: 'Eggetarian', value: eggCount ?? 0 },
          { name: 'Unspecified', value: unspecifiedVegCount },
        ]}
        trainerCounts={Object.entries(trainerCounts).map(([email, count]) => ({ trainer: email, count }))}
      />
    </main>
  )
}
