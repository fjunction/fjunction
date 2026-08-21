import { createAdminClient } from '@/lib/supabase/admin'
import { updatePlanType } from '../../actions'
import { PlanTypeFields } from '../../PlanTypeFields'

export default async function EditPlanTypePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: planType, error } = await admin.from('plan_types').select('*').eq('id', id).single()

  if (error || !planType) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Plan type not found</h1>
      </main>
    )
  }

  const updatePlanTypeWithId = updatePlanType.bind(null, planType.id)

  return (
    <main style={{ padding: 24, color: '#fff', maxWidth: 480 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Edit Plan Type</h1>
      <form action={updatePlanTypeWithId} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <PlanTypeFields defaults={planType} />
        <button
          type="submit"
          style={{
            marginTop: 8,
            padding: '10px 12px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--brand-gradient)',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Save Changes
        </button>
      </form>
    </main>
  )
}