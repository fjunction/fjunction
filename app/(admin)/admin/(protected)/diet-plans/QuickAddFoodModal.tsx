'use client'

import { useState } from 'react'
import { quickAddFood } from './actions'

type NewFood = {
  id: number
  name: string
  calories: number | null
  protein: number | null
  carbs: number | null
  fats: number | null
  sugar: number | null
  fiber: number | null
  quantity: number | null
  unit: string | null
  rich_in: string | null
}

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid var(--brand-border)',
  background: 'var(--brand-bg)',
  color: '#fff',
  width: '100%',
}
const labelStyle: React.CSSProperties = { fontSize: 12, color: '#ccc', marginBottom: 4, display: 'block' }

function imageUrl(path: string) {
  if (!path) return null
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${path}`
}

export function QuickAddFoodModal({ onCreated }: { onCreated: (food: NewFood) => void }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isVeg, setIsVeg] = useState(true)
  const [calories, setCalories] = useState<number | ''>('')
  const [protein, setProtein] = useState<number | ''>('')
  const [carbs, setCarbs] = useState<number | ''>('')
  const [fats, setFats] = useState<number | ''>('')
  const [sugar, setSugar] = useState<number | ''>('')
  const [fiber, setFiber] = useState<number | ''>('')
  const [quantity, setQuantity] = useState<number | ''>('')
  const [unit, setUnit] = useState('')
  const [richIn, setRichIn] = useState('')
  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)

  function reset() {
    setName('')
    setDescription('')
    setIsVeg(true)
    setCalories('')
    setProtein('')
    setCarbs('')
    setFats('')
    setSugar('')
    setFiber('')
    setQuantity('')
    setUnit('')
    setRichIn('')
    setImage('')
    setError(null)
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'blog_images')
      const res = await fetch('/api/upload-image', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setImage(data.path)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.set('name', name)
      fd.set('description', description)
      if (isVeg) fd.set('is_veg', 'on')
      fd.set('calories', String(calories || 0))
      fd.set('protein', String(protein || 0))
      fd.set('carbs', String(carbs || 0))
      fd.set('fats', String(fats || 0))
      fd.set('sugar', String(sugar || 0))
      fd.set('fiber', String(fiber || 0))
      fd.set('quantity', String(quantity || 0))
      fd.set('unit', unit)
      fd.set('rich_in', richIn)
      fd.set('image', image)

      const created = await quickAddFood(fd)
      onCreated(created as NewFood)
      setOpen(false)
      reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save food')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          padding: '6px 12px',
          borderRadius: 8,
          border: '1px solid var(--brand-border)',
          background: 'var(--brand-surface)',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 13,
        }}
      >
        + Quick Add Food
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
              width: 480,
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: 24,
              borderRadius: 12,
              background: 'var(--brand-surface)',
              border: '1px solid var(--brand-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Quick Add Food</h3>

            {error && <p style={{ color: '#f87171', fontSize: 13 }}>{error}</p>}

            <div>
              <label style={labelStyle}>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ccc', fontSize: 13 }}>
              <input type="checkbox" checked={isVeg} onChange={(e) => setIsVeg(e.target.checked)} />
              Vegetarian
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Calories</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value ? Number(e.target.value) : '')}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Protein (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value ? Number(e.target.value) : '')}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Carbs (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value ? Number(e.target.value) : '')}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Fats (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={fats}
                  onChange={(e) => setFats(e.target.value ? Number(e.target.value) : '')}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Sugar (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={sugar}
                  onChange={(e) => setSugar(e.target.value ? Number(e.target.value) : '')}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Fiber (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={fiber}
                  onChange={(e) => setFiber(e.target.value ? Number(e.target.value) : '')}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Unit (e.g. 100g)</label>
                <input value={unit} onChange={(e) => setUnit(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Rich In</label>
              <input value={richIn} onChange={(e) => setRichIn(e.target.value)} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Image</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl(image) ?? ''}
                    alt="Food"
                    width={44}
                    height={44}
                    style={{ borderRadius: 6, objectFit: 'cover' }}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ color: '#ccc', fontSize: 13 }}
                />
                {uploading && <span style={{ color: '#888', fontSize: 12 }}>Uploading…</span>}
              </div>
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
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--brand-gradient)',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Saving…' : 'Save Food'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}