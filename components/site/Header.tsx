// components/site/Header.tsx
import Link from 'next/link'
import Image from 'next/image'

type NavItem = { label: string; href: string }

export function Header({
  logoImageUrl, logoText, navItems, ctaText, ctaHref,
}: {
  logoImageUrl?: string | null
  logoText: string
  navItems: NavItem[]
  ctaText: string
  ctaHref: string
}) {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          {logoImageUrl ? (
            <Image src={logoImageUrl} alt={logoText} width={48} height={48} className="rounded-full" />
          ) : (
            <span className="h-7 w-7 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400" />
          )}
          <span className="text-lg font-bold text-orange-500">F</span>
          <span className="text-lg font-bold text-white">Junction</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-neutral-300 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href={ctaHref} className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-200">
          {ctaText}
        </Link>
      </div>
    </header>
  )
}