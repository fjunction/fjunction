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

export function RenewPlanModal({
  action,
  planTypes,
}: {
  action: (formData: FormData) => void
  planTypes: PlanType[]
}) {
  const [open, setOpen] = useState(false)
  const [duration, setDuration] = useState<number | ''>('')

  function handlePlanTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = planTypes.find((pt) => pt.id === e.target.value)
    if (selected?.default_duration_days != null) {
      setDuration(selected.default_duration_days)
    }
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          padding: '10px 16px',
          borderRadius: 8,
          border: '1px solid var(--brand-border)',
          background: 'none',
          color: '#fff',
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Renew Plan
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 380,
              padding: 24,
              borderRadius: 12,
              background: 'var(--brand-surface)',
              border: '1px solid var(--brand-border)',
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#fff' }}>Renew Plan</h3>

            <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={labelStyle}>Plan Type</label>
                <select
                  name="plan_type_id"
                  required
                  onChange={handlePlanTypeChange}
                  defaultValue=""
                  style={inputStyle}
                >
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

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--brand-border)',
                    background: 'none',
                    color: '#ccc',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
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
                  Renew
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}