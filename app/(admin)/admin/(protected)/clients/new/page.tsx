import { createAdminClient } from '@/lib/supabase/admin'
import { addClient } from '../actions'
import { AddClientForm } from './AddClientForm'

export default async function NewClientPage() {
  const admin = createAdminClient()

  const { data: planTypes, error } = await admin
    .from('plan_types')
    .select('id, name, price, default_duration_days')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Error loading plan types</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </main>
    )
  }

  return (
    <main style={{ padding: 24, color: '#fff', maxWidth: 480 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Add Client</h1>
      <AddClientForm action={addClient} planTypes={planTypes ?? []} />
    </main>
  )
}