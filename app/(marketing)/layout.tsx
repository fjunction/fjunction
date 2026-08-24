// app/(marketing)/layout.tsx
import { getSiteChrome } from '@/lib/content'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'

export const revalidate = 60

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { header, footer } = await getSiteChrome()

  return (
    <>
      <Header
        logoImageUrl={header?.logo_image_url}
        logoText={header?.logo_text ?? 'fjunction'}
        navItems={header?.nav_items ?? []}
        ctaText={header?.cta_text ?? 'Analyse My Health'}
        ctaHref={header?.cta_href ?? '/analyse'}
      />
      <main>{children}</main>
      <Footer
        logoText={footer?.logo_text ?? 'fjunction'}
        disclaimerText={footer?.disclaimer_text}
        links={footer?.links ?? []}
        socials={footer?.socials ?? []}
      />
    </>
  )
}