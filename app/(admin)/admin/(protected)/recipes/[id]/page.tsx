import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { deleteRecipe } from '../actions'
import { scaleFoodMacros } from '@/lib/dietPlanMacros'

function recipeImageUrl(path: string | null) {
  if (!path) return null
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${path}`
}

export default async function RecipeViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: recipe, error } = await admin
    .from('recipes')
    .select('id, name, image, total_calories, total_carbs, total_protein, total_fats, total_sugar, total_fiber')
    .eq('id', id)
    .single()

  if (error || !recipe) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Recipe not found</h1>
      </main>
    )
  }

  const { data: ingredientsRaw } = await admin
    .from('recipe_ingredients')
    .select(
      'ingredient, quantity, sort_order, foods(quantity, unit, carbs, protein, fats, calories, rich_in)'
    )
    .eq('recipe_id', id)
    .order('sort_order', { ascending: true })

  const ingredients = (ingredientsRaw ?? []).map((ing: any) => {
    const macros = scaleFoodMacros(ing.foods, ing.quantity)
    return {
      ingredient: ing.ingredient,
      quantity: ing.quantity,
      unit: macros.unit,
      carbs: macros.carbs,
      protein: macros.protein,
      fats: macros.fats,
      calories: macros.calories,
      rich_in: macros.rich_in,
    }
  })

  const { data: steps } = await admin
    .from('recipe_steps')
    .select('instruction, image, sort_order')
    .eq('recipe_id', id)
    .order('sort_order', { ascending: true })

  const imageUrl = recipeImageUrl(recipe.image)
  const deleteAction = deleteRecipe.bind(null, recipe.id)

  return (
    <main style={{ padding: 24, color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={recipe.name ?? ''}
              width={64}
              height={64}
              style={{ borderRadius: 8, objectFit: 'cover' }}
            />
          )}
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>{recipe.name}</h1>
            <p style={{ color: '#888', marginTop: 4 }}>
              {recipe.total_calories ? `${recipe.total_calories} kcal` : ''}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link
            href={`/admin/recipes/${recipe.id}/edit`}
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

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#ccc' }}>Ingredients</h3>
        {ingredients.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--brand-border)' }}>
                <th style={{ padding: '4px 8px' }}>Ingredient</th>
                <th style={{ padding: '4px 8px' }}>Quantity</th>
                <th style={{ padding: '4px 8px' }}>C</th>
                <th style={{ padding: '4px 8px' }}>P</th>
                <th style={{ padding: '4px 8px' }}>F</th>
                <th style={{ padding: '4px 8px' }}>Cal</th>
                <th style={{ padding: '4px 8px' }}>Rich In</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ing, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--brand-border)' }}>
                  <td style={{ padding: '4px 8px' }}>{ing.ingredient}</td>
                  <td style={{ padding: '4px 8px' }}>
                    {ing.quantity} {ing.unit ?? ''}
                  </td>
                  <td style={{ padding: '4px 8px' }}>{ing.carbs ?? '—'}</td>
                  <td style={{ padding: '4px 8px' }}>{ing.protein ?? '—'}</td>
                  <td style={{ padding: '4px 8px' }}>{ing.fats ?? '—'}</td>
                  <td style={{ padding: '4px 8px' }}>{ing.calories ?? '—'}</td>
                  <td style={{ padding: '4px 8px', color: '#888' }}>{ing.rich_in ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#888' }}>No ingredients listed.</p>
        )}
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: 12,
          background: 'var(--brand-surface)',
          border: '1px solid var(--brand-yellow)',
          maxWidth: 360,
          marginBottom: 24,
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Recipe Totals</h3>
        {[
          { label: 'Calories', value: recipe.total_calories, unit: 'kcal' },
          { label: 'Carbs', value: recipe.total_carbs, unit: 'g' },
          { label: 'Protein', value: recipe.total_protein, unit: 'g' },
          { label: 'Fats', value: recipe.total_fats, unit: 'g' },
          { label: 'Sugar', value: recipe.total_sugar, unit: 'g' },
          { label: 'Fiber', value: recipe.total_fiber, unit: 'g' },
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
              {row.value ?? '—'} {row.value != null ? row.unit : ''}
            </span>
          </div>
        ))}
      </div>

      <div>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#ccc' }}>Steps</h3>
        <ol style={{ paddingLeft: 20 }}>
          {(steps ?? []).map((step, idx) => (
            <li key={idx} style={{ marginBottom: 12 }}>
              <p>{step.instruction}</p>
              {step.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={recipeImageUrl(step.image) ?? ''}
                  alt={`Step ${idx + 1}`}
                  style={{ maxWidth: 300, borderRadius: 8, marginTop: 6 }}
                />
              )}
            </li>
          ))}
          {(steps ?? []).length === 0 && <p style={{ color: '#888' }}>No steps listed.</p>}
        </ol>
      </div>
    </main>
  )
}