'use client'

import { useState } from 'react'

type PlanType = {
  id: string
  name: string
  price: number | null
  default_duration_days: number | null
}

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid var(--brand-border)',
  background: 'var(--brand-bg)',
  color: '#fff',
  width: '100%',
}

const labelStyle: React.CSSProperties = { fontSize: 13, color: '#ccc', marginBottom: 4, display: 'block' }

export function RenewPlanForm({
  action,
  planTypes,
}: {
  action: (formData: FormData) => void
  planTypes: PlanType[]
}) {
  const [duration, setDuration] = useState<number | ''>('')

  function handlePlanTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = planTypes.find((pt) => pt.id === e.target.value)
    if (selected?.default_duration_days != null) {
      setDuration(selected.default_duration_days)
    }
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={labelStyle}>Plan Type</label>
        <select name="plan_type_id" required onChange={handlePlanTypeChange} defaultValue="" style={inputStyle}>
          <option value="" disabled>
            Select a plan type…
          </option>
          {planTypes.map((pt) => (
            <option key={pt.id} value={pt.id}>
              {pt.name}
              {pt.price != null ? ` — ₹${pt.price}` : ''}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Start Date</label>
        <input type="date" name="start_date" defaultValue={today} required style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle}>Duration (days)</label>
        <input
          type="number"
          name="duration_days"
          value={duration}
          onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : '')}
          required
          style={inputStyle}
        />
      </div>

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
        Add Renewal Plan
      </button>
    </form>
  )
}