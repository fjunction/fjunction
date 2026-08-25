// app/(marketing)/services/page.tsx
import { getServicesContent } from '@/lib/content'
import { ServicesHero } from '@/components/site/ServicesHero'
import { ProtocolSection } from '@/components/site/ProtocolSection'
import { ClosingCta } from '@/components/site/ClosingCta'

export default async function ServicesPage() {
  const { hero, protocolSection, protocolCards, cta } = await getServicesContent()
  return (
    <>
      <ServicesHero
        eyebrowText={hero?.eyebrow_text ?? ''} heading={hero?.heading ?? ''} subheading={hero?.subheading} photoUrl={hero?.photo_url}
        primaryCtaText={hero?.primary_cta_text} primaryCtaHref={hero?.primary_cta_href}
        secondaryCtaText={hero?.secondary_cta_text} secondaryCtaHref={hero?.secondary_cta_href}
      />
      <ProtocolSection heading={protocolSection?.heading ?? ''} subheading={protocolSection?.subheading} cards={protocolCards ?? []} />
      <ClosingCta
        heading={cta?.heading ?? ''} subheading={cta?.subheading}
        primaryCtaText={cta?.primary_cta_text} primaryCtaHref={cta?.primary_cta_href}
        secondaryCtaText={cta?.secondary_cta_text} secondaryCtaHref={cta?.secondary_cta_href}
      />
    </>
  )
}