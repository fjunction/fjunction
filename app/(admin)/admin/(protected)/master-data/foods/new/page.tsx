import { createFood } from '../actions'
import { FoodFields } from '../FoodFields'

export const metadata = {
  title: 'Add New Food',
}

export default function NewFoodPage() {
  return (
    <main style={{ padding: 24, color: '#fff', maxWidth: 640 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Add Food</h1>
      <form action={createFood} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <FoodFields />
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
          Save
        </button>
      </form>
    </main>
  )
}