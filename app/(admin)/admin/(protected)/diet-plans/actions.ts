'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

type MealItemPayload = {
  food_id: number | null
  food_name_snapshot: string
  quantity: number | null
}

type MealPayload = {
  label: string
  items: MealItemPayload[]
}

type DietPlanPayload = {
  person_id: string
  week_number: number
  choice_number: number
  total_calories: number | null
  veg_type: number | null
  header: string
  frequency_note: string
  diet_notes: string
  workout_notes: string
  remarks: string
  workout_identifier: string
  workout_plan_id: string | null
  meals: MealPayload[]
}

export async function createDietPlan(formData: FormData) {
  const raw = formData.get('payload') as string
  const payload: DietPlanPayload = JSON.parse(raw)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const admin = createAdminClient()

  const { data: dietPlan, error: dietPlanError } = await admin
    .from('diet_plans')
    .insert({
      person_id: payload.person_id,
      trainer_email: user?.email ?? null,
      week_number: payload.week_number,
      choice_number: payload.choice_number,
      total_calories: payload.total_calories,
      veg_type: payload.veg_type,
      header: payload.header || null,
      frequency_note: payload.frequency_note || null,
      diet_notes: payload.diet_notes || null,
      workout_notes: payload.workout_notes || null,
      remarks: payload.remarks || null,
      workout_identifier: payload.workout_identifier || null,
      workout_plan_id: payload.workout_plan_id || null,
    })
    .select('id')
    .single()

  if (dietPlanError) throw new Error(dietPlanError.message)

  for (let mealIndex = 0; mealIndex < payload.meals.length; mealIndex++) {
    const meal = payload.meals[mealIndex]

    const { data: mealRow, error: mealError } = await admin
      .from('diet_plan_meals')
      .insert({
        diet_plan_id: dietPlan.id,
        meal_order: mealIndex + 1,
        label: meal.label,
      })
      .select('id')
      .single()

    if (mealError) throw new Error(mealError.message)

    if (meal.items.length > 0) {
      const itemsToInsert = meal.items.map((item, itemIndex) => ({
        diet_plan_meal_id: mealRow.id,
        food_id: item.food_id,
        food_name_snapshot: item.food_name_snapshot,
        quantity: item.quantity,
        sort_order: itemIndex + 1,
      }))

      const { error: itemsError } = await admin.from('diet_plan_meal_items').insert(itemsToInsert)

      if (itemsError) throw new Error(itemsError.message)
    }
  }

  revalidatePath(`/admin/clients/${payload.person_id}`)
  redirect(`/admin/clients/${payload.person_id}`)
}