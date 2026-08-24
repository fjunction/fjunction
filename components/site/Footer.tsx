// components/site/Footer.tsx
import Link from 'next/link'

type LinkItem = { label: string; href: string }

export function Footer({
  logoText,
  disclaimerText,
  links,
  socials,
}: {
  logoText: string
  disclaimerText?: string | null
  links: LinkItem[]
  socials: LinkItem[]
}) {
  return (
    <footer className="bg-gray-50 py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-3">
        <div>
          <span className="text-lg font-bold text-gray-900">{logoText}</span>
          {disclaimerText && (
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-gray-500">{disclaimerText}</p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900">Links</h4>
          <ul className="mt-3 space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link target='_blank' href={link.href} className="text-sm text-gray-500 hover:text-gray-900">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900">Social</h4>
          <ul className="mt-3 space-y-2">
            {socials.map((social) => (
              <li key={social.href}>
                <Link target='_blank' href={social.href} className="text-sm text-gray-500 hover:text-gray-900">
                  {social.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}