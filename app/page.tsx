// app/page.tsx
import { getHomepageContent } from '@/lib/content'
import { Header } from '@/components/site/Header'
import { Hero } from '@/components/site/Hero'
import { Signals } from '@/components/site/Signals'
import { Framework } from '@/components/site/Framework'
import { Footer } from '@/components/site/Footer'

export const revalidate = 60 // re-fetch content at most once a minute; admin saves can also force a revalidatePath('/')

export default async function HomePage() {
  const { header, hero, signalsSection, signalCards, frameworkSection, frameworkSteps, footer } =
    await getHomepageContent()

  return (
    <>
      <Header
        logoImageUrl={header?.logo_image_url}
        logoText={header?.logo_text ?? 'fjunction'}
        navItems={header?.nav_items ?? []}
        ctaText={header?.cta_text ?? 'Analyse My Health'}
        ctaHref={header?.cta_href ?? '/analyse'}
      />

      <main>
        <Hero
          eyebrowText={hero?.eyebrow_text ?? ''}
          heading={hero?.heading ?? ''}
          subheading={hero?.subheading}
          primaryCtaText={hero?.primary_cta_text}
          primaryCtaHref={hero?.primary_cta_href}
          secondaryCtaText={hero?.secondary_cta_text}
          secondaryCtaHref={hero?.secondary_cta_href}
        />

        <Signals
          heading={signalsSection?.heading ?? ''}
          subheading={signalsSection?.subheading}
          cards={signalCards ?? []}
        />

        <Framework
          eyebrowText={frameworkSection?.eyebrow_text ?? ''}
          heading={frameworkSection?.heading ?? ''}
          subheading={frameworkSection?.subheading}
          steps={frameworkSteps ?? []}
        />
      </main>

      <Footer
        logoText={footer?.logo_text ?? 'fjunction'}
        disclaimerText={footer?.disclaimer_text}
        links={footer?.links ?? []}
        socials={footer?.socials ?? []}
      />
    </>
  )
}