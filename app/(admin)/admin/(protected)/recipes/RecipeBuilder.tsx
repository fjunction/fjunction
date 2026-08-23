'use client'

import { useMemo, useRef, useState } from 'react'
import { scaleFoodMacros } from '@/lib/dietPlanMacros'

type Food = {
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

type IngredientState = {
  key: string
  food_id: number | null
  ingredient: string
  quantity: number | ''
}

type StepState = { key: string; instruction: string; image: string }

type InitialData = {
  name?: string
  image?: string
  ingredients?: IngredientState[]
  steps?: StepState[]
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

let keyCounter = 0
function nextKey() {
  keyCounter += 1
  return `rk${keyCounter}`
}

function imageUrl(path: string) {
  if (!path) return null
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${path}`
}

async function uploadImage(file: File, folder: string): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('folder', folder)
  const res = await fetch('/api/upload-image', { method: 'POST', body: fd })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Upload failed')
  return data.path as string
}

export function RecipeBuilder({
  action,
  foods,
  initial,
}: {
  action: (formData: FormData) => void
  foods: Food[]
  initial?: InitialData
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [image, setImage] = useState(initial?.image ?? '')
  const [uploadingMain, setUploadingMain] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [ingredients, setIngredients] = useState<IngredientState[]>(
    initial?.ingredients && initial.ingredients.length > 0
      ? initial.ingredients
      : [{ key: nextKey(), food_id: null, ingredient: '', quantity: '' }]
  )
  const [steps, setSteps] = useState<StepState[]>(
    initial?.steps && initial.steps.length > 0 ? initial.steps : [{ key: nextKey(), instruction: '', image: '' }]
  )
  const [uploadingStepKey, setUploadingStepKey] = useState<string | null>(null)

  const payloadRef = useRef<HTMLInputElement>(null)

  async function handleMainImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)
    setUploadingMain(true)
    try {
      const path = await uploadImage(file, 'recipe-images')
      setImage(path)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploadingMain(false)
      e.target.value = ''
    }
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, { key: nextKey(), food_id: null, ingredient: '', quantity: '' }])
  }
  function removeIngredient(key: string) {
    setIngredients((prev) => prev.filter((i) => i.key !== key))
  }
  function updateIngredientFood(key: string, foodId: number) {
    const food = foods.find((f) => f.id === foodId)
    setIngredients((prev) =>
      prev.map((i) => (i.key === key ? { ...i, food_id: foodId, ingredient: food?.name ?? '' } : i))
    )
  }
  function updateIngredientQuantity(key: string, quantity: number | '') {
    setIngredients((prev) => prev.map((i) => (i.key === key ? { ...i, quantity } : i)))
  }

  function addStep() {
    setSteps((prev) => [...prev, { key: nextKey(), instruction: '', image: '' }])
  }
  function removeStep(key: string) {
    setSteps((prev) => prev.filter((s) => s.key !== key))
  }
  function updateStepField(key: string, field: 'instruction' | 'image', value: string) {
    setSteps((prev) => prev.map((s) => (s.key === key ? { ...s, [field]: value } : s)))
  }

  async function handleStepImageChange(stepKey: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)
    setUploadingStepKey(stepKey)
    try {
      const path = await uploadImage(file, 'recipe-images')
      updateStepField(stepKey, 'image', path)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploadingStepKey(null)
      e.target.value = ''
    }
  }

  const totals = useMemo(() => {
    let calories = 0
    let carbs = 0
    let protein = 0
    let fats = 0
    let sugar = 0
    let fiber = 0

    for (const ing of ingredients) {
      if (ing.food_id == null || ing.quantity === '') continue
      const food = foods.find((f) => f.id === ing.food_id)
      if (!food) continue
      const macros = scaleFoodMacros(food, Number(ing.quantity))
      calories += macros.calories ?? 0
      carbs += macros.carbs ?? 0
      protein += macros.protein ?? 0
      fats += macros.fats ?? 0
      sugar += macros.sugar ?? 0
      fiber += macros.fiber ?? 0
    }

    return {
      calories: Math.round(calories),
      carbs: Math.round(carbs),
      protein: Math.round(protein),
      fats: Math.round(fats),
      sugar: Math.round(sugar),
      fiber: Math.round(fiber),
    }
  }, [ingredients, foods])

  function handleSubmit() {
    if (payloadRef.current) {
      payloadRef.current.value = JSON.stringify({
        name,
        image,
        ingredients: ingredients.map((i) => ({
          food_id: i.food_id,
          ingredient: i.ingredient,
          quantity: i.quantity === '' ? null : Number(i.quantity),
        })),
        steps: steps.map((s) => ({ instruction: s.instruction, image: s.image })),
      })
    }
  }

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <div style={{ flex: '1 1 65%', minWidth: 0 }}>
        <form action={action} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <input type="hidden" name="payload" ref={payloadRef} />

          <div>
            <label style={labelStyle}>Recipe Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Recipe Image</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl(image) ?? ''}
                  alt="Recipe"
                  width={56}
                  height={56}
                  style={{ borderRadius: 8, objectFit: 'cover' }}
                />
              )}
              <input type="file" accept="image/*" onChange={handleMainImageChange} style={{ color: '#ccc' }} />
              {uploadingMain && <span style={{ color: '#888', fontSize: 13 }}>Uploading…</span>}
            </div>
          </div>

          {uploadError && <p style={{ color: '#f87171', fontSize: 13 }}>{uploadError}</p>}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ccc' }}>Ingredients</h2>
              <button
                type="button"
                onClick={addIngredient}
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
                + Add Ingredient
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ingredients.map((ing) => {
                const food = foods.find((f) => f.id === ing.food_id)
                const macros = food && ing.quantity !== '' ? scaleFoodMacros(food, Number(ing.quantity)) : null

                return (
                  <div key={ing.key}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <select
                        value={ing.food_id ?? ''}
                        onChange={(e) => updateIngredientFood(ing.key, Number(e.target.value))}
                        style={{ ...inputStyle, flex: 2 }}
                      >
                        <option value="" disabled>
                          Select a food…
                        </option>
                        {foods.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name} {f.unit ? `(${f.unit})` : ''}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Qty"
                        value={ing.quantity}
                        onChange={(e) => updateIngredientQuantity(ing.key, e.target.value ? Number(e.target.value) : '')}
                        style={{ ...inputStyle, flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => removeIngredient(ing.key)}
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                    {macros && (
                      <div style={{ fontSize: 11, color: '#888', marginTop: 4, marginLeft: 4 }}>
                        Cal: {macros.calories ?? '—'} · C: {macros.carbs ?? '—'} · P: {macros.protein ?? '—'} · F:{' '}
                        {macros.fats ?? '—'} · Sugar: {macros.sugar ?? '—'} · Fiber: {macros.fiber ?? '—'}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ccc' }}>Steps</h2>
              <button
                type="button"
                onClick={addStep}
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
                + Add Step
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {steps.map((step, idx) => (
                <div
                  key={step.key}
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: 'var(--brand-surface)',
                    border: '1px solid var(--brand-border)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: '#888', fontSize: 13, marginTop: 8 }}>{idx + 1}.</span>
                    <textarea
                      value={step.instruction}
                      onChange={(e) => updateStepField(step.key, 'instruction', e.target.value)}
                      placeholder="Instruction"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeStep(step.key)}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginLeft: 24 }}>
                    {step.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl(step.image) ?? ''}
                        alt={`Step ${idx + 1}`}
                        width={48}
                        height={48}
                        style={{ borderRadius: 6, objectFit: 'cover' }}
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleStepImageChange(step.key, e)}
                      style={{ color: '#ccc', fontSize: 13 }}
                    />
                    {uploadingStepKey === step.key && <span style={{ color: '#888', fontSize: 13 }}>Uploading…</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--brand-gradient)',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save Recipe
          </button>
        </form>
      </div>

      <div style={{ flex: '1 1 30%', position: 'sticky', top: 16 }}>
        <div
          style={{
            padding: 16,
            borderRadius: 12,
            background: 'var(--brand-surface)',
            border: '1px solid var(--brand-yellow)',
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#fff' }}>Recipe Totals</h3>
          {[
            { label: 'Calories', value: totals.calories, unit: 'kcal' },
            { label: 'Carbs', value: totals.carbs, unit: 'g' },
            { label: 'Protein', value: totals.protein, unit: 'g' },
            { label: 'Fats', value: totals.fats, unit: 'g' },
            { label: 'Sugar', value: totals.sugar, unit: 'g' },
            { label: 'Fiber', value: totals.fiber, unit: 'g' },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: '1px solid var(--brand-border)',
              }}
            >
              <span style={{ color: '#ccc', fontSize: 13 }}>{row.label}</span>
              <span style={{ fontWeight: 600 }}>
                {row.value} {row.unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}