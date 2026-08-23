import { createAdminClient } from '@/lib/supabase/admin'
import { createRecipe } from '../actions'
import { RecipeBuilder } from '../RecipeBuilder'

export default async function NewRecipePage() {
  const admin = createAdminClient()

  const { data: foods } = await admin
    .from('foods')
    .select('id, name, calories, protein, carbs, fats, sugar, fiber, quantity, unit, rich_in')
    .order('name', { ascending: true })

  return (
    <main style={{ padding: 24, color: '#fff' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Add Recipe</h1>
      <RecipeBuilder action={createRecipe} foods={foods ?? []} />
    </main>
  )
}