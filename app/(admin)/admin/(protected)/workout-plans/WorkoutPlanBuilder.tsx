'use client'

import { useRef, useState } from 'react'

type Exercise = { id: number; name: string }
type Person = { id: string; name: string }

type ExerciseItemState = {
  key: string
  exercise_id: number | null
  exercise_name_snapshot: string
  sets: string
  reps: string
}

type DayState = {
  key: string
  day_title: string
  exercises: ExerciseItemState[]
}

type InitialData = {
  person_id?: string
  plan_name?: string
  total_days?: number | null
  place?: number | null
  goal?: number | null
  experience?: number | null
  workout_notes?: string
  remarks?: string
  image?: string
  days?: DayState[]
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
  return `wk${keyCounter}`
}

export function WorkoutPlanBuilder({
  action,
  people,
  exercises,
  lockedPersonId,
  initial,
}: {
  action: (formData: FormData) => void
  people: Person[]
  exercises: Exercise[]
  lockedPersonId?: string
  initial?: InitialData
}) {
  const [personId, setPersonId] = useState(initial?.person_id ?? lockedPersonId ?? '')
  const [planName, setPlanName] = useState(initial?.plan_name ?? '')
  const [totalDays, setTotalDays] = useState<number | ''>(initial?.total_days ?? '')
  const [place, setPlace] = useState<number | ''>(initial?.place ?? '')
  const [goal, setGoal] = useState<number | ''>(initial?.goal ?? '')
  const [experience, setExperience] = useState<number | ''>(initial?.experience ?? '')
  const [workoutNotes, setWorkoutNotes] = useState(initial?.workout_notes ?? '')
  const [remarks, setRemarks] = useState(initial?.remarks ?? '')
  const [image, setImage] = useState(initial?.image ?? '')
  const [days, setDays] = useState<DayState[]>(
    initial?.days && initial.days.length > 0 ? initial.days : [{ key: nextKey(), day_title: 'Day 1', exercises: [] }]
  )

  const payloadRef = useRef<HTMLInputElement>(null)

  function addDay() {
    setDays((prev) => [...prev, { key: nextKey(), day_title: `Day ${prev.length + 1}`, exercises: [] }])
  }

  function removeDay(dayKey: string) {
    setDays((prev) => prev.filter((d) => d.key !== dayKey))
  }

  function updateDayTitle(dayKey: string, title: string) {
    setDays((prev) => prev.map((d) => (d.key === dayKey ? { ...d, day_title: title } : d)))
  }

  function addExercise(dayKey: string) {
    setDays((prev) =>
      prev.map((d) =>
        d.key === dayKey
          ? {
              ...d,
              exercises: [
                ...d.exercises,
                { key: nextKey(), exercise_id: null, exercise_name_snapshot: '', sets: '', reps: '' },
              ],
            }
          : d
      )
    )
  }

  function removeExercise(dayKey: string, exKey: string) {
    setDays((prev) =>
      prev.map((d) => (d.key === dayKey ? { ...d, exercises: d.exercises.filter((ex) => ex.key !== exKey) } : d))
    )
  }

  function updateExerciseChoice(dayKey: string, exKey: string, exerciseId: number) {
    const exercise = exercises.find((e) => e.id === exerciseId)
    setDays((prev) =>
      prev.map((d) =>
        d.key === dayKey
          ? {
              ...d,
              exercises: d.exercises.map((ex) =>
                ex.key === exKey
                  ? { ...ex, exercise_id: exerciseId, exercise_name_snapshot: exercise?.name ?? '' }
                  : ex
              ),
            }
          : d
      )
    )
  }

  function updateExerciseField(dayKey: string, exKey: string, field: 'sets' | 'reps', value: string) {
    setDays((prev) =>
      prev.map((d) =>
        d.key === dayKey
          ? { ...d, exercises: d.exercises.map((ex) => (ex.key === exKey ? { ...ex, [field]: value } : ex)) }
          : d
      )
    )
  }

  function handleSubmit() {
    if (payloadRef.current) {
      payloadRef.current.value = JSON.stringify({
        person_id: personId,
        plan_name: planName,
        total_days: totalDays === '' ? null : Number(totalDays),
        place: place === '' ? null : Number(place),
        goal: goal === '' ? null : Number(goal),
        experience: experience === '' ? null : Number(experience),
        workout_notes: workoutNotes,
        remarks,
        image,
        days: days.map((d) => ({
          day_title: d.day_title,
          exercises: d.exercises.map((ex) => ({
            exercise_id: ex.exercise_id,
            exercise_name_snapshot: ex.exercise_name_snapshot,
            sets: ex.sets,
            reps: ex.reps,
          })),
        })),
      })
    }
  }

  return (
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

      <div>
        <label style={labelStyle}>Plan Name</label>
        <input value={planName} onChange={(e) => setPlanName(e.target.value)} required style={inputStyle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Total Days</label>
          <input
            type="number"
            value={totalDays}
            onChange={(e) => setTotalDays(e.target.value ? Number(e.target.value) : '')}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Place</label>
          <select value={place} onChange={(e) => setPlace(e.target.value ? Number(e.target.value) : '')} style={inputStyle}>
            <option value="">Not specified</option>
            <option value={0}>None</option>
            <option value={1}>Home</option>
            <option value={2}>Gym</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Goal</label>
          <select value={goal} onChange={(e) => setGoal(e.target.value ? Number(e.target.value) : '')} style={inputStyle}>
            <option value="">Not specified</option>
            <option value={0}>None</option>
            <option value={1}>Weight Loss</option>
            <option value={2}>Muscle Gain</option>
            <option value={3}>Strength</option>
            <option value={4}>General Fitness / Endurance</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Experience</label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value ? Number(e.target.value) : '')}
            style={inputStyle}
          >
            <option value="">Not specified</option>
            <option value={1}>Basic</option>
            <option value={2}>Intermediate</option>
            <option value={3}>Advance</option>
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Workout Notes</label>
        <textarea value={workoutNotes} onChange={(e) => setWorkoutNotes(e.target.value)} style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle}>Remarks</label>
        <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle}>Image Path</label>
        <input value={image} onChange={(e) => setImage(e.target.value)} style={inputStyle} />
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ccc' }}>Days</h2>
          <button
            type="button"
            onClick={addDay}
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
            + Add Day
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {days.map((day) => (
            <div
              key={day.key}
              style={{
                padding: 16,
                borderRadius: 12,
                background: 'var(--brand-surface)',
                border: '1px solid var(--brand-border)',
              }}
            >
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input
                  value={day.day_title}
                  onChange={(e) => updateDayTitle(day.key, e.target.value)}
                  placeholder="Day title (e.g. Push Day)"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => removeDay(day.key)}
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                >
                  Remove Day
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {day.exercises.map((ex) => (
                  <div key={ex.key} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <select
                      value={ex.exercise_id ?? ''}
                      onChange={(e) => updateExerciseChoice(day.key, ex.key, Number(e.target.value))}
                      style={{ ...inputStyle, flex: 2 }}
                    >
                      <option value="" disabled>
                        Select an exercise…
                      </option>
                      {exercises.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                    <input
                      placeholder="Sets"
                      value={ex.sets}
                      onChange={(e) => updateExerciseField(day.key, ex.key, 'sets', e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <input
                      placeholder="Reps"
                      value={ex.reps}
                      onChange={(e) => updateExerciseField(day.key, ex.key, 'reps', e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeExercise(day.key, ex.key)}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addExercise(day.key)}
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
                + Add Exercise
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
        Save Workout Plan
      </button>
    </form>
  )
}