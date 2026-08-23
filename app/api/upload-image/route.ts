import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const folder = (formData.get('folder') as string) || 'uploads'

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 })
  }

  const admin = createAdminClient()

  const ext = file.name.split('.').pop() || 'jpg'
  const safeBase = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '') || 'image'
  const filename = `${Date.now()}-${safeBase}.${ext}`
  const storagePath = `${folder}/${filename}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error } = await admin.storage.from('images').upload(storagePath, buffer, {
    contentType: file.type,
    upsert: false,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ path: storagePath })
}