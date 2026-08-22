import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { deleteFood } from './actions'

export const metadata = {
  title: 'Foods',
}

function foodImageUrl(path: string | null) {
  if (!path) return null
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${path}`
}

export default async function FoodsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const admin = createAdminClient()

  let query = admin
    .from('foods')
    .select('id, name, image, is_veg, quantity, unit, calories, protein, fats, carbs, sugar, fiber, rich_in')
    .order('name', { ascending: true })

  if (q) {
    query = query.ilike('name', `%${q}%`)
  }

  const { data: foods, error } = await query

  if (error) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Error loading foods</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </main>
    )
  }

  return (
    <main style={{ padding: 24, color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Foods</h1>

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
            href="/admin/master-data/foods/new"
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
            + Add Food
          </Link>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--brand-border)' }}>
            <th style={{ padding: '8px 12px', width: '33%' }}>Name</th>
            <th style={{ padding: '8px 12px', width: '12%' }}>Serving Size</th>
            <th style={{ padding: '8px 12px', width: '10%' }}>Total Calories</th>
            <th style={{ padding: '8px 12px' }} colSpan={5}>
              Macros
            </th>
            <th style={{ padding: '8px 12px', width: '8%' }}>Action</th>
          </tr>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--brand-border)' }}>
            <th />
            <th />
            <th />
            <th style={{ padding: '4px 12px', fontSize: 12, color: '#888' }}>Protein</th>
            <th style={{ padding: '4px 12px', fontSize: 12, color: '#888' }}>Fats</th>
            <th style={{ padding: '4px 12px', fontSize: 12, color: '#888' }}>Carbs</th>
            <th style={{ padding: '4px 12px', fontSize: 12, color: '#888' }}>Sugar</th>
            <th style={{ padding: '4px 12px', fontSize: 12, color: '#888' }}>Fiber</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(foods ?? []).map((food) => {
            const imageUrl = foodImageUrl(food.image)
            return (
              <tr key={food.id} style={{ borderBottom: '1px solid var(--brand-border)' }}>
                <td style={{ padding: '8px 12px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={food.name}
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
                    <span
                      title={food.is_veg ? 'Vegetarian' : 'Non-Vegetarian'}
                      style={{ color: food.is_veg ? '#22c55e' : '#ef4444', fontSize: 12, flexShrink: 0 }}
                    >
                      ▲
                    </span>
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {food.name}
                    </span>
                  </div>
                  {food.rich_in && (
                    <div style={{ fontSize: 12, color: '#888', marginLeft: 46 }}>
                      Key Nutrients: {food.rich_in}
                    </div>
                  )}
                </td>
                <td style={{ padding: '8px 12px' }}>
                  {food.quantity} {food.unit}
                </td>
                <td style={{ padding: '8px 12px' }}>{food.calories}</td>
                <td style={{ padding: '8px 12px' }}>{food.protein}g</td>
                <td style={{ padding: '8px 12px' }}>{food.fats}g</td>
                <td style={{ padding: '8px 12px' }}>{food.carbs}g</td>
                <td style={{ padding: '8px 12px' }}>{food.sugar}g</td>
                <td style={{ padding: '8px 12px' }}>{food.fiber}g</td>
                <td style={{ padding: '8px 12px', display: 'flex', gap: 12 }}>
                  <Link href={`/admin/master-data/foods/${food.id}/edit`} style={{ color: 'var(--brand-yellow)' }}>
                    Edit
                  </Link>
                  <form
                    action={async () => {
                      'use server'
                      await deleteFood(food.id)
                    }}
                  >
                    <button
                      type="submit"
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 0 }}
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            )
          })}
          {(foods ?? []).length === 0 && (
            <tr>
              <td colSpan={9} style={{ padding: '16px 12px', color: '#888' }}>
                No foods found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  )
}