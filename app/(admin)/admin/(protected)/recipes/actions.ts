'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { sumMacros } from '@/lib/dietPlanMacros'

type IngredientPayload = { food_id: number | null; ingredient: string; quantity: number | null }
type StepPayload = { instruction: string; image: string }

type RecipePayload = {
  name: string
  image: string
  ingredients: IngredientPayload[]
  steps: StepPayload[]
}

async function nextId(admin: ReturnType<typeof createAdminClient>, table: string) {
  const { data, error } = await admin
    .from(table)
    .select('id')
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return (data?.id ?? 0) + 1
}

async function computeTotals(admin: ReturnType<typeof createAdminClient>, ingredients: IngredientPayload[]) {
  const foodIds = Array.from(
    new Set(ingredients.map((i) => i.food_id).filter((id): id is number => id != null))
  )

  const foodsById: Record<number, any> = {}
  if (foodIds.length > 0) {
    const { data: foods } = await admin
      .from('foods')
      .select('id, quantity, unit, carbs, protein, fats, sugar, fiber, calories, rich_in')
      .in('id', foodIds)

    for (const food of foods ?? []) {
      foodsById[food.id] = food
    }
  }

  const items = ingredients.map((i) => ({
    food: i.food_id != null ? foodsById[i.food_id] ?? null : null,
    quantity: i.quantity,
  }))

  return sumMacros(items)
}

async function insertIngredientsAndSteps(
  admin: ReturnType<typeof createAdminClient>,
  recipeId: number,
  ingredients: IngredientPayload[],
  steps: StepPayload[]
) {
  for (let i = 0; i < ingredients.length; i++) {
    const id = await nextId(admin, 'recipe_ingredients')
    const { error } = await admin.from('recipe_ingredients').insert({
      id,
      recipe_id: recipeId,
      food_id: ingredients[i].food_id,
      ingredient: ingredients[i].ingredient,
      quantity: ingredients[i].quantity,
      sort_order: i + 1,
    })
    if (error) throw new Error(error.message)
  }

  for (let i = 0; i < steps.length; i++) {
    const id = await nextId(admin, 'recipe_steps')
    const { error } = await admin.from('recipe_steps').insert({
      id,
      recipe_id: recipeId,
      instruction: steps[i].instruction,
      image: steps[i].image || null,
      sort_order: i + 1,
    })
    if (error) throw new Error(error.message)
  }
}

export async function createRecipe(formData: FormData) {
  const raw = formData.get('payload') as string
  const payload: RecipePayload = JSON.parse(raw)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const admin = createAdminClient()
  const recipeId = await nextId(admin, 'recipes')
  const totals = await computeTotals(admin, payload.ingredients)

  const { error: recipeError } = await admin.from('recipes').insert({
    id: recipeId,
    name: payload.name,
    image: payload.image || null,
    created_by_email: user?.email ?? null,
    total_calories: totals.calories,
    total_carbs: totals.carbs,
    total_protein: totals.protein,
    total_fats: totals.fats,
    total_sugar: totals.sugar,
    total_fiber: totals.fiber,
  })

  if (recipeError) throw new Error(recipeError.message)

  await insertIngredientsAndSteps(admin, recipeId, payload.ingredients, payload.steps)

  revalidatePath('/admin/recipes')
  redirect(`/admin/recipes/${recipeId}`)
}

export async function updateRecipe(recipeId: number, formData: FormData) {
  const raw = formData.get('payload') as string
  const payload: RecipePayload = JSON.parse(raw)

  const admin = createAdminClient()
  const totals = await computeTotals(admin, payload.ingredients)

  const { error: updateError } = await admin
    .from('recipes')
    .update({
      name: payload.name,
      image: payload.image || null,
      total_calories: totals.calories,
      total_carbs: totals.carbs,
      total_protein: totals.protein,
      total_fats: totals.fats,
      total_sugar: totals.sugar,
      total_fiber: totals.fiber,
    })
    .eq('id', recipeId)

  if (updateError) throw new Error(updateError.message)

  await admin.from('recipe_ingredients').delete().eq('recipe_id', recipeId)
  await admin.from('recipe_steps').delete().eq('recipe_id', recipeId)

  await insertIngredientsAndSteps(admin, recipeId, payload.ingredients, payload.steps)

  revalidatePath(`/admin/recipes/${recipeId}`)
  revalidatePath('/admin/recipes')
  redirect(`/admin/recipes/${recipeId}`)
}

export async function deleteRecipe(recipeId: number) {
  const admin = createAdminClient()

  await admin.from('recipe_ingredients').delete().eq('recipe_id', recipeId)
  await admin.from('recipe_steps').delete().eq('recipe_id', recipeId)
  await admin.from('recipes').delete().eq('id', recipeId)

  revalidatePath('/admin/recipes')
  redirect('/admin/recipes')
}