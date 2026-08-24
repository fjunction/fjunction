// components/site/Footer.tsx  (color-only changes — content/structure unchanged as you asked)
import Link from 'next/link'

type LinkItem = { label: string; href: string }

export function Footer({ logoText, disclaimerText, links, socials }: { logoText: string; disclaimerText?: string | null; links: LinkItem[]; socials: LinkItem[] }) {
  return (
    <footer className="bg-neutral-950 py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-3">
        <div>
          <span className="text-lg font-bold text-white">{logoText}</span>
          {disclaimerText && <p className="mt-3 max-w-sm text-xs leading-relaxed text-neutral-500">{disclaimerText}</p>}
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-white">Connect</h4>
          <ul className="mt-3 space-y-2">
            {socials.map((social) => (
              <li key={social.href}><Link href={social.href} className="text-sm text-neutral-400 hover:text-white">{social.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-white">Legal</h4>
          <ul className="mt-3 space-y-2">
            {links.map((link) => (
              <li key={link.href}><Link href={link.href} className="text-sm text-neutral-400 hover:text-white">{link.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}