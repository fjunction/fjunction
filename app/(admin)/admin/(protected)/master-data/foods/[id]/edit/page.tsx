import { createAdminClient } from '@/lib/supabase/admin'
import { updateFood } from '../../actions'
import { FoodFields } from '../../FoodFields'

export default async function EditFoodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: food, error } = await admin.from('foods').select('*').eq('id', id).single()

  if (error || !food) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Food not found</h1>
      </main>
    )
  }

  const updateFoodWithId = updateFood.bind(null, food.id)

  return (
    <main style={{ padding: 24, color: '#fff', maxWidth: 480 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Edit Food</h1>
      <form action={updateFoodWithId} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <FoodFields defaults={food} />
        <button
          type="submit"
          style={{
            marginTop: 8,
            padding: '10px 12px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--brand-gradient)',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Save Changes
        </button>
      </form>
    </main>
  )
}