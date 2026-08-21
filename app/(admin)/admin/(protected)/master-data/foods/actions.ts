'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

function readFoodFields(formData: FormData) {
  return {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    is_veg: formData.get('is_veg') === 'on',
    carbs: Number(formData.get('carbs')) || 0,
    sugar: Number(formData.get('sugar')) || 0,
    fiber: Number(formData.get('fiber')) || 0,
    protein: Number(formData.get('protein')) || 0,
    fats: Number(formData.get('fats')) || 0,
    calories: Number(formData.get('calories')) || 0,
    unit: (formData.get('unit') as string) || null,
    rich_in: (formData.get('rich_in') as string) || null,
    image: (formData.get('image') as string) || null,
    quantity: Number(formData.get('quantity')) || 0,
    rda: Number(formData.get('rda')) || 0,
  }
}

export async function createFood(formData: FormData) {
  const admin = createAdminClient()
  const { error } = await admin.from('foods').insert(readFoodFields(formData))

  if (error) throw new Error(error.message)

  revalidatePath('/admin/master-data/foods')
  redirect('/admin/master-data/foods')
}

export async function updateFood(id: number, formData: FormData) {
  const admin = createAdminClient()
  const { error } = await admin.from('foods').update(readFoodFields(formData)).eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/master-data/foods')
  redirect('/admin/master-data/foods')
}

export async function deleteFood(id: number) {
  const admin = createAdminClient()
  const { error } = await admin.from('foods').delete().eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/master-data/foods')
}