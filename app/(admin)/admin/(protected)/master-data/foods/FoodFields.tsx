type Food = {
    name?: string
    description?: string | null
    is_veg?: boolean
    carbs?: number
    sugar?: number
    fiber?: number
    protein?: number
    fats?: number
    calories?: number
    unit?: string | null
    rich_in?: string | null
    image?: string | null
    quantity?: number
    rda?: number
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
  
  export function FoodFields({ defaults }: { defaults?: Food }) {
    return (
      <>
        <div>
          <label style={labelStyle}>Name</label>
          <input name="name" defaultValue={defaults?.name} required style={inputStyle} />
        </div>
  
        <div>
          <label style={labelStyle}>Description</label>
          <textarea name="description" defaultValue={defaults?.description ?? ''} style={inputStyle} />
        </div>
  
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ccc', fontSize: 13 }}>
          <input type="checkbox" name="is_veg" defaultChecked={defaults?.is_veg ?? true} />
          Vegetarian
        </label>
  
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Calories</label>
            <input type="number" name="calories" defaultValue={defaults?.calories} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Protein (g)</label>
            <input type="number" step="0.1" name="protein" defaultValue={defaults?.protein} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Carbs (g)</label>
            <input type="number" step="0.1" name="carbs" defaultValue={defaults?.carbs} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Fats (g)</label>
            <input type="number" step="0.1" name="fats" defaultValue={defaults?.fats} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Sugar (g)</label>
            <input type="number" step="0.1" name="sugar" defaultValue={defaults?.sugar} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Fiber (g)</label>
            <input type="number" step="0.1" name="fiber" defaultValue={defaults?.fiber} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Quantity</label>
            <input type="number" name="quantity" defaultValue={defaults?.quantity} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>RDA %</label>
            <input type="number" name="rda" defaultValue={defaults?.rda} style={inputStyle} />
          </div>
        </div>
  
        <div>
          <label style={labelStyle}>Unit (e.g. 100g, 1 cup)</label>
          <input name="unit" defaultValue={defaults?.unit ?? ''} style={inputStyle} />
        </div>
  
        <div>
          <label style={labelStyle}>Rich In</label>
          <input name="rich_in" defaultValue={defaults?.rich_in ?? ''} style={inputStyle} />
        </div>
  
        <div>
          <label style={labelStyle}>Image URL</label>
          <input name="image" defaultValue={defaults?.image ?? ''} style={inputStyle} />
        </div>
      </>
    )
  }