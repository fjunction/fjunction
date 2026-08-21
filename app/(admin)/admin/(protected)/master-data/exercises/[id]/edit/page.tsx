import { createAdminClient } from '@/lib/supabase/admin'
import { updateExercise } from '../../actions'
import { ExerciseFields } from '../../ExerciseFields'

export default async function EditExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: exercise, error } = await admin.from('exercises').select('*').eq('id', id).single()

  if (error || !exercise) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Exercise not found</h1>
      </main>
    )
  }

  const updateExerciseWithId = updateExercise.bind(null, exercise.id)

  return (
    <main style={{ padding: 24, color: '#fff', maxWidth: 480 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Edit Exercise</h1>
      <form action={updateExerciseWithId} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ExerciseFields defaults={exercise} />
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