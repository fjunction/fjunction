// components/site/Header.tsx
import Link from 'next/link'
import Image from 'next/image'

type NavItem = { label: string; href: string }

export function Header({
  logoImageUrl,
  logoText,
  navItems,
  ctaText,
  ctaHref,
}: {
  logoImageUrl?: string | null
  logoText: string
  navItems: NavItem[]
  ctaText: string
  ctaHref: string
}) {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="FJunction" width={48} height={48} style={{ borderRadius: '120%' }} />
          <span className="text-lg font-bold text-orange-500">Fitness</span>
          <span className="text-lg font-bold text-gray-900">Junction</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-gray-700 hover:text-gray-900">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href={ctaHref}
          className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          {ctaText}
        </Link>
      </div>
    </header>
  )
}