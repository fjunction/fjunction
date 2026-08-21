'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

function readPlanTypeFields(formData: FormData) {
  return {
    name: formData.get('name') as string,
    price: formData.get('price') ? Number(formData.get('price')) : null,
    default_duration_days: formData.get('default_duration_days')
      ? Number(formData.get('default_duration_days'))
      : null,
    description: (formData.get('description') as string) || null,
    is_active: formData.get('is_active') === 'on',
  }
}

export async function createPlanType(formData: FormData) {
  const admin = createAdminClient()
  const { error } = await admin.from('plan_types').insert(readPlanTypeFields(formData))

  if (error) throw new Error(error.message)

  revalidatePath('/admin/master-data/plan-types')
  redirect('/admin/master-data/plan-types')
}

export async function updatePlanType(id: string, formData: FormData) {
  const admin = createAdminClient()
  const { error } = await admin.from('plan_types').update(readPlanTypeFields(formData)).eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/master-data/plan-types')
  redirect('/admin/master-data/plan-types')
}

export async function deletePlanType(id: string) {
  const admin = createAdminClient()
  const { error } = await admin.from('plan_types').delete().eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/master-data/plan-types')
}