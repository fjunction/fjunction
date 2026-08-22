import { createAdminClient } from '@/lib/supabase/admin'
import { convertToClient } from '../../actions'
import { ConvertForm } from './ConvertForm'

export default async function ConvertPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ notice?: string }>
}) {
  const { id } = await params
  const { notice } = await searchParams
  const admin = createAdminClient()

  const { data: person, error: personError } = await admin
    .from('people')
    .select('id, name, email, phone')
    .eq('id', id)
    .single()

  if (personError || !person) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Person not found</h1>
      </main>
    )
  }

  const { data: planTypes, error: planTypesError } = await admin
    .from('plan_types')
    .select('id, name, price, default_duration_days')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (planTypesError) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Error loading plan types</h1>
        <pre>{JSON.stringify(planTypesError, null, 2)}</pre>
      </main>
    )
  }

  const convertPersonAction = convertToClient.bind(null, person.id)

  return (
    <main style={{ padding: 24, color: '#fff', maxWidth: 480 }}>
    {notice === 'duplicate_email' && (
      <div
        style={{
          padding: '10px 16px',
          borderRadius: 8,
          background: 'var(--brand-surface)',
          border: '1px solid var(--brand-yellow)',
          color: 'var(--brand-yellow)',
          marginBottom: 16,
        }}
      >
        That email already belonged to this person — showing their existing record instead of creating a duplicate.
      </div>
    )}
    <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Convert to Client</h1>
      <p style={{ color: '#888', marginBottom: 16 }}>{person.name}</p>

      <ConvertForm action={convertPersonAction} planTypes={planTypes ?? []} />
    </main>
  )
}