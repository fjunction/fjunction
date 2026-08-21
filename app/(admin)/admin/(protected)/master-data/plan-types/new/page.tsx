import { createPlanType } from '../actions'
import { PlanTypeFields } from '../PlanTypeFields'

export default function NewPlanTypePage() {
  return (
    <main style={{ padding: 24, color: '#fff', maxWidth: 480 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Add Plan Type</h1>
      <form action={createPlanType} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <PlanTypeFields />
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
          Save
        </button>
      </form>
    </main>
  )
}