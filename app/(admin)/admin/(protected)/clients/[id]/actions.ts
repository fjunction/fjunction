'use server'

import { revalidatePath } from 'next/cache'
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