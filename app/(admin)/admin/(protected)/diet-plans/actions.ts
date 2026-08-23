'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { scaleFoodMacros, scaleRecipeMacros, sumScaledMacros } from '@/lib/dietPlanMacros'

type MealItemPayload = {
  item_type: 'food' | 'recipe'
  food_id: number | null
  recipe_id: number | null
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
  workout_identifier: string
  workout_plan_id: string | null
  diet_notes: string
  workout_notes: string
  meals: MealPayload[]
}

async function insertMeals(admin: ReturnType<typeof createAdminClient>, dietPlanId: string, meals: MealPayload[]) {
  for (let mealIndex = 0; mealIndex < meals.length; mealIndex++) {
    const meal = meals[mealIndex]

    const { data: mealRow, error: mealError } = await admin
      .from('diet_plan_meals')
      .insert({
        diet_plan_id: dietPlanId,
        meal_order: mealIndex + 1,
        label: meal.label,
      })
      .select('id')
      .single()

    if (mealError) throw new Error(mealError.message)

    if (meal.items.length > 0) {
      const itemsToInsert = meal.items.map((item, itemIndex) => ({
        diet_plan_meal_id: mealRow.id,
        food_id: item.item_type === 'food' ? item.food_id : null,
        recipe_id: item.item_type === 'recipe' ? item.recipe_id : null,
        food_name_snapshot: item.food_name_snapshot,
        quantity: item.quantity,
        sort_order: itemIndex + 1,
      }))

      const { error: itemsError } = await admin.from('diet_plan_meal_items').insert(itemsToInsert)

      if (itemsError) throw new Error(itemsError.message)
    }
  }
}

async function computeTotals(admin: ReturnType<typeof createAdminClient>, meals: MealPayload[]) {
  const foodIds = Array.from(
    new Set(
      meals.flatMap((m) =>
        m.items.filter((it) => it.item_type === 'food').map((it) => it.food_id).filter((id): id is number => id != null)
      )
    )
  )
  const recipeIds = Array.from(
    new Set(
      meals.flatMap((m) =>
        m.items.filter((it) => it.item_type === 'recipe').map((it) => it.recipe_id).filter((id): id is number => id != null)
      )
    )
  )

  const foodsById: Record<number, any> = {}
  if (foodIds.length > 0) {
    const { data: foods } = await admin
      .from('foods')
      .select('id, quantity, unit, carbs, protein, fats, sugar, fiber, calories, rich_in')
      .in('id', foodIds)
    for (const food of foods ?? []) foodsById[food.id] = food
  }

  const recipesById: Record<number, any> = {}
  if (recipeIds.length > 0) {
    const { data: recipes } = await admin
      .from('recipes')
      .select('id, total_calories, total_carbs, total_protein, total_fats, total_sugar, total_fiber')
      .in('id', recipeIds)
    for (const recipe of recipes ?? []) recipesById[recipe.id] = recipe
  }

  const scaledItems = meals.flatMap((m) =>
    m.items.map((it) => {
      if (it.item_type === 'recipe') {
        const recipe = it.recipe_id != null ? recipesById[it.recipe_id] ?? null : null
        return scaleRecipeMacros(recipe, it.quantity)
      }
      const food = it.food_id != null ? foodsById[it.food_id] ?? null : null
      return scaleFoodMacros(food, it.quantity)
    })
  )

  return sumScaledMacros(scaledItems)
}

export async function createDietPlan(formData: FormData) {
  const raw = formData.get('payload') as string
  const payload: DietPlanPayload = JSON.parse(raw)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const admin = createAdminClient()
  const totals = await computeTotals(admin, payload.meals)

  const { data: dietPlan, error: dietPlanError } = await admin
    .from('diet_plans')
    .insert({
      person_id: payload.person_id,
      trainer_email: user?.email ?? null,
      week_number: payload.week_number,
      choice_number: payload.choice_number,
      total_calories: payload.total_calories,
      total_carbs: totals.carbs,
      total_protein: totals.protein,
      total_fats: totals.fats,
      total_sugar: totals.sugar,
      total_fiber: totals.fiber,
      veg_type: payload.veg_type,
      workout_identifier: payload.workout_identifier || null,
      workout_plan_id: payload.workout_plan_id || null,
      diet_notes: payload.diet_notes || null,
      workout_notes: payload.workout_notes || null,
    })
    .select('id')
    .single()

  if (dietPlanError) throw new Error(dietPlanError.message)

  await insertMeals(admin, dietPlan.id, payload.meals)

  revalidatePath(`/admin/clients/${payload.person_id}`)
  revalidatePath('/admin/diet-plans')
  redirect(`/admin/clients/${payload.person_id}`)
}

