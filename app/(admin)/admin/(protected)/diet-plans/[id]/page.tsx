import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { deleteDietPlan } from '../actions'
import { scaleFoodMacros, scaleRecipeMacros, sumScaledMacros } from '@/lib/dietPlanMacros'

const VEG_LABELS: Record<number, string> = { 0: 'Veg', 1: 'Non-Veg', 2: 'Eggetarian' }

function recipeImageUrl(path: string | null) {
  if (!path) return null
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${path}`
}

export default async function DietPlanViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: dietPlan, error } = await admin
    .from('diet_plans')
    .select(
      'id, person_id, week_number, choice_number, total_calories, veg_type, diet_notes, workout_notes, workout_identifier, created_at, people(name)'
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

  const mealsWithItems = []
  const scaledForTotals: { calories: number | null; carbs: number | null; protein: number | null; fats: number | null; sugar: number | null; fiber: number | null }[] = []
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
        is_recipe: isRecipe,
      }
    })

    mealsWithItems.push({ id: meal.id, label: meal.label, items: itemsDisplay })
  }

  const totals = sumScaledMacros(scaledForTotals)

  const recipeDetails = []
  for (const recipeId of recipeIdsUsed) {
    const { data: recipe } = await admin
      .from('recipes')
      .select('id, name, image, total_calories, total_carbs, total_protein, total_fats, total_sugar, total_fiber')
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
      .select('instruction, image, sort_order')
      .eq('recipe_id', recipeId)
      .order('sort_order', { ascending: true })

    recipeDetails.push({ recipe, ingredients: ingredients ?? [], steps: steps ?? [] })
  }

  const person = (dietPlan as any).people
  const deleteAction = deleteDietPlan.bind(null, dietPlan.id, dietPlan.person_id)

  return (
    <main style={{ padding: 24, color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>
            {person?.name ?? ''} (Week: {dietPlan.week_number}, Option: {dietPlan.choice_number})
          </h1>
          <p style={{ color: '#888', marginTop: 4 }}>
            {dietPlan.veg_type != null ? `${VEG_LABELS[dietPlan.veg_type] ?? ''} · ` : ''}
            {dietPlan.total_calories ? `${dietPlan.total_calories} kcal` : ''}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          
          <a  href={`/admin/diet-plans/${dietPlan.id}/pdf`}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              background: 'var(--brand-gradient)',
              color: '#fff',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: 13,
            }}
          >
            Download PDF
          </a>
          <Link
            href={`/admin/diet-plans/${dietPlan.id}/edit`}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid var(--brand-border)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: 13,
            }}
          >
            Edit
          </Link>
          <Link
            href={`/admin/diet-plans/new?clone_from=${dietPlan.id}`}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid var(--brand-border)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: 13,
            }}
          >
            Clone to Another Client
          </Link>
          <form action={deleteAction}>
            <button
              type="submit"
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid #f87171',
                background: 'none',
                color: '#f87171',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      {dietPlan.diet_notes && (
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: '#ccc' }}>Diet Notes</h3>
          <p>{dietPlan.diet_notes}</p>
        </div>
      )}

      {dietPlan.workout_notes && (
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: '#ccc' }}>Workout Notes</h3>
          <p>{dietPlan.workout_notes}</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
        {mealsWithItems.map((meal) => (
          <div
            key={meal.id}
            style={{
              padding: 16,
              borderRadius: 12,
              background: 'var(--brand-surface)',
              border: '1px solid var(--brand-border)',
            }}
          >
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{meal.label}</h3>
            {meal.items.length === 0 && <p style={{ color: '#888' }}>No items</p>}
            {meal.items.length > 0 && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--brand-border)' }}>
                    <th style={{ padding: '4px 8px' }}>Item</th>
                    <th style={{ padding: '4px 8px' }}>Quantity</th>
                    <th style={{ padding: '4px 8px' }}>C</th>
                    <th style={{ padding: '4px 8px' }}>P</th>
                    <th style={{ padding: '4px 8px' }}>F</th>
                    <th style={{ padding: '4px 8px' }}>Cal</th>
                    <th style={{ padding: '4px 8px' }}>Rich In</th>
                  </tr>
                </thead>
                <tbody>
                  {meal.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--brand-border)' }}>
                      <td style={{ padding: '4px 8px' }}>
                        {item.food_name_snapshot}
                        {item.is_recipe && (
                          <span style={{ color: 'var(--brand-yellow)', fontSize: 11 }}> (Recipe)</span>
                        )}
                      </td>
                      <td style={{ padding: '4px 8px' }}>
                        {item.quantity} {item.unit ?? ''}
                      </td>
                      <td style={{ padding: '4px 8px' }}>{item.carbs ?? '—'}</td>
                      <td style={{ padding: '4px 8px' }}>{item.protein ?? '—'}</td>
                      <td style={{ padding: '4px 8px' }}>{item.fats ?? '—'}</td>
                      <td style={{ padding: '4px 8px' }}>{item.calories ?? '—'}</td>
                      <td style={{ padding: '4px 8px', color: '#888' }}>{item.rich_in ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: 12,
          background: 'var(--brand-surface)',
          border: '1px solid var(--brand-yellow)',
          maxWidth: 360,
          marginBottom: recipeDetails.length > 0 ? 24 : 0,
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Plan Summary</h3>
        {[
          { label: 'Calories', value: totals.calories, unit: 'kcal' },
          { label: 'Carbs', value: totals.carbs, unit: 'g' },
          { label: 'Protein', value: totals.protein, unit: 'g' },
          { label: 'Fats', value: totals.fats, unit: 'g' },
          { label: 'Sugar', value: totals.sugar, unit: 'g' },
          { label: 'Fiber', value: totals.fiber, unit: 'g' },
        ].map((row) => (
          <div
            key={row.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: '1px solid var(--brand-border)',
            }}
          >
            <span style={{ color: '#ccc', fontSize: 13 }}>{row.label}</span>
            <span style={{ fontWeight: 600 }}>
              {row.value} {row.unit}
            </span>
          </div>
        ))}
      </div>

      {recipeDetails.length > 0 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Recipes in This Plan</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {recipeDetails.map(({ recipe, ingredients, steps }) => {
              const imageUrl = recipeImageUrl(recipe.image)
              return (
                <div
                  key={recipe.id}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: 'var(--brand-surface)',
                    border: '1px solid var(--brand-border)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                    {imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={recipe.name}
                        width={48}
                        height={48}
                        style={{ borderRadius: 8, objectFit: 'cover' }}
                      />
                    )}
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 700 }}>{recipe.name}</h3>
                      <p style={{ fontSize: 12, color: '#888' }}>
                        {recipe.total_calories ? `${recipe.total_calories} kcal (full recipe)` : ''}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 200px' }}>
                      <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#ccc' }}>Ingredients</h4>
                      <ul style={{ paddingLeft: 18, fontSize: 13 }}>
                        {ingredients.map((ing, idx) => (
                          <li key={idx} style={{ marginBottom: 3 }}>
                            {ing.ingredient}
                          </li>
                        ))}
                        {ingredients.length === 0 && <li style={{ color: '#888' }}>None listed</li>}
                      </ul>
                    </div>
                    <div style={{ flex: '2 1 300px' }}>
                      <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#ccc' }}>Steps</h4>
                      <ol style={{ paddingLeft: 18, fontSize: 13 }}>
                        {steps.map((step, idx) => (
                          <li key={idx} style={{ marginBottom: 6 }}>
                            {step.instruction}
                          </li>
                        ))}
                        {steps.length === 0 && <li style={{ color: '#888' }}>None listed</li>}
                      </ol>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}