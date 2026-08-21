import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminHomePage() {
  const supabase = createAdminClient()

  const { count, error } = await supabase
    .from('people')
    .select('*', { count: 'exact', head: true })

  if (error) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Supabase connection failed</h1>
        <pre>{error.message}</pre>
      </main>
    )
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Fitness Junction Admin</h1>
      <p>Connected to Supabase. Found {count} rows in `people`.</p>
    </main>
  )
}