export async function updateDietPlan(dietPlanId: string, formData: FormData) {
  const raw = formData.get('payload') as string
  const payload: DietPlanPayload = JSON.parse(raw)

  const admin = createAdminClient()
  const totals = await computeTotals(admin, payload.meals)

  const { error: updateError } = await admin
    .from('diet_plans')
    .update({
      week_number: payload.week_number,
      choice_number: payload.choice_number,
      total_calories: payload.total_calories,
      total_carbs: totals.carbs,
      total_protein: totals.protein,
      total_fats: totals.fats,
      total_sugar: totals.sugar,
      total_fiber: totals.fiber,
      veg_type: payload.veg_type,
      workout_identifier: payload.workout_identifier || null,
      workout_plan_id: payload.workout_plan_id || null,
      diet_notes: payload.diet_notes || null,
      workout_notes: payload.workout_notes || null,
    })
    .eq('id', dietPlanId)

  if (updateError) throw new Error(updateError.message)

  const { data: existingMeals } = await admin.from('diet_plan_meals').select('id').eq('diet_plan_id', dietPlanId)
  const existingMealIds = (existingMeals ?? []).map((m) => m.id)

  if (existingMealIds.length > 0) {
    const { error: deleteItemsError } = await admin
      .from('diet_plan_meal_items')
      .delete()
      .in('diet_plan_meal_id', existingMealIds)

    if (deleteItemsError) throw new Error(deleteItemsError.message)

    const { error: deleteMealsError } = await admin.from('diet_plan_meals').delete().eq('diet_plan_id', dietPlanId)

    if (deleteMealsError) throw new Error(deleteMealsError.message)
  }

  await insertMeals(admin, dietPlanId, payload.meals)

  revalidatePath(`/admin/diet-plans/${dietPlanId}`)
  revalidatePath('/admin/diet-plans')
  redirect(`/admin/diet-plans/${dietPlanId}`)
}

export async function deleteDietPlan(dietPlanId: string, personId: string) {
  const admin = createAdminClient()

  const { data: existingMeals } = await admin.from('diet_plan_meals').select('id').eq('diet_plan_id', dietPlanId)
  const existingMealIds = (existingMeals ?? []).map((m) => m.id)

  if (existingMealIds.length > 0) {
    await admin.from('diet_plan_meal_items').delete().in('diet_plan_meal_id', existingMealIds)
  }

  await admin.from('diet_plan_meals').delete().eq('diet_plan_id', dietPlanId)
  await admin.from('diet_plans').delete().eq('id', dietPlanId)

  revalidatePath(`/admin/clients/${personId}`)
  revalidatePath('/admin/diet-plans')
  redirect(`/admin/clients/${personId}`)
}

export async function quickAddFood(formData: FormData) {
  const admin = createAdminClient()

  const payload = {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    is_veg: formData.get('is_veg') === 'on',
    carbs: Number(formData.get('carbs')) || 0,
    sugar: Number(formData.get('sugar')) || 0,
    fiber: Number(formData.get('fiber')) || 0,
    protein: Number(formData.get('protein')) || 0,
    fats: Number(formData.get('fats')) || 0,
    calories: Number(formData.get('calories')) || 0,
    unit: (formData.get('unit') as string) || null,
    rich_in: (formData.get('rich_in') as string) || null,
    image: (formData.get('image') as string) || null,
    quantity: Number(formData.get('quantity')) || 0,
    rda: Number(formData.get('rda')) || 0,
  }

  const { data, error } = await admin.from('foods').insert(payload).select('*').single()

  if (error) throw new Error(error.message)

  return data
}