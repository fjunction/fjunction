import { createAdminClient } from '@/lib/supabase/admin'
import { updateWorkoutPlan } from '../../actions'
import { WorkoutPlanBuilder } from '../../WorkoutPlanBuilder'

export default async function EditWorkoutPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: workoutPlan, error } = await admin
    .from('workout_plans')
    .select('id, person_id, plan_name, total_days, place, goal, experience, workout_notes, remarks, image')
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

  const days = []
  for (const day of daysRaw ?? []) {
    const { data: exs } = await admin
      .from('workout_plan_exercises')
      .select('exercise_id, exercise_name_snapshot, sets, reps, sort_order')
      .eq('workout_plan_day_id', day.id)
      .order('sort_order', { ascending: true })

    days.push({
      key: `day-${day.id}`,
      day_title: day.day_title ?? '',
      exercises: (exs ?? []).map((ex, idx) => ({
        key: `ex-${day.id}-${idx}`,
        exercise_id: ex.exercise_id,
        exercise_name_snapshot: ex.exercise_name_snapshot ?? '',
        sets: ex.sets ?? '',
        reps: ex.reps ?? '',
      })),
    })
  }

  const { data: exercises } = await admin.from('exercises').select('id, name').order('name', { ascending: true })

  const updateAction = updateWorkoutPlan.bind(null, workoutPlan.id)

  return (
    <main style={{ padding: 24, color: '#fff' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Edit Workout Plan</h1>
      <WorkoutPlanBuilder
        action={updateAction}
        people={[]}
        exercises={exercises ?? []}
        lockedPersonId={workoutPlan.person_id}
        initial={{
          plan_name: workoutPlan.plan_name ?? '',
          total_days: workoutPlan.total_days,
          place: workoutPlan.place,
          goal: workoutPlan.goal,
          experience: workoutPlan.experience,
          workout_notes: workoutPlan.workout_notes ?? '',
          remarks: workoutPlan.remarks ?? '',
          image: workoutPlan.image ?? '',
          days,
        }}
      />
    </main>
  )
}