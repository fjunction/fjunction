// app/(marketing)/services/mentorship-program/page.tsx
import { getProgramMentorshipContent } from '@/lib/content'
import { ProgramHero } from '@/components/site/ProgramHero'
import { ProgramTextSection } from '@/components/site/ProgramTextSection'
import { ProgramChecklist } from '@/components/site/ProgramChecklist'
import { ProgramPricingTable } from '@/components/site/ProgramPricingTable'
import { ClosingCta } from '@/components/site/ClosingCta'

export default async function MentorshipProgramPage() {
  const { page, benefits, pricingOptions } = await getProgramMentorshipContent()
  return (
    <>
      <ProgramHero
        badgeText={page?.badge_text} heading={page?.heading ?? ''} subheading={page?.subheading}
        facts={page?.mentor_name ? [{ label: 'Mentor', value: page.mentor_name }] : []}
        primaryCtaText={page?.primary_cta_text} primaryCtaHref={page?.primary_cta_href}
        secondaryCtaText={page?.secondary_cta_text} secondaryCtaHref={page?.secondary_cta_href}
      />
      <ProgramTextSection body={page?.about_body} />
      <ProgramChecklist heading={page?.benefits_heading} items={benefits ?? []} />
      <ProgramPricingTable heading={page?.pricing_heading} options={pricingOptions ?? []} />
      <ProgramTextSection heading={page?.note_heading} body={page?.note_body} />
      <ClosingCta heading={page?.cta_heading ?? ''} subheading={page?.cta_subheading} primaryCtaText={page?.cta_text} primaryCtaHref={page?.cta_href} />
    </>
  )
}