import fs from 'fs'
import path from 'path'
import { renderToBuffer } from '@react-pdf/renderer'
import { createAdminClient } from '@/lib/supabase/admin'
import { WorkoutPlanDocument } from './WorkoutPlanDocument'

export const runtime = 'nodejs'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: workoutPlan, error } = await admin
    .from('workout_plans')
    .select('id, plan_name, total_days, place, goal, experience, workout_notes, remarks, people(name)')
    .eq('id', id)
    .single()

  if (error || !workoutPlan) {
    return new Response('Workout plan not found', { status: 404 })
  }

  const { data: daysRaw } = await admin
    .from('workout_plan_days')
    .select('id, day_number, day_title')
    .eq('workout_plan_id', id)
    .order('day_number', { ascending: true })

  const days = []
  for (const day of daysRaw ?? []) {
    const { data: exs } = await admin
      .from('workout_plan_exercises')
      .select('exercise_name_snapshot, sets, reps, sort_order')
      .eq('workout_plan_day_id', day.id)
      .order('sort_order', { ascending: true })

    days.push({ day_title: day.day_title, exercises: exs ?? [] })
  }

  let logoBuffer: Buffer | null = null
  try {
    logoBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'logo.png'))
  } catch {
    logoBuffer = null
  }

  const buffer = await renderToBuffer(WorkoutPlanDocument({ workoutPlan: workoutPlan as any, days, logoBuffer }))

  const person = (workoutPlan as any).people
  const safeName = (person?.name ?? 'client').replace(/[^a-zA-Z0-9]/g, '')
  const safePlanName = (workoutPlan.plan_name ?? 'plan').replace(/[^a-zA-Z0-9]/g, '')
  const dateStr = new Date().toISOString().slice(0, 10)
  const filename = `${safeName}-${safePlanName}-${dateStr}.pdf`

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}