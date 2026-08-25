// components/site/Header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'

type NavChild = { label: string; href: string }
type NavItem = { label: string; href: string; children?: NavChild[] }

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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)

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
          {navItems.map((item) =>
            item.children && item.children.length > 0 ? (
              <div key={item.href} className="group relative">
                <Link href={item.href} className="flex items-center gap-1 text-sm text-neutral-300 hover:text-white">
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Link>
                <div className="invisible absolute left-0 top-full z-10 w-64 rounded-lg border border-neutral-800 bg-neutral-900 p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href} className="block rounded-md px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white">
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className="text-sm text-neutral-300 hover:text-white">
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link href={ctaHref} className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-200 sm:inline-block">
            {ctaText}
          </Link>
          <button type="button" onClick={() => setMobileOpen((prev) => !prev)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} className="rounded-md p-2 text-white md:hidden">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-neutral-800 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) =>
              item.children && item.children.length > 0 ? (
                <div key={item.href}>
                  <div className="flex items-center justify-between">
                    <Link href={item.href} onClick={() => setMobileOpen(false)} className="flex-1 rounded-md px-2 py-2.5 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white">
                      {item.label}
                    </Link>
                    <button type="button" onClick={() => setMobileExpanded((prev) => (prev === item.href ? null : item.href))} aria-label="Toggle submenu" className="p-2 text-neutral-400">
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileExpanded === item.href ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {mobileExpanded === item.href && (
                    <div className="ml-4 flex flex-col gap-1 border-l border-neutral-800 pl-3">
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href} onClick={() => setMobileOpen(false)} className="rounded-md px-2 py-2 text-sm text-neutral-400 hover:bg-neutral-900 hover:text-white">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="rounded-md px-2 py-2.5 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white">
                  {item.label}
                </Link>
              )
            )}
            <Link href={ctaHref} onClick={() => setMobileOpen(false)} className="mt-2 rounded-full bg-white px-5 py-2.5 text-center text-sm font-medium text-neutral-900 hover:bg-neutral-200">
              {ctaText}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}