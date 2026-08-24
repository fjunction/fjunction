// app/(marketing)/page.tsx
import { getHomepageContent } from '@/lib/content'
import { Hero } from '@/components/site/Hero'
import { Signals } from '@/components/site/Signals'
import { Framework } from '@/components/site/Framework'
import { Panel } from '@/components/site/Panel'

export default async function HomePage() {
  const { hero, signalsSection, signalCards, frameworkSection, frameworkSteps, panelSection, panelStats } =
    await getHomepageContent()

  return (
    <>
      <Hero
        eyebrowText={hero?.eyebrow_text ?? ''}
        heading={hero?.heading ?? ''}
        subheading={hero?.subheading}
        primaryCtaText={hero?.primary_cta_text}
        primaryCtaHref={hero?.primary_cta_href}
        secondaryCtaText={hero?.secondary_cta_text}
        secondaryCtaHref={hero?.secondary_cta_href}
      />
      <Signals heading={signalsSection?.heading ?? ''} subheading={signalsSection?.subheading} cards={signalCards ?? []} />
      <Framework
        eyebrowText={frameworkSection?.eyebrow_text ?? ''}
        heading={frameworkSection?.heading ?? ''}
        subheading={frameworkSection?.subheading}
        steps={frameworkSteps ?? []}
      />
      <Panel
        eyebrowText={panelSection?.eyebrow_text ?? ''}
        heading={panelSection?.heading ?? ''}
        bodyText={panelSection?.body_text}
        photoUrl={panelSection?.photo_url}
        statusBadgeText={panelSection?.status_badge_text}
        personName={panelSection?.person_name}
        personExperienceText={panelSection?.person_experience_text}
        stats={panelStats ?? []}
      />
    </>
  )
}