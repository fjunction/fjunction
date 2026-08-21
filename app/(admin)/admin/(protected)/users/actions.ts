'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export async function convertToClient(personId: string, formData: FormData) {
  const admin = createAdminClient()

  const planTypeId = formData.get('plan_type_id') as string
  const startDate = formData.get('start_date') as string
  const durationDays = Number(formData.get('duration_days'))

  const { error: planError } = await admin.from('plans').insert({
    person_id: personId,
    plan_type_id: planTypeId,
    start_date: startDate,
    duration_days: durationDays,
    is_active: true,
  })

  if (planError) throw new Error(planError.message)

  const { error: personError } = await admin.from('people').update({ is_client: true }).eq('id', personId)

  if (personError) throw new Error(personError.message)

  revalidatePath('/admin/users')
  revalidatePath('/admin/clients')
  redirect('/admin/users')
}