import { createAdminClient } from '@/lib/supabase/admin'
import { updateDietPlan } from '../../actions'
import { DietPlanBuilder } from '../../DietPlanBuilder'

export const metadata = {
    title: 'Edit Diet Plan',
  }

export default async function EditDietPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: dietPlan, error } = await admin
    .from('diet_plans')
    .select(
      'id, person_id, week_number, choice_number, total_calories, veg_type, diet_notes, workout_notes, workout_identifier, workout_plan_id'
    )
    .eq('id', id)
    .single()

  if (error || !dietPlan) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Diet plan not found</h1>
      </main>
    )
  }

  const { data: mealsRaw } = await admin
    .from('diet_plan_meals')
    .select('id, meal_order, label')
    .eq('diet_plan_id', id)
    .order('meal_order', { ascending: true })

  const meals = []
  for (const meal of mealsRaw ?? []) {
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

  const { data: foods } = await admin
  .from('foods')
  .select('id, name, calories, protein, carbs, fats, sugar, fiber, quantity, unit, rich_in')
  .order('name', { ascending: true })

  const { data: workoutPlans } = await admin
    .from('workout_plans')
    .select('id, plan_name')
    .eq('person_id', dietPlan.person_id)
    .order('created_at', { ascending: false })

  const updateAction = updateDietPlan.bind(null, dietPlan.id)

  return (
    <main style={{ padding: 24, color: '#fff' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Edit Diet Plan</h1>
      <DietPlanBuilder
        action={updateAction}
        people={[]}
        foods={foods ?? []}
        workoutPlans={workoutPlans ?? []}
        lockedPersonId={dietPlan.person_id}
        initial={{
          week_number: dietPlan.week_number,
          choice_number: dietPlan.choice_number,
          total_calories: dietPlan.total_calories,
          veg_type: dietPlan.veg_type,
          diet_notes: dietPlan.diet_notes ?? '',
          workout_notes: dietPlan.workout_notes ?? '',
          workout_identifier: dietPlan.workout_identifier ?? '',
          workout_plan_id: dietPlan.workout_plan_id,
          meals,
        }}
      />
    </main>
  )
}