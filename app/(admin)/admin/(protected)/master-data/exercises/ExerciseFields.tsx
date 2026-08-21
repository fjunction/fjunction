type Exercise = {
    name?: string | null
    description?: string | null
    image?: string | null
    video?: string | null
    muscle_image?: string | null
    places?: string | null
    body_parts?: string | null
    muscles?: string | null
    secondary_muscles?: string | null
    levels?: string | null
    pursuits?: string | null
    motion?: string | null
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
  
  export function ExerciseFields({ defaults }: { defaults?: Exercise }) {
    return (
      <>
        <div>
          <label style={labelStyle}>Name</label>
          <input name="name" defaultValue={defaults?.name ?? ''} required style={inputStyle} />
        </div>
  
        <div>
          <label style={labelStyle}>Description</label>
          <textarea name="description" defaultValue={defaults?.description ?? ''} style={inputStyle} />
        </div>
  
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Image Path</label>
            <input name="image" defaultValue={defaults?.image ?? ''} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Video URL</label>
            <input name="video" defaultValue={defaults?.video ?? ''} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Muscle Diagram Image Path</label>
            <input name="muscle_image" defaultValue={defaults?.muscle_image ?? ''} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Places</label>
            <input name="places" defaultValue={defaults?.places ?? ''} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Body Parts</label>
            <input name="body_parts" defaultValue={defaults?.body_parts ?? ''} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Muscles</label>
            <input name="muscles" defaultValue={defaults?.muscles ?? ''} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Secondary Muscles</label>
            <input name="secondary_muscles" defaultValue={defaults?.secondary_muscles ?? ''} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Levels</label>
            <input name="levels" defaultValue={defaults?.levels ?? ''} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Pursuits</label>
            <input name="pursuits" defaultValue={defaults?.pursuits ?? ''} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Motion</label>
            <input name="motion" defaultValue={defaults?.motion ?? ''} style={inputStyle} />
          </div>
        </div>
      </>
    )
  }