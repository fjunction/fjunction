import { AdminNav } from './_components/AdminNav'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-bg)' }}>
      <AdminNav />
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px' }}>{children}</div>
    </div>
  )
}