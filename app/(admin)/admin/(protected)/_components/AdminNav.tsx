'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/admin/users', label: 'User Management' },
  { href: '/admin/clients', label: 'Client Management' },
  { href: '/admin/diet-plans', label: 'Diet Plan Management' },
  { href: '/admin/workout-plans', label: 'Workout Plan Management' },
  { href: '/admin/recipes', label: 'Recipe Management' },
  { href: '/admin/master-data', label: 'Master Data' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <header
      style={{
        background: 'var(--brand-surface)',
        borderBottom: '1px solid var(--brand-border)',
        padding: '0 24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 56, overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Fitness Junction" width={28} height={28} style={{ borderRadius: '50%' }} />
          <span style={{ fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>Fitness Junction</span>
        </div>

        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                color: active ? '#fff' : '#aaa',
                background: active ? 'var(--brand-gradient)' : 'transparent',
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </header>
  )
}