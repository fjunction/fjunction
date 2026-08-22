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

type WorkoutPlan = {
  id: string
  plan_name: string | null
}

type Person = {
  id: string
  name: string
}

type MealItemState = {
  key: string
  food_id: number | null
  food_name_snapshot: string
  quantity: number | ''
}

type MealState = {
  key: string
  label: string
  items: MealItemState[]
}

type InitialData = {
  person_id?: string
  week_number?: number
  choice_number?: number
  total_calories?: number | null
  veg_type?: number | null
  diet_notes?: string
  workout_notes?: string
  workout_identifier?: string
  workout_plan_id?: string | null
  meals?: MealState[]
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
  return `k${keyCounter}`
}

export function DietPlanBuilder({
  action,
  people,
  foods,
  workoutPlans,
  lockedPersonId,
  initial,
}: {
  action: (formData: FormData) => void
  people: Person[]
  foods: Food[]
  workoutPlans: WorkoutPlan[]
  lockedPersonId?: string
  initial?: InitialData
}) {
  const [personId, setPersonId] = useState(initial?.person_id ?? lockedPersonId ?? '')
  const [weekNumber, setWeekNumber] = useState(initial?.week_number ?? 1)
  const [choiceNumber, setChoiceNumber] = useState(initial?.choice_number ?? 1)
  const [totalCalories, setTotalCalories] = useState<number | ''>(initial?.total_calories ?? '')
  const [vegType, setVegType] = useState<number | ''>(initial?.veg_type ?? '')
  const [dietNotes, setDietNotes] = useState(initial?.diet_notes ?? '')
  const [workoutNotes, setWorkoutNotes] = useState(initial?.workout_notes ?? '')
  const [workoutIdentifier, setWorkoutIdentifier] = useState(initial?.workout_identifier ?? '')
  const [workoutPlanId, setWorkoutPlanId] = useState(initial?.workout_plan_id ?? '')
  const [meals, setMeals] = useState<MealState[]>(
    initial?.meals && initial.meals.length > 0 ? initial.meals : [{ key: nextKey(), label: 'Breakfast', items: [] }]
  )

  const payloadRef = useRef<HTMLInputElement>(null)

  function addMeal() {
    setMeals((prev) => [...prev, { key: nextKey(), label: '', items: [] }])
  }

  function removeMeal(mealKey: string) {
    setMeals((prev) => prev.filter((m) => m.key !== mealKey))
  }

  function updateMealLabel(mealKey: string, label: string) {
    setMeals((prev) => prev.map((m) => (m.key === mealKey ? { ...m, label } : m)))
  }

  function addItem(mealKey: string) {
    setMeals((prev) =>
      prev.map((m) =>
        m.key === mealKey
          ? { ...m, items: [...m.items, { key: nextKey(), food_id: null, food_name_snapshot: '', quantity: '' }] }
          : m
      )
    )
  }

  function removeItem(mealKey: string, itemKey: string) {
    setMeals((prev) =>
      prev.map((m) => (m.key === mealKey ? { ...m, items: m.items.filter((it) => it.key !== itemKey) } : m))
    )
  }

  function updateItemFood(mealKey: string, itemKey: string, foodId: number) {
    const food = foods.find((f) => f.id === foodId)
    setMeals((prev) =>
      prev.map((m) =>
        m.key === mealKey
          ? {
              ...m,
              items: m.items.map((it) =>
                it.key === itemKey ? { ...it, food_id: foodId, food_name_snapshot: food?.name ?? '' } : it
              ),
            }
          : m
      )
    )
  }

  function updateItemQuantity(mealKey: string, itemKey: string, quantity: number | '') {
    setMeals((prev) =>
      prev.map((m) =>
        m.key === mealKey
          ? { ...m, items: m.items.map((it) => (it.key === itemKey ? { ...it, quantity } : it)) }
          : m
      )
    )
  }

  const totals = useMemo(() => {
    let calories = 0
    let carbs = 0
    let protein = 0
    let fats = 0
    let sugar = 0
    let fiber = 0

    for (const meal of meals) {
      for (const item of meal.items) {
        if (item.food_id == null || item.quantity === '') continue
        const food = foods.find((f) => f.id === item.food_id)
        if (!food) continue
        const macros = scaleFoodMacros(food, Number(item.quantity))
        calories += macros.calories ?? 0
        carbs += macros.carbs ?? 0
        protein += macros.protein ?? 0
        fats += macros.fats ?? 0
        sugar += macros.sugar ?? 0
        fiber += macros.fiber ?? 0
      }
    }

    return {
      calories: Math.round(calories),
      carbs: Math.round(carbs),
      protein: Math.round(protein),
      fats: Math.round(fats),
      sugar: Math.round(sugar),
      fiber: Math.round(fiber),
    }
  }, [meals, foods])

  function handleSubmit() {
    if (payloadRef.current) {
      payloadRef.current.value = JSON.stringify({
        person_id: personId,
        week_number: Number(weekNumber),
        choice_number: Number(choiceNumber),
        total_calories: totalCalories === '' ? null : Number(totalCalories),
        veg_type: vegType === '' ? null : Number(vegType),
        diet_notes: dietNotes,
        workout_notes: workoutNotes,
        workout_identifier: workoutIdentifier,
        workout_plan_id: workoutPlanId || null,
        meals: meals.map((m) => ({
          label: m.label,
          items: m.items.map((it) => ({
            food_id: it.food_id,
            food_name_snapshot: it.food_name_snapshot,
            quantity: it.quantity === '' ? null : Number(it.quantity),
          })),
        })),
      })
    }
  }

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <div style={{ flex: '1 1 65%', minWidth: 0 }}>
        <form action={action} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <input type="hidden" name="payload" ref={payloadRef} />

          {!lockedPersonId && (
            <div>
              <label style={labelStyle}>Client</label>
              <select value={personId} onChange={(e) => setPersonId(e.target.value)} required style={inputStyle}>
                <option value="" disabled>
                  Select a client…
                </option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Week Number</label>
              <input
                type="number"
                value={weekNumber}
                onChange={(e) => setWeekNumber(Number(e.target.value))}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Choice Number</label>
              <input
                type="number"
                value={choiceNumber}
                onChange={(e) => setChoiceNumber(Number(e.target.value))}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Total Calories</label>
              <input
                type="number"
                value={totalCalories}
                onChange={(e) => setTotalCalories(e.target.value ? Number(e.target.value) : '')}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Veg Type</label>
              <select
                value={vegType}
                onChange={(e) => setVegType(e.target.value ? Number(e.target.value) : '')}
                style={inputStyle}
              >
                <option value="">Not specified</option>
                <option value={0}>Veg</option>
                <option value={1}>Non-Veg</option>
                <option value={2}>Eggetarian</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Linked Workout Plan (optional)</label>
              <select value={workoutPlanId} onChange={(e) => setWorkoutPlanId(e.target.value)} style={inputStyle}>
                <option value="">None</option>
                {workoutPlans.map((wp) => (
                  <option key={wp.id} value={wp.id}>
                    {wp.plan_name ?? wp.id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Diet Notes</label>
            <textarea value={dietNotes} onChange={(e) => setDietNotes(e.target.value)} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Workout Notes</label>
            <textarea value={workoutNotes} onChange={(e) => setWorkoutNotes(e.target.value)} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Workout Identifier</label>
            <input
              value={workoutIdentifier}
              onChange={(e) => setWorkoutIdentifier(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ccc' }}>Meals</h2>
              <button
                type="button"
                onClick={addMeal}
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
                + Add Meal
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {meals.map((meal) => (
                <div
                  key={meal.key}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: 'var(--brand-surface)',
                    border: '1px solid var(--brand-border)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <input
                      value={meal.label}
                      onChange={(e) => updateMealLabel(meal.key, e.target.value)}
                      placeholder="Meal label (e.g. Breakfast)"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeMeal(meal.key)}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                    >
                      Remove Meal
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {meal.items.map((item) => {
                      const food = foods.find((f) => f.id === item.food_id)
                      const macros =
                        food && item.quantity !== '' ? scaleFoodMacros(food, Number(item.quantity)) : null

                      return (
                        <div key={item.key}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <select
                              value={item.food_id ?? ''}
                              onChange={(e) => updateItemFood(meal.key, item.key, Number(e.target.value))}
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
                              value={item.quantity}
                              onChange={(e) =>
                                updateItemQuantity(meal.key, item.key, e.target.value ? Number(e.target.value) : '')
                              }
                              style={{ ...inputStyle, flex: 1 }}
                            />
                            <button
                              type="button"
                              onClick={() => removeItem(meal.key, item.key)}
                              style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                            >
                              ✕
                            </button>
                          </div>
                          {macros && (
                            <div style={{ fontSize: 11, color: '#888', marginTop: 4, marginLeft: 4 }}>
                              Cal: {macros.calories ?? '—'} · C: {macros.carbs ?? '—'} · P: {macros.protein ?? '—'} ·
                              F: {macros.fats ?? '—'} · Sugar: {macros.sugar ?? '—'} · Fiber: {macros.fiber ?? '—'}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => addItem(meal.key)}
                    style={{
                      marginTop: 10,
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--brand-border)',
                      background: 'var(--brand-bg)',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: 13,
                    }}
                  >
                    + Add Food Item
                  </button>
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
            Save Diet Plan
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
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#fff' }}>Plan Totals</h3>
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