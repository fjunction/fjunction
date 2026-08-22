import { createAdminClient } from '@/lib/supabase/admin'
import { createDietPlan } from '../actions'
import { DietPlanBuilder } from '../DietPlanBuilder'

export default async function NewDietPlanPage({
  searchParams,
}: {
  searchParams: Promise<{ person_id?: string; clone_from?: string }>
}) {
  const { person_id, clone_from } = await searchParams
  const admin = createAdminClient()

  const { data: foods } = await admin
    .from('foods')
    .select('id, name, calories, protein, unit')
    .order('name', { ascending: true })

  const { data: people } = await admin
    .from('people')
    .select('id, name')
    .eq('is_client', true)
    .order('name', { ascending: true })

  let workoutPlans: { id: string; plan_name: string | null }[] = []
  if (person_id) {
    const { data } = await admin
      .from('workout_plans')
      .select('id, plan_name')
      .eq('person_id', person_id)
      .order('created_at', { ascending: false })
    workoutPlans = data ?? []
  }

  let initial: any = undefined

  if (clone_from) {
    const { data: sourcePlan } = await admin
      .from('diet_plans')
      .select(
        'id, week_number, choice_number, total_calories, veg_type, header, frequency_note, diet_notes, workout_notes, remarks, workout_identifier, workout_plan_id'
      )
      .eq('id', clone_from)
      .single()

    if (sourcePlan) {
      const { data: sourceMeals } = await admin
        .from('diet_plan_meals')
        .select('id, meal_order, label')
        .eq('diet_plan_id', sourcePlan.id)
        .order('meal_order', { ascending: true })

      const meals = []
      for (const meal of sourceMeals ?? []) {
        const { data: items } = await admin
          .from('diet_plan_meal_items')
          .select('food_id, food_name_snapshot, quantity, sort_order')
          .eq('diet_plan_meal_id', meal.id)
          .order('sort_order', { ascending: true })

        meals.push({
          key: `meal-${meal.id}`,
          label: meal.label ?? '',
          items: (items ?? []).map((it, idx) => ({
            key: `item-${meal.id}-${idx}`,
            food_id: it.food_id,
            food_name_snapshot: it.food_name_snapshot ?? '',
            quantity: it.quantity ?? '',
          })),
        })
      }

      initial = {
        week_number: (sourcePlan.week_number ?? 0) + 1,
        choice_number: sourcePlan.choice_number ?? 1,
        total_calories: sourcePlan.total_calories,
        veg_type: sourcePlan.veg_type,
        header: sourcePlan.header ?? '',
        frequency_note: sourcePlan.frequency_note ?? '',
        diet_notes: sourcePlan.diet_notes ?? '',
        workout_notes: sourcePlan.workout_notes ?? '',
        remarks: sourcePlan.remarks ?? '',
        workout_identifier: sourcePlan.workout_identifier ?? '',
        workout_plan_id: sourcePlan.workout_plan_id,
        meals,
      }
    }
  }

  return (
    <main style={{ padding: 24, color: '#fff', maxWidth: 640 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
        {clone_from ? 'Clone Diet Plan' : 'New Diet Plan'}
      </h1>
      <DietPlanBuilder
        action={createDietPlan}
        people={people ?? []}
        foods={foods ?? []}
        workoutPlans={workoutPlans}
        lockedPersonId={person_id}
        initial={initial}
      />
    </main>
  )
}