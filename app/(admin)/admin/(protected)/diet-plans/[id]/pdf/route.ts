import fs from 'fs'
import path from 'path'
import { renderToBuffer } from '@react-pdf/renderer'
import { createAdminClient } from '@/lib/supabase/admin'
import { scaleFoodMacros, sumMacros } from '@/lib/dietPlanMacros'
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
  const allItemsForTotals: { food: any; quantity: number | null }[] = []

  for (const meal of mealsRaw ?? []) {
    const { data: items } = await admin
      .from('diet_plan_meal_items')
      .select(
        'food_name_snapshot, quantity, sort_order, foods(quantity, unit, carbs, protein, fats, sugar, fiber, calories, rich_in)'
      )
      .eq('diet_plan_meal_id', meal.id)
      .order('sort_order', { ascending: true })

    const itemsWithMacros = (items ?? []).map((item: any) => {
      allItemsForTotals.push({ food: item.foods, quantity: item.quantity })
      const macros = scaleFoodMacros(item.foods, item.quantity)
      return {
        food_name_snapshot: item.food_name_snapshot,
        quantity: item.quantity,
        unit: macros.unit,
        carbs: macros.carbs,
        protein: macros.protein,
        fats: macros.fats,
        calories: macros.calories,
        rich_in: macros.rich_in,
      }
    })

    meals.push({ label: meal.label, items: itemsWithMacros })
  }

  const totals = sumMacros(allItemsForTotals)

  let logoBuffer: Buffer | null = null
  try {
    logoBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'logo.png'))
  } catch {
    logoBuffer = null
  }

  const buffer = await renderToBuffer(
    DietPlanDocument({ dietPlan: dietPlan as any, meals, totals, logoBuffer })
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