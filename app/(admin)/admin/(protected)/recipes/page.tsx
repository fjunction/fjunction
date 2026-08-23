import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

function recipeImageUrl(path: string | null) {
  if (!path) return null
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${path}`
}

export default async function RecipesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const admin = createAdminClient()

  let query = admin
    .from('recipes')
    .select('id, name, image, total_calories, total_protein')
    .order('name', { ascending: true })

  if (q) {
    query = query.ilike('name', `%${q}%`)
  }

  const { data: recipes, error } = await query

  if (error) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Error loading recipes</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </main>
    )
  }

  return (
    <main style={{ padding: 24, color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Recipe Management</h1>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <form method="GET" style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              name="q"
              defaultValue={q ?? ''}
              placeholder="Search by name…"
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--brand-border)',
                background: 'var(--brand-surface)',
                color: '#fff',
                width: 220,
              }}
            />
            <button
              type="submit"
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: 'none',
                background: 'var(--brand-gradient)',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Search
            </button>
          </form>

          <Link
            href="/admin/recipes/new"
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              background: 'var(--brand-gradient)',
              color: '#fff',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            + Add Recipe
          </Link>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--brand-border)' }}>
            <th style={{ padding: '8px 12px', width: '40%' }}>Name</th>
            <th style={{ padding: '8px 12px', width: '20%' }}>Calories</th>
            <th style={{ padding: '8px 12px', width: '20%' }}>Protein</th>
            <th style={{ padding: '8px 12px', width: '20%' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {(recipes ?? []).map((recipe) => {
            const imageUrl = recipeImageUrl(recipe.image)
            return (
              <tr key={recipe.id} style={{ borderBottom: '1px solid var(--brand-border)' }}>
                <td style={{ padding: '8px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={recipe.name ?? ''}
                        width={36}
                        height={36}
                        style={{ borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 6,
                          background: 'var(--brand-border)',
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {recipe.name}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '8px 12px' }}>{recipe.total_calories ?? '—'}</td>
                <td style={{ padding: '8px 12px' }}>{recipe.total_protein ?? '—'}</td>
                <td style={{ padding: '8px 12px' }}>
                  <Link href={`/admin/recipes/${recipe.id}`} style={{ color: 'var(--brand-yellow)' }}>
                    View
                  </Link>
                </td>
              </tr>
            )
          })}
          {(recipes ?? []).length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: '16px 12px', color: '#888' }}>
                No recipes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  )
}