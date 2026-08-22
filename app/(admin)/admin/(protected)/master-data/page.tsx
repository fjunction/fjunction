import Link from 'next/link'

export const metadata = {
  title: 'Master Data Management',
}

const SECTIONS = [
  { href: '/admin/master-data/plan-types', label: 'Plan Types' },
  { href: '/admin/master-data/foods', label: 'Foods' },
  { href: '/admin/master-data/exercises', label: 'Exercises' },
]

export default function MasterDataPage() {
  return (
    <main style={{ padding: 24, color: '#fff' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Master Data Management</h1>
      <div style={{ display: 'flex', gap: 12 }}>
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            style={{
              padding: '16px 20px',
              borderRadius: 12,
              background: 'var(--brand-surface)',
              border: '1px solid var(--brand-border)',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            {s.label}
          </Link>
        ))}
      </div>
    </main>
  )
}