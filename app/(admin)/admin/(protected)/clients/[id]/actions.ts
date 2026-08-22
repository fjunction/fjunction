'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function addClientNote(personId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const admin = createAdminClient()
  const { error } = await admin.from('client_notes').insert({
    person_id: personId,
    note: formData.get('note') as string,
    created_by: user?.email ?? null,
  })

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/clients/${personId}`)
}

export async function updateClient(personId: string, formData: FormData) {
  const admin = createAdminClient()

  const { error } = await admin
    .from('people')
    .update({
      name: formData.get('name') as string,
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      gender: (formData.get('gender') as string) || null,
      age: formData.get('age') ? Number(formData.get('age')) : null,
    })
    .eq('id', personId)

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/clients/${personId}`)
  revalidatePath('/admin/clients')
  redirect(`/admin/clients/${personId}`)
}

export async function renewPlan(personId: string, formData: FormData) {
  const admin = createAdminClient()

  const { error } = await admin.from('plans').insert({
    person_id: personId,
    plan_type_id: formData.get('plan_type_id') as string,
    start_date: formData.get('start_date') as string,
    duration_days: Number(formData.get('duration_days')),
    is_active: true,
  })

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/clients/${personId}`)
  revalidatePath(`/admin/clients/${personId}/edit`)
  redirect(`/admin/clients/${personId}`)
}