import { createAdminClient } from '@/lib/supabase/admin'
import { updateClient, renewPlan } from '../actions'
import { EditClientForm } from './EditClientForm'
import { RenewPlanForm } from './RenewPlanForm'

export const metadata = {
    title: 'Edit Clients',
  }

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: person, error } = await admin
    .from('people')
    .select('id, name, email, phone, gender, age')
    .eq('id', id)
    .single()

  if (error || !person) {
    return (
      <main style={{ padding: 24, color: '#fff' }}>
        <h1>Client not found</h1>
      </main>
    )
  }

  const { data: planTypes } = await admin
    .from('plan_types')
    .select('id, name, price, default_duration_days')
    .eq('is_active', true)
    .order('name', { ascending: true })

  const updateClientWithId = updateClient.bind(null, person.id)
  const renewPlanWithId = renewPlan.bind(null, person.id)

  return (
    <main style={{ padding: 24, color: '#fff', maxWidth: 640 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Edit Client</h1>
      <EditClientForm action={updateClientWithId} defaults={person} />

      <hr style={{ border: 'none', borderTop: '1px solid var(--brand-border)', margin: '32px 0 24px' }} />

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Renew / Add New Plan</h2>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 16 }}>
        Use this when an existing client buys another plan — it adds a new plan record without touching their
        history.
      </p>
      <RenewPlanForm action={renewPlanWithId} planTypes={planTypes ?? []} />
    </main>
  )
}