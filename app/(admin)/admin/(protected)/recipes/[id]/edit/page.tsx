import { createAdminClient } from '@/lib/supabase/admin'
import { updateRecipe } from '../../actions'
import { RecipeBuilder } from '../../RecipeBuilder'

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: recipe, error } = await admin.from('recipes').select('id, name, image').eq('id', id).single()

  if (error || !recipe) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Recipe not found</h1>
      </main>
    )
  }

  const { data: ingredients } = await admin
    .from('recipe_ingredients')
    .select('food_id, ingredient, quantity, sort_order')
    .eq('recipe_id', id)
    .order('sort_order', { ascending: true })

  const { data: steps } = await admin
    .from('recipe_steps')
    .select('instruction, image, sort_order')
    .eq('recipe_id', id)
    .order('sort_order', { ascending: true })

  const { data: foods } = await admin
    .from('foods')
    .select('id, name, calories, protein, carbs, fats, sugar, fiber, quantity, unit, rich_in')
    .order('name', { ascending: true })

  const updateAction = updateRecipe.bind(null, recipe.id)

  return (
    <main style={{ padding: 24, color: '#fff' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Edit Recipe</h1>
      <RecipeBuilder
        action={updateAction}
        foods={foods ?? []}
        initial={{
          name: recipe.name ?? '',
          image: recipe.image ?? '',
          ingredients: (ingredients ?? []).map((i, idx) => ({
            key: `ing-${idx}`,
            food_id: i.food_id,
            ingredient: i.ingredient ?? '',
            quantity: i.quantity ?? '',
          })),
          steps: (steps ?? []).map((s, idx) => ({
            key: `step-${idx}`,
            instruction: s.instruction ?? '',
            image: s.image ?? '',
          })),
        }}
      />
    </main>
  )
}