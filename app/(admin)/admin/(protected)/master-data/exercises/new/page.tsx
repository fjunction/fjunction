import { createExercise } from '../actions'
import { ExerciseFields } from '../ExerciseFields'

export default function NewExercisePage() {
  return (
    <main style={{ padding: 24, color: '#fff', maxWidth: 480 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Add Exercise</h1>
      <form action={createExercise} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ExerciseFields />
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