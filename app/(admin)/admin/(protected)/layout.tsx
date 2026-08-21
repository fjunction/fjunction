import { AdminNav } from './_components/AdminNav'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-bg)' }}>
      <AdminNav />
      <div>{children}</div>
    </div>
  )
}