'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export async function addClient(formData: FormData) {
    const admin = createAdminClient()
    const email = (formData.get('email') as string) || null
  
    const { data: person, error: personError } = await admin
      .from('people')
      .insert({
        name: formData.get('name') as string,
        email,
        phone: (formData.get('phone') as string) || null,
        gender: (formData.get('gender') as string) || null,
        age: formData.get('age') ? Number(formData.get('age')) : null,
        is_client: true,
        source: 'admin_direct_add',
      })
      .select('id')
      .single()
  
    if (personError) {
      if (personError.code === '23505' && email) {
        const { data: existing } = await admin
          .from('people')
          .select('id, is_client')
          .eq('email', email)
          .maybeSingle()
  
        if (existing) {
          if (existing.is_client) {
            redirect(`/admin/clients/${existing.id}?notice=duplicate_email`)
          } else {
            redirect(`/admin/users/${existing.id}/convert?notice=duplicate_email`)
          }
        }
      }
      throw new Error(personError.message)
    }

  const { error: planError } = await admin.from('plans').insert({
    person_id: person.id,
    plan_type_id: formData.get('plan_type_id') as string,
    start_date: formData.get('start_date') as string,
    duration_days: Number(formData.get('duration_days')),
    is_active: true,
  })

  if (planError) throw new Error(planError.message)

  revalidatePath('/admin/clients')
  redirect(`/admin/clients/${person.id}`)
}