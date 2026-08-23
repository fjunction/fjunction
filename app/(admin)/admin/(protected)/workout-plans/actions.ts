'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

type ExercisePayload = {
  exercise_id: number | null
  exercise_name_snapshot: string
  sets: string
  reps: string
}

type DayPayload = {
  day_title: string
  exercises: ExercisePayload[]
}

type WorkoutPlanPayload = {
  person_id: string
  plan_name: string
  total_days: number | null
  place: number | null
  goal: number | null
  experience: number | null
  workout_notes: string
  remarks: string
  image: string
  days: DayPayload[]
}

async function insertDays(admin: ReturnType<typeof createAdminClient>, workoutPlanId: string, days: DayPayload[]) {
  for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
    const day = days[dayIndex]

    const { data: dayRow, error: dayError } = await admin
      .from('workout_plan_days')
      .insert({
        workout_plan_id: workoutPlanId,
        day_number: dayIndex + 1,
        day_title: day.day_title,
      })
      .select('id')
      .single()

    if (dayError) throw new Error(dayError.message)

    if (day.exercises.length > 0) {
      const exercisesToInsert = day.exercises.map((ex, exIndex) => ({
        workout_plan_day_id: dayRow.id,
        exercise_id: ex.exercise_id,
        exercise_name_snapshot: ex.exercise_name_snapshot,
        sets: ex.sets,
        reps: ex.reps,
        sort_order: exIndex + 1,
      }))

      const { error: exercisesError } = await admin.from('workout_plan_exercises').insert(exercisesToInsert)

      if (exercisesError) throw new Error(exercisesError.message)
    }
  }
}

export async function createWorkoutPlan(formData: FormData) {
  const raw = formData.get('payload') as string
  const payload: WorkoutPlanPayload = JSON.parse(raw)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const admin = createAdminClient()

  const { data: workoutPlan, error: workoutPlanError } = await admin
    .from('workout_plans')
    .insert({
      person_id: payload.person_id,
      trainer_email: user?.email ?? null,
      plan_name: payload.plan_name,
      total_days: payload.total_days,
      place: payload.place,
      goal: payload.goal,
      experience: payload.experience,
      workout_notes: payload.workout_notes || null,
      remarks: payload.remarks || null,
      image: payload.image || null,
    })
    .select('id')
    .single()

  if (workoutPlanError) throw new Error(workoutPlanError.message)

  await insertDays(admin, workoutPlan.id, payload.days)

  revalidatePath(`/admin/clients/${payload.person_id}`)
  revalidatePath('/admin/workout-plans')
  redirect(`/admin/clients/${payload.person_id}`)
}

export async function updateWorkoutPlan(workoutPlanId: string, formData: FormData) {
  const raw = formData.get('payload') as string
  const payload: WorkoutPlanPayload = JSON.parse(raw)

  const admin = createAdminClient()

  const { error: updateError } = await admin
    .from('workout_plans')
    .update({
      plan_name: payload.plan_name,
      total_days: payload.total_days,
      place: payload.place,
      goal: payload.goal,
      experience: payload.experience,
      workout_notes: payload.workout_notes || null,
      remarks: payload.remarks || null,
      image: payload.image || null,
    })
    .eq('id', workoutPlanId)

  if (updateError) throw new Error(updateError.message)

  const { data: existingDays } = await admin.from('workout_plan_days').select('id').eq('workout_plan_id', workoutPlanId)
  const existingDayIds = (existingDays ?? []).map((d) => d.id)

  if (existingDayIds.length > 0) {
    const { error: deleteExError } = await admin
      .from('workout_plan_exercises')
      .delete()
      .in('workout_plan_day_id', existingDayIds)

    if (deleteExError) throw new Error(deleteExError.message)

    const { error: deleteDaysError } = await admin
      .from('workout_plan_days')
      .delete()
      .eq('workout_plan_id', workoutPlanId)

    if (deleteDaysError) throw new Error(deleteDaysError.message)
  }

  await insertDays(admin, workoutPlanId, payload.days)

  revalidatePath(`/admin/workout-plans/${workoutPlanId}`)
  revalidatePath('/admin/workout-plans')
  redirect(`/admin/workout-plans/${workoutPlanId}`)
}

export async function deleteWorkoutPlan(workoutPlanId: string, personId: string) {
  const admin = createAdminClient()

  const { data: existingDays } = await admin.from('workout_plan_days').select('id').eq('workout_plan_id', workoutPlanId)
  const existingDayIds = (existingDays ?? []).map((d) => d.id)

  if (existingDayIds.length > 0) {
    await admin.from('workout_plan_exercises').delete().in('workout_plan_day_id', existingDayIds)
  }

  await admin.from('workout_plan_days').delete().eq('workout_plan_id', workoutPlanId)
  await admin.from('workout_plans').delete().eq('id', workoutPlanId)

  revalidatePath(`/admin/clients/${personId}`)
  revalidatePath('/admin/workout-plans')
  redirect(`/admin/clients/${personId}`)
}