import fs from 'fs'
import path from 'path'
import { renderToBuffer } from '@react-pdf/renderer'
import { createAdminClient } from '@/lib/supabase/admin'
import { scaleFoodMacros, scaleRecipeMacros, sumScaledMacros } from '@/lib/dietPlanMacros'
import { DietPlanDocument } from './DietPlanDocument'

export const runtime = 'nodejs'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: dietPlan, error } = await admin
    .from('diet_plans')
    .select('id, week_number, choice_number, total_calories, veg_type, diet_notes, workout_notes, people(name)')
    .eq('id', id)
    .single()

  if (error || !dietPlan) {
    return new Response('Diet plan not found', { status: 404 })
  }

  const { data: mealsRaw } = await admin
    .from('diet_plan_meals')
    .select('id, meal_order, label')
    .eq('diet_plan_id', id)
    .order('meal_order', { ascending: true })

  const meals = []
  const scaledForTotals: any[] = []
  const recipeIdsUsed = new Set<number>()

  for (const meal of mealsRaw ?? []) {
    const { data: items } = await admin
      .from('diet_plan_meal_items')
      .select(
        'food_name_snapshot, quantity, sort_order, food_id, recipe_id, foods(quantity, unit, carbs, protein, fats, sugar, fiber, calories, rich_in), recipes(total_calories, total_carbs, total_protein, total_fats, total_sugar, total_fiber)'
      )
      .eq('diet_plan_meal_id', meal.id)
      .order('sort_order', { ascending: true })

    const itemsDisplay = (items ?? []).map((item: any) => {
      const isRecipe = item.recipe_id != null
      if (isRecipe) recipeIdsUsed.add(item.recipe_id)

      const macros = isRecipe
        ? scaleRecipeMacros(item.recipes, item.quantity)
        : scaleFoodMacros(item.foods, item.quantity)

      scaledForTotals.push(macros)

      return {
        food_name_snapshot: item.food_name_snapshot,
        quantity: item.quantity,
        unit: isRecipe ? 'portion' : macros.unit,
        carbs: macros.carbs,
        protein: macros.protein,
        fats: macros.fats,
        calories: macros.calories,
        rich_in: macros.rich_in,
      }
    })

    meals.push({ label: meal.label, items: itemsDisplay })
  }

  const totals = sumScaledMacros(scaledForTotals)

  const recipeDetails = []
  for (const recipeId of recipeIdsUsed) {
    const { data: recipe } = await admin
      .from('recipes')
      .select('id, name, total_calories')
      .eq('id', recipeId)
      .single()

    if (!recipe) continue

    const { data: ingredients } = await admin
      .from('recipe_ingredients')
      .select('ingredient, sort_order')
      .eq('recipe_id', recipeId)
      .order('sort_order', { ascending: true })

    const { data: steps } = await admin
      .from('recipe_steps')
      .select('instruction, sort_order')
      .eq('recipe_id', recipeId)
      .order('sort_order', { ascending: true })

    recipeDetails.push({
      name: recipe.name,
      total_calories: recipe.total_calories,
      ingredients: (ingredients ?? []).map((i) => i.ingredient ?? ''),
      steps: (steps ?? []).map((s) => s.instruction ?? ''),
    })
  }

  let logoBuffer: Buffer | null = null
  try {
    logoBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'logo.png'))
  } catch {
    logoBuffer = null
  }

  const buffer = await renderToBuffer(
    DietPlanDocument({ dietPlan: dietPlan as any, meals, totals, recipes: recipeDetails, logoBuffer })
  )

  const person = (dietPlan as any).people
  const safeName = (person?.name ?? 'client').replace(/[^a-zA-Z0-9]/g, '')
  const dateStr = new Date().toISOString().slice(0, 10)
  const filename = `${safeName}-Option${dietPlan.choice_number}-${dateStr}.pdf`

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}