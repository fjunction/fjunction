import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { deleteWorkoutPlan } from '../actions'
import { PLACE_LABELS, GOAL_LABELS, EXPERIENCE_LABELS } from '@/lib/workoutPlanLabels'

export default async function WorkoutPlanViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: workoutPlan, error } = await admin
    .from('workout_plans')
    .select(
      'id, person_id, plan_name, total_days, place, goal, experience, workout_notes, remarks, created_at, people(name)'
    )
    .eq('id', id)
    .single()

  if (error || !workoutPlan) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Workout plan not found</h1>
      </main>
    )
  }

  const { data: daysRaw } = await admin
    .from('workout_plan_days')
    .select('id, day_number, day_title')
    .eq('workout_plan_id', id)
    .order('day_number', { ascending: true })

  const daysWithExercises = []
  for (const day of daysRaw ?? []) {
    const { data: exs } = await admin
      .from('workout_plan_exercises')
      .select('exercise_name_snapshot, sets, reps, sort_order')
      .eq('workout_plan_day_id', day.id)
      .order('sort_order', { ascending: true })

    daysWithExercises.push({ id: day.id, day_title: day.day_title, exercises: exs ?? [] })
  }

  const person = (workoutPlan as any).people
  const deleteAction = deleteWorkoutPlan.bind(null, workoutPlan.id, workoutPlan.person_id)

  return (
    <main style={{ padding: 24, color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>{workoutPlan.plan_name}</h1>
          <p style={{ color: '#888', marginTop: 4 }}>
            {person?.name ?? ''}
            {workoutPlan.total_days ? ` · ${workoutPlan.total_days} days` : ''}
            {workoutPlan.place != null ? ` · ${PLACE_LABELS[workoutPlan.place] ?? ''}` : ''}
            {workoutPlan.goal != null ? ` · ${GOAL_LABELS[workoutPlan.goal] ?? ''}` : ''}
            {workoutPlan.experience != null ? ` · ${EXPERIENCE_LABELS[workoutPlan.experience] ?? ''}` : ''}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          
          <a  href={`/admin/workout-plans/${workoutPlan.id}/pdf`}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              background: 'var(--brand-gradient)',
              color: '#fff',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: 13,
            }}
          >
            Download PDF
          </a>
          <Link
            href={`/admin/workout-plans/${workoutPlan.id}/edit`}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid var(--brand-border)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: 13,
            }}
          >
            Edit
          </Link>
          <Link
            href={`/admin/workout-plans/new?clone_from=${workoutPlan.id}`}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid var(--brand-border)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: 13,
            }}
          >
            Clone to Another Client
          </Link>
          <form action={deleteAction}>
            <button
              type="submit"
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid #f87171',
                background: 'none',
                color: '#f87171',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      {workoutPlan.workout_notes && (
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: '#ccc' }}>Workout Notes</h3>
          <p>{workoutPlan.workout_notes}</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
        {daysWithExercises.map((day) => (
          <div
            key={day.id}
            style={{
              padding: 16,
              borderRadius: 12,
              background: 'var(--brand-surface)',
              border: '1px solid var(--brand-border)',
            }}
          >
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{day.day_title}</h3>
            {day.exercises.length === 0 && <p style={{ color: '#888' }}>No exercises</p>}
            {day.exercises.length > 0 && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--brand-border)' }}>
                    <th style={{ padding: '4px 8px' }}>Exercise</th>
                    <th style={{ padding: '4px 8px' }}>Sets</th>
                    <th style={{ padding: '4px 8px' }}>Reps</th>
                  </tr>
                </thead>
                <tbody>
                  {day.exercises.map((ex, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--brand-border)' }}>
                      <td style={{ padding: '4px 8px' }}>{ex.exercise_name_snapshot}</td>
                      <td style={{ padding: '4px 8px' }}>{ex.sets}</td>
                      <td style={{ padding: '4px 8px' }}>{ex.reps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>

      {workoutPlan.remarks && (
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: '#ccc' }}>Remarks</h3>
          <p>{workoutPlan.remarks}</p>
        </div>
      )}
    </main>
  )
}