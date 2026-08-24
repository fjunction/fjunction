// app/(marketing)/page.tsx
import { getHomepageContent } from '@/lib/content'
import { Hero } from '@/components/site/Hero'
import { Signals } from '@/components/site/Signals'
import { IsolationCallout } from '@/components/site/IsolationCallout'
import { Framework } from '@/components/site/Framework'
import { SystemDiagram } from '@/components/site/SystemDiagram'
import { Panel } from '@/components/site/Panel'
import { ClosingCta } from '@/components/site/ClosingCta'

export default async function HomePage() {
  const { hero, signalsSection, signalCards, isolationCallout, frameworkSection, frameworkSteps, systemSection, systemTags, systemNodes, panelSection, panelStats, closingCta } = await getHomepageContent()

  return (
    <>
      <Hero
        tagLine={hero?.tag_line} heading={hero?.heading ?? ''} subheading={hero?.subheading}
        disclaimerText={hero?.disclaimer_text} photoUrl={hero?.photo_url} consultationNoteText={hero?.consultation_note_text}
        primaryCtaText={hero?.primary_cta_text} primaryCtaHref={hero?.primary_cta_href}
        secondaryCtaText={hero?.secondary_cta_text} secondaryCtaHref={hero?.secondary_cta_href}
      />
      <Signals heading={signalsSection?.heading ?? ''} headingSecondary={signalsSection?.heading_secondary} subheading={signalsSection?.subheading} cards={signalCards ?? []} />
      <IsolationCallout heading={isolationCallout?.heading ?? ''} bodyText={isolationCallout?.body_text} />
      <Framework eyebrowText={frameworkSection?.eyebrow_text ?? ''} heading={frameworkSection?.heading ?? ''} subheading={frameworkSection?.subheading} steps={frameworkSteps ?? []} />
      <SystemDiagram heading={systemSection?.heading ?? ''} headingSecondary={systemSection?.heading_secondary} subheading={systemSection?.subheading} tags={systemTags ?? []} nodes={systemNodes ?? []} />
      <Panel
        eyebrowText={panelSection?.eyebrow_text ?? ''} heading={panelSection?.heading ?? ''} bodyText={panelSection?.body_text}
        photoUrl={panelSection?.photo_url} statusBadgeText={panelSection?.status_badge_text}
        personName={panelSection?.person_name} personExperienceText={panelSection?.person_experience_text} stats={panelStats ?? []}
      />
      <ClosingCta
        heading={closingCta?.heading ?? ''} subheading={closingCta?.subheading}
        primaryCtaText={closingCta?.primary_cta_text} primaryCtaHref={closingCta?.primary_cta_href}
        secondaryCtaText={closingCta?.secondary_cta_text} secondaryCtaHref={closingCta?.secondary_cta_href}
        linkText={closingCta?.link_text} linkHref={closingCta?.link_href}
      />
    </>
  )
}