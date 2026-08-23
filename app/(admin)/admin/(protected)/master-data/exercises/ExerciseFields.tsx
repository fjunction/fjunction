'use client'

import { useRef, useState } from 'react'

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

function imageUrl(path: string | null) {
  if (!path) return null
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${path}`
}

function ImageUploadField({
  label,
  fieldName,
  initialPath,
}: {
  label: string
  fieldName: string
  initialPath: string
}) {
  const [path, setPath] = useState(initialPath)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const hiddenRef = useRef<HTMLInputElement>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'workout_images')
      const res = await fetch('/api/upload-image', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      setPath(data.path)
      if (hiddenRef.current) hiddenRef.current.value = data.path
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <input type="hidden" name={fieldName} ref={hiddenRef} defaultValue={initialPath} />
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {path && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl(path) ?? ''}
            alt={label}
            width={56}
            height={56}
            style={{ borderRadius: 8, objectFit: 'cover' }}
          />
        )}
        <input type="file" accept="image/*" onChange={handleChange} style={{ color: '#ccc' }} />
        {uploading && <span style={{ color: '#888', fontSize: 13 }}>Uploading…</span>}
      </div>
      {uploadError && <p style={{ color: '#f87171', fontSize: 13, marginTop: 4 }}>{uploadError}</p>}
    </div>
  )
}

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

      <ImageUploadField label="Exercise Image" fieldName="image" initialPath={defaults?.image ?? ''} />
      <ImageUploadField
        label="Muscle Diagram Image"
        fieldName="muscle_image"
        initialPath={defaults?.muscle_image ?? ''}
      />

      <div>
        <label style={labelStyle}>Video URL</label>
        <input name="video" defaultValue={defaults?.video ?? ''} style={inputStyle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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