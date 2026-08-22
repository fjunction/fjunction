'use client'

type Person = {
  name?: string
  email?: string | null
  phone?: string | null
  gender?: string | null
  age?: number | null
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

export function EditClientForm({ action, defaults }: { action: (formData: FormData) => void; defaults: Person }) {
  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={labelStyle}>Name</label>
        <input name="name" defaultValue={defaults.name} required style={inputStyle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Email</label>
          <input type="email" name="email" defaultValue={defaults.email ?? ''} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Phone</label>
          <input name="phone" defaultValue={defaults.phone ?? ''} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Gender</label>
          <select name="gender" defaultValue={defaults.gender ?? ''} style={inputStyle}>
            <option value="">Select…</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Age</label>
          <input type="number" name="age" defaultValue={defaults.age ?? ''} style={inputStyle} />
        </div>
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
        Save Changes
      </button>
    </form>
  )
}