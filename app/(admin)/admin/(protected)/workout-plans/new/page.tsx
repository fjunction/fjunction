import { createAdminClient } from '@/lib/supabase/admin'
import { createWorkoutPlan } from '../actions'
import { WorkoutPlanBuilder } from '../WorkoutPlanBuilder'

export default async function NewWorkoutPlanPage({
  searchParams,
}: {
  searchParams: Promise<{ person_id?: string; clone_from?: string }>
}) {
  const { person_id, clone_from } = await searchParams
  const admin = createAdminClient()

  const { data: exercises } = await admin.from('exercises').select('id, name').order('name', { ascending: true })

  const { data: people } = await admin
    .from('people')
    .select('id, name')
    .eq('is_client', true)
    .order('name', { ascending: true })

  let initial: any = undefined

  if (clone_from) {
    const { data: sourcePlan } = await admin
      .from('workout_plans')
      .select('id, plan_name, total_days, place, goal, experience, workout_notes, remarks, image')
      .eq('id', clone_from)
      .single()

    if (sourcePlan) {
      const { data: sourceDays } = await admin
        .from('workout_plan_days')
        .select('id, day_number, day_title')
        .eq('workout_plan_id', sourcePlan.id)
        .order('day_number', { ascending: true })

      const days = []
      for (const day of sourceDays ?? []) {
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

      initial = {
        plan_name: sourcePlan.plan_name ?? '',
        total_days: sourcePlan.total_days,
        place: sourcePlan.place,
        goal: sourcePlan.goal,
        experience: sourcePlan.experience,
        workout_notes: sourcePlan.workout_notes ?? '',
        remarks: sourcePlan.remarks ?? '',
        image: sourcePlan.image ?? '',
        days,
      }
    }
  }

  return (
    <main style={{ padding: 24, color: '#fff' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
        {clone_from ? 'Clone Workout Plan' : 'New Workout Plan'}
      </h1>
      <WorkoutPlanBuilder
        action={createWorkoutPlan}
        people={people ?? []}
        exercises={exercises ?? []}
        lockedPersonId={person_id}
        initial={initial}
      />
    </main>
  )
}