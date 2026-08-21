'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

function readExerciseFields(formData: FormData) {
  return {
    name: (formData.get('name') as string) || null,
    description: (formData.get('description') as string) || null,
    image: (formData.get('image') as string) || null,
    video: (formData.get('video') as string) || null,
    muscle_image: (formData.get('muscle_image') as string) || null,
    places: (formData.get('places') as string) || null,
    body_parts: (formData.get('body_parts') as string) || null,
    muscles: (formData.get('muscles') as string) || null,
    secondary_muscles: (formData.get('secondary_muscles') as string) || null,
    levels: (formData.get('levels') as string) || null,
    pursuits: (formData.get('pursuits') as string) || null,
    motion: (formData.get('motion') as string) || null,
  }
}

export async function createExercise(formData: FormData) {
  const admin = createAdminClient()

  // exercises.id has no default/auto-increment — compute the next id ourselves.
  const { data: maxRow, error: maxError } = await admin
    .from('exercises')
    .select('id')
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (maxError) throw new Error(maxError.message)

  const nextId = (maxRow?.id ?? 0) + 1

  const { error } = await admin.from('exercises').insert({ id: nextId, ...readExerciseFields(formData) })

  if (error) throw new Error(error.message)

  revalidatePath('/admin/master-data/exercises')
  redirect('/admin/master-data/exercises')
}

export async function updateExercise(id: number, formData: FormData) {
  const admin = createAdminClient()
  const { error } = await admin.from('exercises').update(readExerciseFields(formData)).eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/master-data/exercises')
  redirect('/admin/master-data/exercises')
}

export async function deleteExercise(id: number) {
  const admin = createAdminClient()
  const { error } = await admin.from('exercises').delete().eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/master-data/exercises')
}