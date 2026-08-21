type PlanType = {
    name?: string
    price?: number | null
    default_duration_days?: number | null
    description?: string | null
    is_active?: boolean
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
  
  export function PlanTypeFields({ defaults }: { defaults?: PlanType }) {
    return (
      <>
        <div>
          <label style={labelStyle}>Name</label>
          <input name="name" defaultValue={defaults?.name} required style={inputStyle} />
        </div>
  
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Price</label>
            <input type="number" step="0.01" name="price" defaultValue={defaults?.price ?? ''} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Default Duration (days)</label>
            <input
              type="number"
              name="default_duration_days"
              defaultValue={defaults?.default_duration_days ?? ''}
              style={inputStyle}
            />
          </div>
        </div>
  
        <div>
          <label style={labelStyle}>Description</label>
          <textarea name="description" defaultValue={defaults?.description ?? ''} style={inputStyle} />
        </div>
  
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ccc', fontSize: 13 }}>
          <input type="checkbox" name="is_active" defaultChecked={defaults?.is_active ?? true} />
          Active
        </label>
      </>
    )
  }